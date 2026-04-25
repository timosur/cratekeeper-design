import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { AppShell, type NavigationItem } from "@/shell/components/AppShell";
import { loadProductData } from "@/lib/product-loader";
import {
  getSectionScreenDesigns,
  loadScreenDesignComponent,
} from "@/lib/section-loader";

/**
 * Map section ids (from product-roadmap.md, slugified) to the AppShell's
 * built-in icon vocabulary.
 */
const ICON_BY_SECTION_ID: Record<string, NavigationItem["icon"]> = {
  dashboard: "dashboard",
  "event-detail": "event",
  settings: "settings",
  "master-library": "library",
  "audit-log": "audit",
};

/**
 * The ClickdummyApp is a single-route app that wraps every designed section in
 * the application shell with working inter-section navigation. It is mounted at
 * `/clickdummy/preview` so it can be shared with stakeholders for demos.
 */
export default function ClickdummyApp() {
  const productData = useMemo(() => loadProductData(), []);
  const sections = useMemo(
    () => productData.roadmap?.sections ?? [],
    [productData.roadmap],
  );

  const [activeSectionId, setActiveSectionId] = useState<string>(
    () => sections[0]?.id ?? "",
  );
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Inherit theme from Design OS / system on first mount.
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    let resolved: "light" | "dark";
    if (stored === "dark" || stored === "light") {
      resolved = stored;
    } else {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    setTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore storage errors (private mode, etc.)
      }
      return next;
    });
  }, []);

  const navigationItems: NavigationItem[] = useMemo(
    () =>
      sections.map((section) => ({
        label: section.title,
        href: `/${section.id}`,
        icon: ICON_BY_SECTION_ID[section.id] ?? "dashboard",
        isActive: section.id === activeSectionId,
      })),
    [sections, activeSectionId],
  );

  const handleNavigate = useCallback(
    (href: string) => {
      const sectionId = href.startsWith("/") ? href.slice(1) : href;
      const matched = sections.find((s) => s.id === sectionId);
      if (matched) setActiveSectionId(matched.id);
    },
    [sections],
  );

  const ActiveComponent = useMemo(() => {
    if (!activeSectionId) return null;
    const screenDesigns = getSectionScreenDesigns(activeSectionId);
    if (screenDesigns.length === 0) return null;
    const loader = loadScreenDesignComponent(
      activeSectionId,
      screenDesigns[0].name,
    );
    if (!loader) return null;
    return lazy(async () => {
      try {
        const mod = await loader();
        if (mod?.default) return mod;
        return {
          default: () => <FallbackContent sectionId={activeSectionId} />,
        };
      } catch {
        return {
          default: () => <FallbackContent sectionId={activeSectionId} />,
        };
      }
    });
  }, [activeSectionId]);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <AppShell
        navigationItems={navigationItems}
        jobActivity={{ running: 1, queued: 3 }}
        connection={{ api: "connected", sse: "connected" }}
        user={{ name: "Demo User", email: "demo@cratekeeper.local" }}
        version="v1.0.0"
        theme={theme}
        topBarTitle={activeSection?.title}
        onNavigate={handleNavigate}
        onNewEvent={() => console.log("New event")}
        onJobsClick={() => console.log("Open jobs")}
        onOpenDataFolder={() => console.log("Open data folder")}
        onToggleTheme={handleToggleTheme}
        onLogout={() => console.log("Logout")}
      >
        <Suspense fallback={<LoadingSkeleton />}>
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <FallbackContent sectionId={activeSectionId} />
          )}
        </Suspense>
      </AppShell>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-8 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-md bg-neutral-200 dark:bg-neutral-800"
          />
        ))}
      </div>
    </div>
  );
}

function FallbackContent({ sectionId }: { sectionId: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg font-medium text-neutral-600 dark:text-neutral-400">
          No screen design found for &ldquo;{sectionId}&rdquo;
        </p>
        <p
          className="mt-1 text-sm text-neutral-500 dark:text-neutral-500"
          style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
        >
          Use the @07-design-screen agent to create one.
        </p>
      </div>
    </div>
  );
}

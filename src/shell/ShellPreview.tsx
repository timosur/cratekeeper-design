import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AppShell, type NavigationItem } from "./components/AppShell";

export default function ShellPreview() {
  const [activeHref, setActiveHref] = useState("/");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const navigationItems: NavigationItem[] = [
    { label: "Events", href: "/", icon: "event", isActive: activeHref === "/" },
    { label: "Master Library", href: "/library", icon: "library", isActive: activeHref === "/library" },
    { label: "Settings", href: "/settings", icon: "settings", isActive: activeHref === "/settings" },
    { label: "Audit Log", href: "/audit", icon: "audit", isActive: activeHref === "/audit" },
  ];

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <AppShell
        navigationItems={navigationItems}
        jobActivity={{ running: 1, queued: 3 }}
        connection={{ api: "connected", sse: "connected" }}
        user={{ name: "Alex Morgan", email: "alex@local" }}
        version="v1.0.0"
        theme={theme}
        topBarBreadcrumb={
          <span className="flex items-center gap-1.5">
            Events
            <ChevronRight className="h-3 w-3" />
          </span>
        }
        topBarTitle="Sarah & Mike's Wedding"
        topBarActions={
          <button
            type="button"
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Resume job
          </button>
        }
        onNavigate={(href) => setActiveHref(href)}
        onNewEvent={() => console.log("New event")}
        onJobsClick={() => console.log("Open jobs")}
        onOpenDataFolder={() => console.log("Open data folder")}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onLogout={() => console.log("Logout")}
      >
        <div
          className="space-y-4"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Section content renders here
            </div>
            <div
              className="mt-2 text-xs text-neutral-500"
              style={{ fontFamily: "JetBrains Mono, ui-monospace, monospace" }}
            >
              /events/sarah-mike-wedding
            </div>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

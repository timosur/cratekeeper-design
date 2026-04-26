import { useState, type ReactNode } from "react";
import { AppShell, type NavigationItem } from "./AppShell";

/**
 * Wrapper around AppShell used by Design OS to frame each screen design.
 * Accepts only `children` and supplies sensible default props for previews.
 */
export default function ShellWrapper({ children }: { children?: ReactNode }) {
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
        topBarTitle="Events"
        onNavigate={(href) => setActiveHref(href)}
        onNewEvent={() => console.log("New event")}
        onJobsClick={() => console.log("Open jobs")}
        onOpenDataFolder={() => console.log("Open data folder")}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onLogout={() => console.log("Logout")}
      >
        {children}
      </AppShell>
    </div>
  );
}

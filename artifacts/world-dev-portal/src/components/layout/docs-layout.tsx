import React from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { Moon, Sun, Menu, X, ChevronRight } from "lucide-react";

const docNav = [
  {
    title: "Getting Started",
    slug: "getting-started",
    items: [
      { title: "Quickstart", slug: "getting-started" },
      { title: "Core Concepts", slug: "docs" },
      { title: "Developer App Setup", slug: "getting-started" },
    ],
    status: "stable",
  },
  {
    title: "World ID",
    slug: "world-id",
    items: [
      { title: "Verification Lifecycle", slug: "world-id" },
      { title: "ZK Proofs", slug: "world-id" },
      { title: "Nullifier Hash", slug: "world-id" },
    ],
    status: "stable",
  },
  {
    title: "Wallet & Transactions",
    slug: "wallet",
    items: [
      { title: "Wallet Overview", slug: "wallet" },
      { title: "World Chain", slug: "wallet" },
      { title: "Gas Abstraction", slug: "wallet" },
    ],
    status: "stable",
  },
  {
    title: "Mini Apps",
    slug: "mini-apps",
    items: [
      { title: "Mini Apps Overview", slug: "mini-apps" },
      { title: "MiniKit Commands", slug: "mini-apps" },
      { title: "Pay Command", slug: "mini-apps" },
    ],
    status: "beta",
  },
  {
    title: "API Reference",
    slug: "api",
    items: [
      { title: "Authentication", slug: "api" },
      { title: "Verify Endpoint", slug: "api" },
      { title: "Credentials", slug: "api" },
    ],
    status: "stable",
  },
  {
    title: "SDKs",
    slug: "sdks",
    items: [
      { title: "IDKit", slug: "sdks" },
      { title: "MiniKit JS", slug: "sdks" },
      { title: "iOS SDK", slug: "sdks" },
      { title: "Android SDK", slug: "sdks" },
    ],
    status: "stable",
  },
];

const statusColors: Record<string, string> = {
  stable: "bg-green-500/15 text-green-600 dark:text-green-400",
  beta: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  draft: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  planned: "bg-gray-500/15 text-gray-500",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const mainNavigation = [
    { name: "Docs", href: "/docs" },
    { name: "SDKs", href: "/sdks" },
    { name: "Changelog", href: "/changelog" },
    { name: "Status", href: "/status" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-background rounded-full" />
              </div>
              <span className="font-semibold tracking-tight text-sm">World Developer Portal</span>
            </Link>
            <nav className="hidden md:flex items-center gap-5">
              {mainNavigation.map((item) => {
                const isActive = location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors hover:text-foreground ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" className="hidden md:inline-flex gap-2 h-8 text-xs border-border/50">
              <SiGithub className="w-3.5 h-3.5" />
              GitHub
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:sticky top-16 z-40 h-[calc(100dvh-4rem)] w-64 flex-shrink-0 overflow-y-auto border-r border-border/40 bg-sidebar transition-transform duration-200 ease-in-out`}
        >
          <div className="p-4">
            <div className="mb-6">
              <Link href="/docs" className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
            </div>
            <nav className="space-y-6">
              {docNav.map((section) => (
                <div key={section.slug}>
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/docs/${section.slug}`}
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {section.title}
                    </Link>
                    {section.status !== "stable" && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColors[section.status]}`}>
                        {section.status}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const href = `/docs/${item.slug}`;
                      const isActive = location === href;
                      return (
                        <li key={item.title}>
                          <Link
                            href={href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-1.5 py-1.5 px-2 rounded-md text-sm transition-colors ${
                              isActive
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                          >
                            {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

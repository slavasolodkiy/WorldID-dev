import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SiGithub } from "react-icons/si";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun, Search, Menu, X } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Docs", href: "/docs" },
    { name: "SDKs", href: "/sdks" },
    { name: "Changelog", href: "/changelog" },
    { name: "Status", href: "/status" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <div className="w-3 h-3 bg-background rounded-full" />
              </div>
              <span className="font-semibold tracking-tight">World Developer Portal</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => {
                const isActive = location.startsWith(item.href) && (item.href !== '/' || location === '/');
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`text-sm transition-colors hover:text-foreground ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex text-muted-foreground">
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-muted-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" className="hidden md:inline-flex gap-2 h-9 border-border/50">
              <SiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background md:hidden border-b border-border/40 p-4">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="text-lg font-medium p-2 hover:bg-muted rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
            <span className="font-semibold text-sm">Tools for Humanity</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <a href="https://twitter.com/worldcoin" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

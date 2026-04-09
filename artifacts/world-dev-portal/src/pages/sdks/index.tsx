import React from "react";
import { Link } from "wouter";
import { Copy, ExternalLink, Star, Download, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSdks } from "@workspace/api-client-react";
import { getGetSdksQueryKey } from "@workspace/api-client-react";

const statusColors: Record<string, string> = {
  stable: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  beta: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  alpha: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  planned: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

function InstallBlock({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-3 bg-[hsl(240,10%,6%)] border border-border/40 rounded-lg px-4 py-3 mt-4">
      <span className="text-muted-foreground font-mono text-xs select-none">$</span>
      <code className="flex-1 text-sm font-mono text-[#e6edf3] overflow-x-auto">{command}</code>
      <button
        onClick={copy}
        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>
      {copied && <span className="text-xs text-green-500 font-mono">Copied</span>}
    </div>
  );
}

export default function SDKsPage() {
  const { data: sdks, isLoading } = useGetSdks({
    query: { queryKey: getGetSdksQueryKey() },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <Badge variant="outline" className="text-xs mb-4">SDKs & Libraries</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Official SDKs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            First-party libraries for integrating World ID across every platform. 
            All open source, actively maintained by Tools for Humanity.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-border/40 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-12 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {sdks?.map((sdk) => (
              <div
                key={sdk.id}
                className="border border-border/40 rounded-xl overflow-hidden hover:border-border transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold">{sdk.name}</h2>
                        <Badge variant="outline" className={`text-xs ${statusColors[sdk.status]}`}>
                          {sdk.status}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">v{sdk.version}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{sdk.language}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {sdk.weeklyDownloads > 0 && (
                        <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                          <Download className="w-3.5 h-3.5" />
                          {(sdk.weeklyDownloads / 1000).toFixed(1)}K/wk
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sdk.description}</p>

                  {sdk.installCommand && <InstallBlock command={sdk.installCommand} />}
                </div>

                {sdk.quickstartCode && (
                  <div className="border-t border-border/30 bg-[hsl(240,10%,4%)]">
                    <div className="px-4 py-2 border-b border-border/20 flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">Quick start</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-[#e6edf3]">
                      <code>{sdk.quickstartCode}</code>
                    </pre>
                  </div>
                )}

                <div className="px-6 py-4 border-t border-border/30 flex items-center gap-4">
                  {sdk.githubUrl && (
                    <a
                      href={sdk.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  )}
                  {sdk.npmUrl && (
                    <a
                      href={sdk.npmUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      npm
                    </a>
                  )}
                  <Link
                    href={sdk.docsUrl ?? `/docs/sdks`}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors ml-auto"
                  >
                    Documentation
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tools for Humanity section */}
        <div className="mt-16 border border-border/40 rounded-xl p-8 bg-card/30">
          <h2 className="text-xl font-bold mb-2">Tools for Humanity</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Additional developer tools, developer grant programs, and the Orb operator program. 
            These resources are maintained across the Tools for Humanity organization.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2 border-border/60">
              <a href="https://github.com/toolsforhumanity" target="_blank" rel="noreferrer">
                <Github className="w-4 h-4" />
                toolsforhumanity on GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2 border-border/60">
              <Link href="/contact">
                Partner Inquiry
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

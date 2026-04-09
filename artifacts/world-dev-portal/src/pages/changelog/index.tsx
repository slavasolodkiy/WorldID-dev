import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Calendar } from "lucide-react";
import { useGetChangelog } from "@workspace/api-client-react";
import { getGetChangelogQueryKey } from "@workspace/api-client-react";

const categoryColors: Record<string, string> = {
  sdk: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  api: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  protocol: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  portal: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
};

const typeColors: Record<string, string> = {
  feature: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  fix: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  breaking: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
  deprecation: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  improvement: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/20",
};

type Category = "sdk" | "api" | "protocol" | "portal" | "all";

export default function Changelog() {
  const [activeCategory, setActiveCategory] = React.useState<Category>("all");

  const { data: entries, isLoading } = useGetChangelog(
    { category: activeCategory },
    { query: { queryKey: getGetChangelogQueryKey({ category: activeCategory }) } }
  );

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "sdk", label: "SDK" },
    { key: "api", label: "API" },
    { key: "protocol", label: "Protocol" },
    { key: "portal", label: "Portal" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <Badge variant="outline" className="text-xs mb-4">Releases</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Changelog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Release notes for SDKs, APIs, the World ID protocol, and the developer portal. 
            Subscribe to the GitHub releases for automated notifications.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-0 top-0 bottom-0 w-px bg-border/40" />

          <div className="space-y-8">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="pl-12 md:pl-8">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <div className="border border-border/40 rounded-xl p-6">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))
              : entries?.map((entry) => {
                  const links = typeof entry.links === "string" 
                    ? JSON.parse(entry.links) 
                    : Array.isArray(entry.links) ? entry.links : [];

                  return (
                    <div key={entry.id} className="relative pl-12 md:pl-8">
                      {/* Dot */}
                      <div className="absolute left-2 md:left-[-4px] top-6 w-2.5 h-2.5 rounded-full bg-border border-2 border-background" />

                      {/* Date */}
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="border border-border/40 rounded-xl p-6 hover:border-border transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-semibold">{entry.title}</h3>
                              <Badge variant="outline" className={`text-xs ${typeColors[entry.type]}`}>
                                {entry.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${categoryColors[entry.category]}`}>
                                {entry.category}
                              </Badge>
                              <span className="text-xs font-mono text-muted-foreground">{entry.version}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {entry.description}
                        </p>

                        {links.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {links.map((link: { label: string; url: string }, j: number) => (
                              <a
                                key={j}
                                href={link.url}
                                target={link.url.startsWith("http") ? "_blank" : undefined}
                                rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                              >
                                {link.label}
                                {link.url.startsWith("http") && <ExternalLink className="w-3 h-3" />}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

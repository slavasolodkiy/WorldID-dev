import React from "react";
import { Link } from "wouter";
import { Search, ArrowRight, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocSections, useSearchDocs } from "@workspace/api-client-react";
import { getGetDocSectionsQueryKey, getSearchDocsQueryKey } from "@workspace/api-client-react";

const statusColors: Record<string, string> = {
  stable: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  beta: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  draft: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  planned: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export default function DocsIndex() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: sections, isLoading: sectionsLoading } = useGetDocSections({
    query: { queryKey: getGetDocSectionsQueryKey() },
  });

  const { data: searchResults } = useSearchDocs(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length > 1, queryKey: getSearchDocsQueryKey({ q: debouncedQuery }) } }
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
        <p className="text-muted-foreground">
          Everything you need to build with World ID, wallets, and the World App ecosystem.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-10">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-card/50 border-border/50"
        />
        {searchResults && debouncedQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border/50 rounded-lg shadow-xl overflow-hidden z-20">
            {searchResults.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">No results for "{debouncedQuery}"</div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/docs/${result.sectionSlug}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0"
                    onClick={() => { setSearchQuery(""); setDebouncedQuery(""); }}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{result.description}</div>
                      <div className="text-xs text-primary/80 mt-0.5">{result.sectionTitle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-4">
        {sectionsLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-border/40 rounded-xl p-6">
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          : sections?.map((section) => (
              <Link
                key={section.id}
                href={`/docs/${section.slug}`}
                className="group border border-border/40 rounded-xl p-6 hover:border-border hover:bg-card/50 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{section.title}</h3>
                  <Badge variant="outline" className={`text-xs ml-2 flex-shrink-0 ${statusColors[section.status]}`}>
                    {section.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {section.articleCount} articles
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

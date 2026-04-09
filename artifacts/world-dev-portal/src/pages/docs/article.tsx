import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, ExternalLink, AlertTriangle, Info, BookMarked } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocSection } from "@workspace/api-client-react";
import { getGetDocSectionQueryKey } from "@workspace/api-client-react";

const statusColors: Record<string, { badge: string; banner?: string; icon?: React.ElementType }> = {
  stable: { badge: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20" },
  beta: {
    badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    banner: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
    icon: Info,
  },
  draft: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    banner: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
    icon: AlertTriangle,
  },
  planned: {
    badge: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    banner: "bg-gray-500/10 border-gray-500/20 text-gray-500",
    icon: Info,
  },
};

const statusMessages: Record<string, string> = {
  beta: "This feature is in beta. The API may change before general availability.",
  draft: "This documentation is a draft and may be incomplete or subject to change.",
  planned: "This feature is planned but not yet available.",
};

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trimStart();

    if (trimmed.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-2xl font-bold tracking-tight mt-0 mb-4">{trimmed.slice(2)}</h1>);
    } else if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-lg font-semibold tracking-tight mt-8 mb-3 border-b border-border/40 pb-2">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-base font-semibold mt-6 mb-2">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-4 rounded-lg overflow-hidden border border-border/40 bg-[hsl(240,10%,6%)]">
          {lang && (
            <div className="px-4 py-2 border-b border-border/30 bg-[hsl(240,10%,5%)]">
              <span className="text-xs font-mono text-muted-foreground">{lang}</span>
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-[#e6edf3] whitespace-pre">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-primary pl-4 my-4 text-sm text-muted-foreground italic">
          {trimmed.slice(2)}
        </blockquote>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trimStart().startsWith("- ") || lines[i].trimStart().startsWith("* "))) {
        items.push(lines[i].trimStart().slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-3 text-sm text-muted-foreground">
          {items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      );
      continue;
    } else if (/^\s*\d+\./.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\./.test(lines[i])) {
        items.push(lines[i].trimStart().replace(/^\d+\.\s*/, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-3 text-sm text-muted-foreground">
          {items.map((item, j) => <li key={j}>{item}</li>)}
        </ol>
      );
      continue;
    } else if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length >= 2) {
        const headers = tableLines[0].split("|").filter(Boolean).map((h) => h.trim());
        const rows = tableLines.slice(2).map((row) => row.split("|").filter(Boolean).map((c) => c.trim()));
        elements.push(
          <div key={i} className="my-4 overflow-x-auto rounded-lg border border-border/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border/40">
                  {headers.map((h, j) => (
                    <th key={j} className="text-left px-4 py-2.5 font-medium text-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j} className="border-b border-border/30 last:border-0">
                    {row.map((cell, k) => (
                      <td key={k} className="px-4 py-2 text-muted-foreground font-mono text-xs">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    } else if (trimmed && !trimmed.startsWith("---")) {
      const withCode = trimmed.replace(/`([^`]+)`/g, '<code class="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">$1</code>');
      elements.push(
        <p
          key={i}
          className="text-sm leading-relaxed text-muted-foreground my-2"
          dangerouslySetInnerHTML={{ __html: withCode }}
        />
      );
    }
    i++;
  }
  return elements;
}

export default function DocArticle({ params }: { params: { slug: string } }) {
  const { data: section, isLoading } = useGetDocSection(params.slug, {
    query: { queryKey: getGetDocSectionQueryKey(params.slug) },
  });

  const article = section?.articles?.[0];

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/docs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to docs
        </Link>
        <h1 className="text-2xl font-bold">Section not found</h1>
        <p className="text-muted-foreground mt-2">The documentation section you are looking for does not exist.</p>
      </div>
    );
  }

  const statusInfo = statusColors[article?.status ?? section.status] ?? statusColors.stable;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/docs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Documentation
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
          <Badge variant="outline" className={`text-xs ${statusInfo.badge}`}>
            {section.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-base leading-relaxed">{section.description}</p>

        {article && (
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.estimatedReadTime} min read
            </span>
            <span>Updated {new Date(article.lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>
        )}
      </div>

      {statusInfo.banner && statusMessages[section.status] && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${statusInfo.banner} mb-8 text-sm`}>
          {StatusIcon && <StatusIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />}
          <span>{statusMessages[section.status]}</span>
        </div>
      )}

      {article ? (
        <div className="prose-sm max-w-none">
          {renderContent(article.content)}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">No articles available for this section yet.</div>
      )}

      {section.articles && section.articles.length > 1 && (
        <div className="mt-12 border-t border-border/40 pt-8">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Also in this section</h3>
          <div className="space-y-2">
            {section.articles.slice(1).map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/30"
              >
                <span className="text-sm text-muted-foreground">{a.title}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {a.estimatedReadTime} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-border/40">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/30 mb-6 text-xs">
          <BookMarked className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-muted-foreground leading-relaxed">
            This portal documents integration patterns and onboarding flows. For canonical source of truth on auth, verification lifecycle, and wallet invariants, see{" "}
            <Link href="/sources" className="underline underline-offset-2 hover:text-foreground">
              Sources of Truth
            </Link>
            {" "}or the{" "}
            <a href="https://docs.world.org" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
              official World docs
            </a>.
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://github.com/worldcoin"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View canonical sources on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

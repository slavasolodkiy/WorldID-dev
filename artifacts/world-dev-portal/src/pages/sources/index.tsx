import { ExternalLink, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface SourceEntry {
  repo: string;
  org: string;
  href: string;
  role: string;
  owns: string[];
  status: "canonical" | "converging" | "separate" | "portal";
  note?: string;
}

const sources: SourceEntry[] = [
  {
    repo: "world-ios",
    org: "worldcoin",
    href: "https://github.com/worldcoin/world-ios",
    role: "Temporary canonical source of truth for core app invariants",
    owns: [
      "Auth and session model",
      "Verification lifecycle (Orb, Device, Passport)",
      "Wallet RPC contract surface",
      "Transaction integrity guarantees",
      "Nullifier derivation from biometric commitment",
      "Biometric signing gate",
    ],
    status: "canonical",
    note: "If any documentation here conflicts with the iOS implementation, the iOS implementation wins. This repo does not override iOS-defined invariants.",
  },
  {
    repo: "world-android",
    org: "worldcoin",
    href: "https://github.com/worldcoin/world-android",
    role: "Android implementation — converging toward Apple reference",
    owns: [
      "Android native SDK",
      "Android-specific auth flows",
    ],
    status: "converging",
    note: "Android SDK is Beta. It is converging upward toward the Apple implementation. Where Android and iOS differ, iOS is correct. Do not depend on Android-specific behavior for production flows.",
  },
  {
    repo: "idkit",
    org: "worldcoin",
    href: "https://github.com/worldcoin/idkit",
    role: "Canonical IDKit JS widget for web applications",
    owns: [
      "IDKit React widget source",
      "Web verification UX (QR code, deep link)",
      "Proof delivery to developer-defined handler",
      "@worldcoin/idkit npm package",
    ],
    status: "canonical",
  },
  {
    repo: "minikit-js",
    org: "toolsforhumanity",
    href: "https://github.com/toolsforhumanity/minikit-js",
    role: "MiniKit JS SDK for Mini Apps inside World App",
    owns: [
      "MiniKit command surface (verify, pay, sendTransaction, signMessage, walletAuth)",
      "@worldcoin/minikit-js npm package",
    ],
    status: "converging",
    note: "Beta. Command surface is still stabilizing. API changes are possible.",
  },
  {
    repo: "developer-portal",
    org: "worldcoin",
    href: "https://github.com/worldcoin/developer-portal",
    role: "Backend API for developer app management",
    owns: [
      "App registration and configuration API",
      "Action management",
      "Webhook delivery system",
      "Proof verification endpoint (POST /api/v1/verify/{app_id})",
      "Developer portal dashboard UI",
    ],
    status: "canonical",
    note: "This is the canonical API surface for server-side proof verification. POST https://developer.worldcoin.org/api/v1/verify/{app_id}.",
  },
  {
    repo: "WorldID-dev (this repo)",
    org: "worldcoin",
    href: "#",
    role: "Developer portal: documentation, onboarding, SDK discovery",
    owns: [
      "Documentation content and structure",
      "SDK registry and discovery",
      "Changelog feed",
      "Support and contact routing",
      "This portal's backend API (not the canonical World ID product API)",
    ],
    status: "portal",
    note: "Does not own core product invariants. Subordinate to world-ios, idkit, minikit-js, and developer-portal.",
  },
  {
    repo: "worldcoin.org",
    org: "worldcoin",
    href: "https://worldcoin.org",
    role: "Marketing and acquisition funnel",
    owns: [
      "Public ecosystem stats (verified humans, countries, Orb locations)",
      "Marketing content",
      "World App download links",
    ],
    status: "separate",
    note: "Separate surface. Stats shown on this portal are seeded representative data sourced from worldcoin.org, not live-polled telemetry.",
  },
];

const statusConfig = {
  canonical: {
    label: "Canonical source",
    icon: CheckCircle,
    badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  },
  converging: {
    label: "Beta / converging",
    icon: AlertTriangle,
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  separate: {
    label: "Separate surface",
    icon: Info,
    badgeClass: "bg-muted/80 text-muted-foreground border-border/40",
  },
  portal: {
    label: "This portal",
    icon: Info,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
};

export default function Sources() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-amber-500/5">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
            When this portal contradicts a canonical source, the canonical source is correct. File a correction via <Link href="/contact" className="underline underline-offset-2">contact</Link> or open a PR.
          </p>
        </div>
      </div>

      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/30 border border-border/40 rounded-md px-3 py-1.5 mb-6">
            SOURCE OF TRUTH REFERENCE
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Where the truth lives</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Every core invariant in the World ecosystem has a canonical home. This page tells you where to go when you need the authoritative answer — not the portal's approximation of it.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">
                worldcoin/world-ios is the temporary source of truth for core app invariants
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The iOS implementation is the reference for: auth and session model, verification lifecycle, wallet RPC contract, and transaction integrity. Until these are extracted into a platform-neutral spec, iOS is the ground truth. Android converges upward toward iOS — where they differ, iOS is correct.
              </p>
              <a
                href="https://github.com/worldcoin/world-ios"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:underline mt-3 font-medium"
              >
                worldcoin/world-ios on GitHub
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {sources.map((source) => {
            const config = statusConfig[source.status];
            const Icon = config.icon;
            const isExternal = source.href !== "#";
            return (
              <div key={source.repo} className="border border-border/40 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border/30">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{source.repo}</h3>
                      <Badge variant="outline" className={`text-xs gap-1 ${config.badgeClass}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </div>
                    {isExternal && (
                      <a
                        href={source.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      >
                        {source.org}/{source.repo}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{source.role}</p>
                  {source.note && (
                    <p className="text-xs text-muted-foreground/70 font-mono leading-relaxed mt-2 border-l-2 border-border/40 pl-3">
                      {source.note}
                    </p>
                  )}
                </div>
                <div className="p-6 bg-muted/20">
                  <div className="text-xs text-muted-foreground font-mono mb-3 uppercase tracking-wide">Owns</div>
                  <ul className="space-y-1.5">
                    {source.owns.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 border border-border/40 rounded-xl p-6">
          <h2 className="font-semibold mb-3">If something here is wrong</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            This portal is maintained manually. If a capability claim, API example, or SDK description here contradicts the canonical source, open a correction.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://github.com/worldcoin"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border/50 rounded-md px-4 py-2 hover:border-border hover:bg-muted/30 transition-colors"
            >
              Open a GitHub issue
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm border border-border/50 rounded-md px-4 py-2 hover:border-border hover:bg-muted/30 transition-colors"
            >
              Contact the team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

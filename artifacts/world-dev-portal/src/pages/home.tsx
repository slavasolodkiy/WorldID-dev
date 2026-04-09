import React from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Copy, ExternalLink, Terminal, Zap, Shield, Globe, Box, Code2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetEcosystemStats, useGetApiStatus, useGetSdks } from "@workspace/api-client-react";

const quickstartCode = `import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

function App() {
  const handleVerify = async (proof) => {
    const res = await fetch("/api/verify", {
      method: "POST",
      body: JSON.stringify(proof)
    });
    if (!res.ok) throw new Error("Verification failed");
  };

  return (
    <IDKitWidget
      app_id="app_your_app_id"
      action="vote_1"
      verification_level={VerificationLevel.Orb}
      handleVerify={handleVerify}
      onSuccess={() => console.log("Verified!")}
    >
      {({ open }) => (
        <button onClick={open}>Verify with World ID</button>
      )}
    </IDKitWidget>
  );
}`;

function AnimatedStat({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1500;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    requestAnimationFrame((t) => step(t, t));
  }, [value]);

  const formatted = display >= 1000000
    ? `${(display / 1000000).toFixed(1)}M`
    : display >= 1000
    ? `${(display / 1000).toFixed(0)}K`
    : display.toString();

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold tabular-nums tracking-tight">{formatted}+</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = code
    .replace(/(".*?")/g, '<span style="color:#a5d6ff">$1</span>')
    .replace(/\b(import|from|const|function|return|async|await|if|throw|new)\b/g, '<span style="color:#ff7b72">$1</span>')
    .replace(/\b(fetch|Error|console)\b/g, '<span style="color:#d2a8ff">$1</span>');

  return (
    <div className="relative group rounded-xl border border-border/50 overflow-hidden bg-[hsl(240,10%,6%)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-[hsl(240,10%,5%)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">app.tsx</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-[#e6edf3]">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}

const entryPoints = [
  {
    icon: Terminal,
    title: "Quick Integration",
    description: "Add World ID verification to any web app in minutes with IDKit.",
    href: "/docs/getting-started",
    label: "Get started",
    badge: "5 min",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Box,
    title: "Build a Mini App",
    description: "Embed your app inside the World App and reach 11M+ verified users.",
    href: "/docs/mini-apps",
    label: "MiniKit docs",
    badge: "Beta",
    badgeVariant: "outline" as const,
  },
  {
    icon: Shield,
    title: "Protocol Deep Dive",
    description: "Understand World ID's ZK proof system, nullifiers, and credential model.",
    href: "/docs/world-id",
    label: "Read the protocol",
    badge: "Stable",
    badgeVariant: "secondary" as const,
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Complete REST API reference with schemas, examples, and error codes.",
    href: "/docs/api",
    label: "API reference",
    badge: "Stable",
    badgeVariant: "secondary" as const,
  },
];

const features = [
  {
    icon: Shield,
    title: "Biometric Identity",
    description: "Orb-verified humans get a unique World ID. One person, one identity — enforced cryptographically.",
  },
  {
    icon: Zap,
    title: "Zero-Knowledge Proofs",
    description: "Prove uniqueness without revealing who you are. Built on Semaphore v4, the fastest ZK circuit available.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "160+ countries, 312 Orb locations, 11M+ verified humans. The largest proof-of-personhood network.",
  },
  {
    icon: Box,
    title: "Programmable Wallet",
    description: "ERC-4337 smart contract wallets with gas abstraction and biometric signing for every user.",
  },
  {
    icon: BookOpen,
    title: "Open Protocol",
    description: "All SDKs, circuits, and contracts are open source. Audit everything, contribute anything.",
  },
  {
    icon: Code2,
    title: "Developer First",
    description: "IDKit for web, MiniKit for embedded apps, native SDKs for iOS and Android.",
  },
];

export default function Home() {
  const { data: stats } = useGetEcosystemStats();
  const { data: apiStatus } = useGetApiStatus();
  const { data: sdks } = useGetSdks();

  const allOperational = apiStatus?.every((s) => s.status === "operational") ?? true;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 py-20 md:py-32">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${allOperational ? "bg-green-500" : "bg-amber-500"} animate-pulse`} />
              <span className="text-xs text-muted-foreground font-mono">
                {allOperational ? "All systems operational" : "Some degradation detected"}
              </span>
              <Link href="/status" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
                View status
              </Link>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Build on the world's largest
              <br />
              <span className="text-primary">proof-of-personhood</span> network
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              World ID lets you verify real, unique humans cryptographically — without collecting personal data. 
              Integrate in minutes. Reach 11M+ verified users through the World App ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2 h-12 px-6 font-medium">
                <Link href="/docs/getting-started">
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 h-12 px-6 border-border/60">
                <Link href="/docs">
                  Browse docs
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="gap-2 h-12 px-6 text-muted-foreground hover:text-foreground">
                <a href="https://github.com/worldcoin" target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Code + Stats */}
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-mono text-muted-foreground">5 minutes to first verified user</span>
            </div>
            <CodeBlock code={quickstartCode} />
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Proof verified server-side — no client-side trust required
            </div>
          </div>

          <div className="flex flex-col justify-center gap-8">
            <div className="grid grid-cols-2 gap-6">
              {stats ? (
                <>
                  <AnimatedStat value={stats.verifiedHumans} label="Verified humans" />
                  <AnimatedStat value={stats.countriesActive} label="Countries active" />
                  <AnimatedStat value={stats.registeredApps} label="Registered apps" />
                  <AnimatedStat value={stats.orbLocations} label="Orb locations" />
                </>
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-9 w-24 mx-auto bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-20 mx-auto bg-muted/50 animate-pulse rounded" />
                  </div>
                ))
              )}
            </div>

            <div className="border border-border/40 rounded-lg p-4 bg-card/50">
              <div className="text-xs font-mono text-muted-foreground mb-3">WEEKLY DOWNLOADS</div>
              {sdks ? (
                <div className="space-y-2">
                  {sdks.slice(0, 3).map((sdk) => (
                    <div key={sdk.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{sdk.name}</span>
                      <span className="text-sm font-mono text-muted-foreground">
                        {(sdk.weeklyDownloads / 1000).toFixed(1)}K/wk
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-5 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Entry Points */}
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <h2 className="text-2xl font-bold mb-2">Where do you want to start?</h2>
          <p className="text-muted-foreground mb-10">Choose your path into the World ecosystem.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {entryPoints.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group border border-border/40 rounded-xl p-6 hover:border-border hover:bg-card/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant={item.badgeVariant} className="text-xs">
                      {item.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    {item.label}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <h2 className="text-2xl font-bold mb-2">What you're building on</h2>
          <p className="text-muted-foreground mb-10">The primitives that make World ID different.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="border border-border/30 rounded-xl p-6">
                  <Icon className="w-5 h-5 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to verify real humans?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Create a developer app, install IDKit, and verify your first user — in under 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2 h-12 px-8">
              <Link href="/docs/getting-started">
                Start building <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 h-12 px-8 border-border/60">
              <Link href="/contact">
                Talk to the team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

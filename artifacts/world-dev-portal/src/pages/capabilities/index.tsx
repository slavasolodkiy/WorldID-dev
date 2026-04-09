import React from "react";
import { CheckCircle, Clock, AlertCircle, EyeOff, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ReadinessLevel = "implemented" | "beta" | "planned" | "not-exposed";

interface Capability {
  name: string;
  description: string;
  readiness: ReadinessLevel;
  notes?: string;
  ref?: { label: string; href: string };
}

interface CapabilityGroup {
  group: string;
  description: string;
  capabilities: Capability[];
}

const readinessConfig: Record<ReadinessLevel, {
  label: string;
  icon: React.ElementType;
  badgeClass: string;
  description: string;
}> = {
  implemented: {
    label: "Implemented",
    icon: CheckCircle,
    badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
    description: "Shipped, versioned, backward-compatible",
  },
  beta: {
    label: "Beta",
    icon: AlertCircle,
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Functional but API surface may change",
  },
  planned: {
    label: "Planned",
    icon: Clock,
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Committed on roadmap, not yet implemented",
  },
  "not-exposed": {
    label: "Not exposed",
    icon: EyeOff,
    badgeClass: "bg-muted/80 text-muted-foreground border-border/40",
    description: "Exists internally but not available to external developers",
  },
};

const capabilityGroups: CapabilityGroup[] = [
  {
    group: "World ID Verification",
    description: "Proving unique personhood using Orb biometrics, device attestation, or passport NFC.",
    capabilities: [
      {
        name: "IDKit web widget",
        description: "React widget for World ID verification in web apps. Handles QR code, deep link, and proof delivery.",
        readiness: "implemented",
        notes: "Stable. Use @worldcoin/idkit.",
        ref: { label: "GitHub", href: "https://github.com/worldcoin/idkit" },
      },
      {
        name: "Server-side proof verification",
        description: "Validate a ZK proof returned by IDKit against the World ID API.",
        readiness: "implemented",
        notes: "POST to https://developer.worldcoin.org/api/v1/verify/{app_id}. This is the canonical developer-portal API — not this portal's backend.",
        ref: { label: "Docs", href: "https://docs.world.org/world-id/reference/api" },
      },
      {
        name: "Orb verification level",
        description: "Biometric-grade uniqueness. Strongest guarantee.",
        readiness: "implemented",
        notes: "VerificationLevel.Orb in IDKit.",
      },
      {
        name: "Device verification level",
        description: "Device-attested uniqueness. No biometric required.",
        readiness: "implemented",
        notes: "VerificationLevel.Device in IDKit.",
      },
      {
        name: "Passport / Document Check",
        description: "NFC-read passport as a verification signal.",
        readiness: "beta",
        notes: "Available in World App on supported hardware. Not yet exposed as a stable external verification level.",
      },
      {
        name: "Nullifier scoping per action",
        description: "Each app_id+action pair produces a unique nullifier — reuse is detectable.",
        readiness: "implemented",
        notes: "Enforced server-side during proof verification.",
      },
      {
        name: "Multi-action nullifiers",
        description: "Different nullifiers for different actions within the same app.",
        readiness: "implemented",
        notes: "Pass distinct action strings to IDKit.",
      },
    ],
  },
  {
    group: "Mini Apps (MiniKit)",
    description: "Embedded apps inside the World App powered by MiniKit JS. Beta — command surface is still stabilizing.",
    capabilities: [
      {
        name: "MiniKit JS SDK",
        description: "JavaScript SDK for building embedded mini apps inside World App.",
        readiness: "beta",
        notes: "Install @worldcoin/minikit-js. API surface may change.",
        ref: { label: "GitHub", href: "https://github.com/toolsforhumanity/minikit-js" },
      },
      {
        name: "MiniKit.verify command",
        description: "Trigger World ID verification from within a Mini App.",
        readiness: "beta",
      },
      {
        name: "MiniKit.pay command",
        description: "Request a WLD or USDCE payment from the user.",
        readiness: "beta",
        notes: "Preferred payment method inside Mini Apps. Use this instead of direct wallet RPC.",
      },
      {
        name: "MiniKit.sendTransaction command",
        description: "Send an arbitrary transaction via the user's smart wallet.",
        readiness: "beta",
        notes: "Gas abstraction is included for supported chains.",
      },
      {
        name: "MiniKit.signMessage / signTypedData",
        description: "EIP-191 and EIP-712 message signing.",
        readiness: "beta",
      },
      {
        name: "MiniKit.walletAuth",
        description: "SIWE-style auth for Mini Apps using the user's wallet address.",
        readiness: "beta",
      },
      {
        name: "MiniKit.shareContacts",
        description: "Share World App contact graph with a Mini App.",
        readiness: "planned",
        notes: "On roadmap. Not yet available.",
      },
      {
        name: "MiniKit.haptics / native UI",
        description: "Trigger haptic feedback and native bottom sheets.",
        readiness: "beta",
      },
    ],
  },
  {
    group: "Programmable Wallet",
    description: "ERC-4337 smart contract wallets for every World App user. Auth model is owned by the Apple implementation.",
    capabilities: [
      {
        name: "Smart wallet per user",
        description: "Every World App user has an ERC-4337 account deployed on World Chain.",
        readiness: "implemented",
        notes: "Wallet address is deterministic per World ID. Read via MiniKit.walletAuth or on-chain lookup.",
      },
      {
        name: "Gas abstraction",
        description: "Sponsored transactions — users do not pay gas for most flows.",
        readiness: "implemented",
        notes: "Handled by the paymaster. Available on World Chain mainnet.",
      },
      {
        name: "WLD and USDCE transfers",
        description: "Send and receive WLD and USDCE via MiniKit Pay.",
        readiness: "implemented",
        notes: "Use MiniKit.pay. Direct wallet RPC is not standardized — do not use it.",
      },
      {
        name: "Direct wallet RPC (external)",
        description: "Call wallet JSON-RPC directly from external apps (outside World App).",
        readiness: "not-exposed",
        notes: "Not available to external developers. Not standardized across iOS and Android. Use MiniKit or a transaction relay.",
      },
      {
        name: "Biometric signing",
        description: "Transaction signing is gated on device biometrics inside World App.",
        readiness: "implemented",
        notes: "Managed by the native app layer. Auth model is owned by worldcoin/world-ios.",
      },
      {
        name: "Cross-chain bridging",
        description: "Move assets between World Chain and other EVM chains.",
        readiness: "planned",
        notes: "On roadmap. Not yet exposed to developers.",
      },
    ],
  },
  {
    group: "Developer App Management",
    description: "Create and configure developer apps, actions, and webhooks via the developer portal API.",
    capabilities: [
      {
        name: "App registration",
        description: "Register a developer app and get an app_id.",
        readiness: "implemented",
        notes: "Via developer.worldcoin.org. Not via this portal's API.",
        ref: { label: "Developer portal", href: "https://developer.worldcoin.org" },
      },
      {
        name: "Action configuration",
        description: "Create and configure verification actions with custom max-uses.",
        readiness: "implemented",
        notes: "Managed via the developer portal dashboard.",
      },
      {
        name: "Webhook delivery",
        description: "Receive webhook events when verifications occur.",
        readiness: "implemented",
        notes: "Configure in the developer portal. See developer.worldcoin.org docs.",
      },
      {
        name: "API key management",
        description: "Manage developer API keys.",
        readiness: "implemented",
        notes: "Via developer.worldcoin.org.",
      },
      {
        name: "Analytics dashboard",
        description: "View verification counts, unique users, and action performance.",
        readiness: "beta",
        notes: "Available in developer portal. Data freshness may vary.",
      },
    ],
  },
  {
    group: "Native SDKs (iOS / Android)",
    description: "Native mobile SDKs for apps that need to integrate World ID verification outside the World App.",
    capabilities: [
      {
        name: "iOS SDK (WorldID-iOS)",
        description: "Native Swift SDK for iOS apps.",
        readiness: "beta",
        notes: "Source of truth for auth and session model across all platforms. API surface may change.",
        ref: { label: "GitHub", href: "https://github.com/worldcoin/world-ios" },
      },
      {
        name: "Android SDK (WorldID-Android)",
        description: "Native Kotlin SDK for Android apps.",
        readiness: "beta",
        notes: "Converging toward the Apple implementation. Not feature-complete with iOS. Do not use for production critical flows until convergence is confirmed.",
        ref: { label: "GitHub", href: "https://github.com/worldcoin/world-android" },
      },
      {
        name: "React Native / Expo",
        description: "World ID integration for cross-platform mobile apps.",
        readiness: "planned",
        notes: "Not yet available as an official package. Use the web widget via WebView as a workaround.",
      },
    ],
  },
  {
    group: "Protocol & ZK",
    description: "The underlying cryptographic protocol powering World ID. Open source.",
    capabilities: [
      {
        name: "Semaphore v4 ZK circuits",
        description: "The ZK circuit used to prove group membership without revealing identity.",
        readiness: "implemented",
        notes: "Open source. Audited. See worldcoin/semaphore-rs.",
        ref: { label: "GitHub", href: "https://github.com/worldcoin/semaphore-rs" },
      },
      {
        name: "Merkle tree inclusion proofs",
        description: "Inclusion proof that a user's identity commitment is in the World ID set.",
        readiness: "implemented",
        notes: "Managed by the sequencer. Not directly exposed to application developers — IDKit handles this.",
      },
      {
        name: "Nullifier hash",
        description: "Deterministic per-app per-user identifier that prevents double-use without revealing identity.",
        readiness: "implemented",
        notes: "Returned in the ZK proof. Store and check it server-side to prevent replay attacks.",
      },
      {
        name: "Signal binding",
        description: "Bind the ZK proof to a specific signal (e.g., a transaction hash or user action).",
        readiness: "implemented",
        notes: "Pass as signal to IDKit. Verified server-side.",
      },
    ],
  },
];

function ReadinessBadge({ level }: { level: ReadinessLevel }) {
  const config = readinessConfig[level];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`text-xs gap-1 ${config.badgeClass}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

export default function Capabilities() {
  const [filter, setFilter] = React.useState<ReadinessLevel | "all">("all");

  const levels: Array<ReadinessLevel | "all"> = ["all", "implemented", "beta", "planned", "not-exposed"];

  const filteredGroups = capabilityGroups.map((group) => ({
    ...group,
    capabilities: group.capabilities.filter(
      (c) => filter === "all" || c.readiness === filter
    ),
  })).filter((g) => g.capabilities.length > 0);

  const total = capabilityGroups.reduce((n, g) => n + g.capabilities.length, 0);
  const counts: Record<ReadinessLevel, number> = { implemented: 0, beta: 0, planned: 0, "not-exposed": 0 };
  capabilityGroups.forEach((g) => g.capabilities.forEach((c) => counts[c.readiness]++));

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-amber-500/5">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
            This capability matrix reflects the current state of this developer portal prototype. It is maintained manually and may lag behind the canonical repositories. Always verify against the linked source before depending on any claim.
          </p>
        </div>
      </div>

      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/30 border border-border/40 rounded-md px-3 py-1.5 mb-6">
            DEVELOPER CAPABILITY MATRIX
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">What's available to build with</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
            A factual breakdown of every developer-facing capability — its readiness level, source of truth, and any relevant caveats. Updated when capabilities ship or change.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {(["implemented", "beta", "planned", "not-exposed"] as ReadinessLevel[]).map((level) => {
              const config = readinessConfig[level];
              const Icon = config.icon;
              return (
                <div key={level} className="border border-border/40 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-medium">{config.label}</span>
                  </div>
                  <div className="text-2xl font-bold tabular-nums">{counts[level]}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{config.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-sm text-muted-foreground mr-2">Filter:</span>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                filter === level
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {level === "all" ? `All (${total})` : readinessConfig[level].label}
              {level !== "all" && ` (${counts[level]})`}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {filteredGroups.map((group) => (
            <div key={group.group}>
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-1">{group.group}</h2>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              <div className="border border-border/40 rounded-xl overflow-hidden divide-y divide-border/30">
                {group.capabilities.map((cap) => (
                  <div key={cap.name} className="p-5 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-1.5">
                        <span className="font-medium text-sm">{cap.name}</span>
                        <ReadinessBadge level={cap.readiness} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                      {cap.notes && (
                        <p className="text-xs text-muted-foreground/70 mt-1.5 font-mono leading-relaxed">
                          {cap.notes}
                        </p>
                      )}
                      {cap.ref && (
                        <a
                          href={cap.ref.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                        >
                          {cap.ref.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

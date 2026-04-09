# WorldID Developer Portal

A developer-facing documentation and onboarding surface for integrating with World ID and the World App ecosystem.

## What this repo is

This repository (`WorldID-dev`) is the **developer portal** — the integration onboarding surface for external developers who want to:
- Verify humans with World ID (IDKit)
- Build Mini Apps inside the World App (MiniKit)
- Understand the protocol, ZK proofs, and credential model
- Access SDK documentation and install guides
- Submit support and partnership inquiries

This portal is the correct starting point for integration. It is not the authoritative source for core product invariants.

## What this repo is NOT

| Surface | Owner | This repo's role |
|---|---|---|
| Auth / session model | `worldcoin/world-ios` (Apple) | Link to, do not redefine |
| Verification lifecycle | `worldcoin/world-ios` (Apple) | Link to, do not redefine |
| Wallet / transaction integrity | `worldcoin/world-ios` (Apple) | Link to, do not redefine |
| Android SDK | `worldcoin/world-android` | Converging toward Apple — marked Beta |
| Marketing / funnel site | worldcoin.org | Separate surface |
| Operator / Orb product | Internal | Not in scope |

## Source of truth hierarchy

```
worldcoin/world-ios (Apple)
  └─ Temporary source of truth for:
       - Auth and session model
       - Verification lifecycle (Orb, Device, Passport)
       - Wallet RPC contract and transaction integrity
       - Nullifier derivation

worldcoin/world-android
  └─ Converging upward toward Apple implementation
     Android SDK is Beta until alignment is confirmed

worldcoin/developer-portal
  └─ Backend API surface for developer app management
     Canonical for: app registration, action configuration, webhook delivery

worldcoin/idkit
  └─ Canonical IDKit JS widget
     Stable: web verification flow

toolsforhumanity/minikit-js
  └─ Canonical MiniKit JS SDK
     Beta: command surface still stabilizing

WorldID-dev (this repo)
  └─ Developer portal: documentation, onboarding, SDK discovery
     Does NOT own core product invariants
```

## Architecture

- **Frontend**: React + Vite, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: Express 5, PostgreSQL, Drizzle ORM
- **Monorepo**: pnpm workspaces
- **API spec**: OpenAPI (describes this portal's backend only — not the canonical World ID product API)

## Capability readiness

See [/capabilities](/capabilities) in the running portal for the full capability matrix:
Implemented | Beta | Planned | Not Exposed

## Key commands

```bash
pnpm run typecheck           # Full typecheck across workspace
pnpm run build               # Build all packages
pnpm --filter @workspace/api-spec run codegen  # Regenerate API hooks
pnpm --filter @workspace/db run push           # Push DB schema
pnpm --filter @workspace/api-server run dev    # Run API server
pnpm --filter @workspace/world-dev-portal run dev  # Run frontend
```

## Known limitations

- The `/api/stats/ecosystem` endpoint returns seeded representative data, not live telemetry. Real figures are at worldcoin.org.
- The `/api/stats/api-status` endpoint returns simulated uptime data. It does not ping real production infrastructure.
- The OpenAPI spec (`lib/api-spec/openapi.yaml`) describes the portal backend, not the canonical World ID verification API (`developer.worldcoin.org/api/v1`).
- Android SDK convergence toward the Apple reference implementation is in progress. Android is Beta.
- Mini Apps API (MiniKit command surface) is Beta — some commands are still stabilizing.
- Wallet RPC is not yet standardized across iOS and Android. Use MiniKit Pay or a transaction relay until it is.

## Contributing

Open a PR. All doc content lives in the database (seeded via `lib/db/src/seed.ts`). Portal UI lives in `artifacts/world-dev-portal/src/`.

Do not add GitHub Actions workflows. Use local scripts and pnpm commands only.

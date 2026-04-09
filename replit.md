# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Houses the World Developer Portal — a developer-facing surface replicating the experience of developer.worldcoin.org, docs.world.org, and the Tools for Humanity GitHub ecosystem.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui

## Artifacts

### World Developer Portal (`artifacts/world-dev-portal`)
Main developer-facing web application. Routes: `/`
- Dark-mode-first, Vercel/Linear aesthetic
- Pages: Home, Docs (with sidebar), SDKs, Changelog, Status, Contact

### API Server (`artifacts/api-server`)
Express 5 backend. Routes: `/api`
- Endpoints: `/api/docs/*`, `/api/changelog`, `/api/sdks/*`, `/api/contact`, `/api/stats/*`, `/api/healthz`

## Portal Architecture

```
World Developer Portal
├── / — Homepage with ecosystem stats, code snippet, SDK downloads
├── /docs — Documentation hub with searchable sections and sidebar navigation
├── /docs/:slug — Documentation section pages (getting-started, world-id, wallet, mini-apps, api, sdks)
├── /sdks — SDK cards with install commands and quickstart code
├── /changelog — Release timeline with category/type filters (SDK, API, Protocol, Portal)
├── /status — Live API status with 30-day uptime visualization
└── /contact — Multi-type inquiry form (general, partner, orb-provider, integration, bug-report, enterprise)
```

## Architecture Recommendation: Where Docs/Portal Should Live

**Current Decision**: Single unified portal at the root path. This is the pragmatic recommendation for the current scale.

**Future Split Pattern** (when scale demands it):
- `developer.worldcoin.org` — Developer portal with app management, credentials, API keys
- `docs.worldcoin.org` — Separate MDX/Nextra docs site for deep technical content
- `status.worldcoin.org` — Dedicated status page (incident tracking)

**Source of Truth Notes**:
- Apple (iOS) implementation is the reference model for auth/session/verification lifecycle
- Android converges toward Apple — Android SDK marked beta until alignment is complete
- Website is a marketing/acquisition funnel, not the canonical app backend
- Mini Apps API is beta — some commands still being finalized
- Wallet RPC not yet standardized across iOS/Android — use MiniKit Pay or transaction relay

## DB Schema

- `doc_sections` — Documentation section metadata (slug, title, description, status)
- `doc_articles` — Article content with rich markdown body
- `changelog` — Release notes (version, category, type, links)
- `sdks` — SDK registry (install commands, quickstart code, version, status)
- `contact_submissions` — Contact form submissions (routed by inquiry type)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/world-dev-portal run dev` — run portal frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

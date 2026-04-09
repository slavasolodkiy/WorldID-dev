# AGENTS.md — Contributor and Agent Governance

This file defines boundaries for any automated agent or contributor working in this repository.

## Role of this repository

`WorldID-dev` is a **developer portal**: documentation, onboarding, SDK discovery, and support routing for developers integrating with World ID and the World App ecosystem.

It is **subordinate to** the core product repositories. Agents must not promote it above that role.

## What agents MAY do in this repo

- Add, edit, or restructure documentation content (`lib/db/src/seed.ts`, doc articles)
- Update portal UI pages and components (`artifacts/world-dev-portal/src/`)
- Update portal backend routes (`artifacts/api-server/src/routes/`)
- Extend the OpenAPI spec for this portal's endpoints (`lib/api-spec/openapi.yaml`)
- Add or update SDKs in the SDK registry
- Update the capability matrix (`/capabilities` page) as features ship
- Improve the contact/support flow

## What agents must NOT do

- **Do not redefine auth, session, or verification lifecycle** — these are owned by `worldcoin/world-ios` (Apple) until explicitly migrated
- **Do not claim production telemetry** — the status page uses simulated data; do not add real endpoint pinging without explicit approval
- **Do not create `.github/workflows/` files** — no GitHub Actions, no CI workflow files
- **Do not imply external APIs are production-ready** if they are not; label unconfirmed endpoints as Beta or Planned in the capability matrix
- **Do not invent ecosystem stats** — stats come from seeded representative data, not live feeds. Do not hardcode inflated numbers as if they are live
- **Do not mark Android SDK as Stable** — it is Beta until it converges with the Apple implementation
- **Do not mark Mini Apps / MiniKit commands as Stable** — this surface is Beta
- **Do not change primary key ID column types** in the database schema
- **Do not make the portal appear more authoritative than it is** — e.g., do not add pages claiming to define canonical API contracts this repo doesn't own

## Source-of-truth hierarchy (read-only reference — do not override)

| Topic | Canonical Source |
|---|---|
| Auth and session model | `worldcoin/world-ios` |
| Verification lifecycle | `worldcoin/world-ios` |
| Wallet / transaction integrity | `worldcoin/world-ios` |
| Android convergence target | `worldcoin/world-android` → mirrors Apple |
| IDKit web widget | `worldcoin/idkit` |
| MiniKit JS commands | `toolsforhumanity/minikit-js` |
| Developer app management API | `worldcoin/developer-portal` |
| This portal's backend API | `lib/api-spec/openapi.yaml` (here) |

## Labeling rules for new content

When adding or updating docs, SDKs, or API references, apply these labels accurately:

| Label | Meaning |
|---|---|
| `stable` | Shipped, versioned, backward-compatible |
| `beta` | Functional but API may change; real-world signal expected |
| `planned` | Committed on roadmap but not yet implemented |
| `not-exposed` | Exists internally but not available to external developers |

## Quick checks before any change

1. Am I redefining a core invariant owned elsewhere? → Stop. Link to the canonical source instead.
2. Am I adding a telemetry or monitoring claim? → Ensure it is clearly labeled as simulated or representative.
3. Am I adding a new SDK or API surface? → Add a row to the capability matrix with the correct readiness label.
4. Am I adding a GitHub Actions file? → Do not.

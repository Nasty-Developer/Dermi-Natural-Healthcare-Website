# Dermi Natural Healthcare

The official Dermi Natural Healthcare website, imported from https://github.com/Nasty-Developer/Dermi-Natural-Healthcare-Website.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/dermi-natural-healthcare/` — primary website and product catalog.
- `artifacts/api-server/` — shared API server.
- `lib/api-spec/openapi.yaml` — API contract source of truth.
- `artifacts/mockup-sandbox/` — reusable design canvas preview.

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

The website presents Dermi Natural Healthcare, its GLETSY and NEUTOGLOW product ranges, leadership, and contact options. It includes a GlowAI chat widget and WhatsApp contact button.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- GlowAI uses local keyword matching against the published product catalog. Do not add external AI APIs, paid AI services, or API-key requirements; when site details are unavailable, say so and direct visitors to WhatsApp.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

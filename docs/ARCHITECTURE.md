# Architecture

One page. If something here is wrong, fix it in the same PR as the code change.

## Layers

```
src/app/        routing glue only. Pages render feature UI. Route files re-export feature handlers.
src/features/   one folder per feature. Owns its UI, client, server, contract and mock.
src/core/       shared and tiny: db clients, auth, api helpers, env, ui tokens and primitives, analytics.
supabase/       migrations, one SQL file per feature change.
```

Allowed imports: `app` may import `features/*/ui` and `features/*/server`. A feature may import `core/*`, its own files, and other features' `contract.ts` only. `core` imports nothing from `features` or `app`. ESLint enforces the feature rules (`eslint.config.mjs` reads `src/features/` from disk, so new features are covered at once).

## Data flow

```
page -> feature ui -> feature client.ts -> /api/<feature> route (one-line re-export)
     -> feature server (handle() from core/api) -> server/service.ts -> Supabase (RLS)
```

- `ui/` calls only `client.ts` in its own feature.
- `client.ts` calls `callOrMock()` with the endpoint from `contract.ts` and a mock function from `mock.ts`.
- `server/index.ts` wraps each handler in `handle()`, which validates input and output with the contract's zod schemas and returns uniform JSON errors: `{ "error": { "code", "message", "details" } }`.
- `server/service.ts` is the only file that talks to Supabase for that feature. It maps rows to contract types.

## Contract first

The owner writes `contract.ts` first: zod schemas, inferred types, and each endpoint as `defineEndpoint({ path, method, request, response })`. A human reviews it. Then `mock.ts` with realistic data, then UI against the mock, then the server. Other features read your contract, so the contract is the interface between people. Changing it after others depend on it needs a message to them.

## Why route files are re-exports

`src/app/api/reports/route.ts` is `export { GET, POST } from "@/features/reports/server";`. Next.js requires route files under `app/`, and these files are where merge conflicts would otherwise happen. One line per route, owned by one person, means nobody edits the same lines. All logic stays in the feature folder.

## Mock switch

Each feature has `USE_MOCK` in `mock.ts`, driven by `NEXT_PUBLIC_MOCK_<FEATURE>` (`true` or `1`). With the flag set, the client never calls the server. Without it, `callOrMock()` calls the endpoint and falls back to the mock on network errors and 5xx responses. 4xx responses are not masked, because they mean the input is wrong. The mock store lives in the browser bundle and resets on reload.

## Auth mode

`AUTH_MODE` in `src/core/auth/config.ts` is `anonymous` or `required`.

- `anonymous`: `src/proxy.ts` signs every new visitor in anonymously. They keep their data and can upgrade with an email via `/auth/upgrade`.
- `required`: visitors without a session are redirected to `/auth/login`.

Feature code calls `getCurrentUser()` from `@/core/auth/server` or `@/core/auth/client` and never reads the mode. The starter's email and password pages stay under `/auth/*` and are reachable from the account menu.

## Migrations

`supabase/migrations/<timestamp>_<feature>_<what>.sql`, for example `20261111120000_reports_init.sql`. One feature per file. A migration that creates a table also enables RLS and defines its policies. After applying, run `npm run db:types`. Never edit an applied migration, add a new one.

## Deployment

Vercel, imported once by one owner, with env vars from `.env.example`. Every PR gets a preview deployment. CI (`.github/workflows/ci.yml`) runs typecheck, lint and build on every PR, and the Playwright golden path when the repository variable `PLAYWRIGHT_BASE_URL` is set.

## Assumptions

Made during setup without asking. Change them if they are wrong.

- Photos are an optional URL field, not file uploads. Storage buckets and upload policies are a later step.
- Location is optional `lat` and `lng` from the browser plus an optional free-text address. No map and no geocoding.
- The Helsinki Open311 endpoint was not reachable during setup, so `reports/mock.ts` is hand-written in the Open311 shape and there is no import script. The `reports` table has `source` and `external_id` columns ready for one.
- `clusters` and `priorities` servers return 501 and the UI runs on mock data until their owners build them. They have no tables yet.
- Mock flags are read in each feature's `mock.ts`, not in `core/env.ts`, so adding a feature never edits a shared file.
- The Supabase MCP server is defined in `.mcp.json` and enabled in `.claude/settings.json`, because Claude Code reads project MCP servers from `.mcp.json`. It uses `${SUPABASE_PROJECT_ID}`, so each person must export it in the shell that starts Claude.
- `npm run db:types` is written as specified and needs the Supabase CLI installed and a POSIX shell (Git Bash on Windows). It is not a dependency of the repo.
- The nav links in `src/app/site-nav.tsx` are one shared array. Adding a feature means adding one line there.
- Anonymous sign-ins can be abused by bots. Turn on CAPTCHA or rate limits in Supabase if the demo URL goes public.
- The analytics host is the PostHog EU cloud (`https://eu.i.posthog.com`), set in `core/analytics`.

# Project guide

TODO: one-line product pitch

Next.js, Supabase, Tailwind, shadcn. Four people, four agents, 48 hours. This file is a router. Details live in the files it links.

## Hard rules

- A feature owns its UI and server logic in `src/features/<name>/`. Edit only your own feature.
- Cross-feature use goes only through the other feature's `contract.ts`. Never import its `ui/`, `server/`, `client.ts` or `mock.ts`. ESLint blocks it.
- `src/app/` has no logic. Pages render a feature's UI. `api/<name>/route.ts` is a one-line re-export from `features/<name>/server`.
- `src/core/` is shared. Change it only through a tiny PR that is merged immediately.
- Contract first, mock first. Write `contract.ts` and `mock.ts` before server and UI. Every feature must degrade to its mock when the backend is down.
- UI never talks to the database. Only `features/<name>/server/service.ts` does. The service-role key is server only.

## Top coding rules (full list: read docs/PRINCIPLES.md before writing or restructuring code)

- Names over comments. Comments explain why only.
- Files under about 300 lines, functions under about 100. Split while writing.
- No hard-coded colors or spacing. Use tokens from `core/ui` and the Tailwind theme.
- Small runnable increments. A human smoke-tests at merge points.
- No drive-by refactors.
- New dependency: announce it in the PR title. Only one person runs installs.
- Clarify before building, at most 3 questions. Then write assumptions into the feature's CLAUDE.md and go.
- Demo first. The golden path (see tests/e2e/golden-path.spec.ts) must always work on the deployed URL.

## Where to read

| Task | Read first |
| --- | --- |
| Working on feature X | `src/features/X/CLAUDE.md` (`src/features/example` is the reference) |
| Touching shared stuff | `src/core/CLAUDE.md` |
| Architecture questions | `docs/ARCHITECTURE.md` |
| Coding rules | `docs/PRINCIPLES.md` |
| Timeline and merge rhythm | `docs/HACKATHON.md` |
| Unfamiliar Next.js 16 API | `node_modules/next/dist/docs/` (see AGENTS.md) |

## Commands

- `npm run typecheck`, `npm run lint`, `npm run build`: all three must pass before a PR.
- `npm run db:types`: regenerate `src/core/db/types.ts` (needs the Supabase CLI and `SUPABASE_PROJECT_ID`).
- `npm run test:e2e`: Playwright golden path. Set `PLAYWRIGHT_BASE_URL` to test a deployed URL.

## Supabase rules

- The Supabase MCP points at the DEV project only. Never connect it to production.
- Review every SQL statement before applying it.
- Use migrations (`supabase/migrations/<timestamp>_<feature>_<what>.sql`), not ad-hoc DDL.
- Every table gets RLS and its policies in the same migration file.
- Run `npm run db:types` after each schema change.
- Never expose the service-role key. No `NEXT_PUBLIC_` prefix, no client imports.

## Skills

- `/new-feature <name>`: scaffold a feature from `_template`, contract and mock first.
- `/ship`: check, update docs, rebase, commit, push, open a small PR.
- `/sync`: rebase on main, regenerate DB types if migrations changed.

# template

Update this file in the same PR as any behavior change in this feature. Keep it between 30 and 80 lines.

## Purpose

TODO: one line describing what this feature does for the user.

## Owner

TODO: name. Only the owner edits this folder. Others send a tiny PR to the owner.

## Contract summary

- `templateItemSchema`: TODO fields.
- Endpoints are declared in `contract.ts` with `defineEndpoint`. Other features may import only that file.

## Files

| File | What it does |
| --- | --- |
| `contract.ts` | zod schemas, inferred types, endpoint shapes. Written first, reviewed by a human |
| `mock.ts` | Realistic fake data and `USE_MOCK` (from `NEXT_PUBLIC_MOCK_TEMPLATE`) |
| `client.ts` | Calls the endpoint through `callOrMock`. The only data access the UI uses |
| `ui/` | Components. `ui/index.ts` is the public entry the pages import |
| `server/index.ts` | Route handlers wrapped in `handle()`. Re-exported by `src/app/api/template/route.ts` |
| `server/service.ts` | Add when the server needs data. The only place that talks to Supabase |

## Endpoints

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/template` | none | `{ items: TemplateItem[] }` |

## Data

- Tables: none yet. Migration: `supabase/migrations/<timestamp>_template_init.sql`.
- RLS: define policies in the same migration that creates a table.

## Dependencies on other features

None. Cross-feature use goes only through `@/features/<other>/contract`.

## Mock status

Server returns 501. The client falls back to `mock.ts`. Set `NEXT_PUBLIC_MOCK_TEMPLATE=true` to skip the server completely.

## Known gaps

- TODO

## Assumptions

- TODO: write the answers to your clarifying questions here (at most 3 questions, then go).

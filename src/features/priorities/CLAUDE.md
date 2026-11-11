# priorities

Update this file in the same PR as any behavior change in this feature.

## Purpose

A ranked list of what to fix first, with evidence from clusters. Stub: contract, mock and a simple UI exist, the server does not.

## Owner

TODO: name. Only the owner edits this folder.

## Contract summary

- `priorityItemSchema`: `id`, `rank`, `title`, `reason`, `score` (0 to 100), `evidence`.
- `evidence` items are `clusterSchema` picked to `id`, `title`, `reportCount`, imported from `@/features/clusters/contract`.

## Files

| File | What it does |
| --- | --- |
| `contract.ts` | Priority schema and the list endpoint |
| `mock.ts` | Three ranked priorities and `USE_MOCK` (`NEXT_PUBLIC_MOCK_PRIORITIES`) |
| `client.ts` | `listPriorities` through `callOrMock` |
| `ui/priorities-panel.tsx` | Page content, a card per priority with its evidence |
| `server/index.ts` | `GET` handler, currently throws 501 |

## Endpoints

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/priorities` | none | `{ priorities: PriorityItem[] }` |

## Data

- No tables yet. `supabase/migrations/20261111120200_priorities_init.sql` is a placeholder.
- When added: enable RLS in the same migration.

## Dependencies on other features

- `clusters`, through `@/features/clusters/contract` only. The mock repeats cluster titles by hand and must not import `clusters/mock.ts`.

## Mock status

Server is a stub (501). The client falls back to `mock.ts`, so `/priorities` renders.

## Known gaps

- No scoring logic. `score` and `rank` are hard-coded in the mock.
- Evidence ids in the mock match the clusters mock by convention only.

## Assumptions

- Ranking is computed on the server from clusters. The inputs and the formula are not decided.

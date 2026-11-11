# clusters

Update this file in the same PR as any behavior change in this feature.

## Purpose

AI groups duplicate reports into clusters so one problem shows up once. Stub: contract, mock and a simple UI exist, the server does not.

## Owner

TODO: name. Only the owner edits this folder.

## Contract summary

- `clusterSchema`: `id`, `title`, `summary`, `reportIds`, `reportCount`, `createdAt`.
- `priorities` imports `clusterSchema` from this contract. Do not rename or remove fields without telling its owner.

## Files

| File | What it does |
| --- | --- |
| `contract.ts` | Cluster schema and the list endpoint |
| `mock.ts` | Three example clusters and `USE_MOCK` (`NEXT_PUBLIC_MOCK_CLUSTERS`) |
| `client.ts` | `listClusters` through `callOrMock` |
| `ui/clusters-panel.tsx` | Page content, a card per cluster |
| `server/index.ts` | `GET` handler, currently throws 501 |

## Endpoints

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/clusters` | none | `{ clusters: Cluster[] }` |

## Data

- No tables yet. `supabase/migrations/20261111120100_clusters_init.sql` is a placeholder.
- When added: enable RLS in the same migration. Reading reports needs a `reports` contract import, not a table join from here unless the owner agrees.

## Dependencies on other features

None yet. To read reports, import types from `@/features/reports/contract`.

## Mock status

Server is a stub (501). The client falls back to `mock.ts`, so `/clusters` renders.

## Known gaps

- No clustering logic, no LLM call, no persistence.
- `reportIds` in the mock point at mock report ids only.

## Assumptions

- Clustering runs on the server on demand or on a schedule. Not decided.

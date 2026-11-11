# example

The reference for how a feature looks. Copy the shape, not the content. Delete this feature when your real ones exist. Update this file in the same PR as any behavior change.

## Purpose

Submit a title, see the list of items. Exists only to show the contract, mock, client, ui and server layout working end to end.

## Owner

TODO: name. Only the owner edits this folder.

## Contract summary

- `itemSchema`: `id`, `title`, `createdAt`.
- `createItemInputSchema`: `title`, 1 to 200 characters.
- Other features import only `@/features/example/contract`.

## Files

| File | What it does |
| --- | --- |
| `contract.ts` | Schemas, types and the two endpoints |
| `mock.ts` | Two fake items, in-memory create, `USE_MOCK` from `NEXT_PUBLIC_MOCK_EXAMPLE` |
| `client.ts` | `listItems`, `createItem` through `callOrMock` |
| `ui/example-panel.tsx` | Form and list. `ui/index.ts` is the entry the page imports |
| `server/index.ts` | `GET` and `POST` handlers wrapped in `handle()` |
| `server/service.ts` | The only file that talks to Supabase. Maps rows to contract types |

## Endpoints

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/example` | none | `{ items: Item[] }` |
| POST | `/api/example` | `{ title }` | `Item` |

`src/app/api/example/route.ts` re-exports both. The page is `src/app/example/page.tsx`.

## Data

- Table `public.example_items`, migration `20261111120000_example_init.sql`.
- RLS on. Everyone can read. Authenticated users, including anonymous sign-ins, can insert rows where `user_id = auth.uid()`. No update or delete policies.

## Dependencies on other features

None.

## Mock status

Real implementation. `NEXT_PUBLIC_MOCK_EXAMPLE=true` forces the mock. If Supabase is missing or down, the client falls back to the mock. A 401 (no session) is shown to the user, not masked.

## Known gaps

- No pagination (latest 50), no edit, no delete.
- Mock items added while the backend is down exist only in that browser tab.

## Assumptions

- Guests (anonymous users) may add items.

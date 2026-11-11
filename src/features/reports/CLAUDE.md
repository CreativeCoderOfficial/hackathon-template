# reports

Update this file in the same PR as any behavior change in this feature.

## Purpose

People submit a place report (text, optional photo, location) and see the list of reports. The home page counter "N reports submitted" is the demo's popularity signal.

## Owner

TODO: name. Only the owner edits this folder.

## Contract summary

- `reportSchema`: `id`, `body`, `photoUrl`, `address`, `lat`, `lng`, `source` (`user` or `open311`), `createdAt`.
- `createReportInputSchema`: `body` (3 to 1000 chars) required. `photoUrl`, `address`, `lat`, `lng` optional.
- Other features read reports through `@/features/reports/contract` only.

## Files

| File | What it does |
| --- | --- |
| `contract.ts` | Schemas, types and the three endpoints |
| `mock.ts` | Four Open311 shaped reports, in-memory create, list, count, `USE_MOCK` |
| `client.ts` | `listReports`, `createReport`, `countReports` through `callOrMock` |
| `ui/reports-home.tsx` | Home page composition. Holds the refresh key |
| `ui/report-form.tsx` | Submit form with "use my location". Validates with the contract before sending |
| `ui/report-list.tsx` | Newest first list |
| `ui/report-counter.tsx` | "N reports submitted" |
| `server/index.ts` | `GET`, `POST`, `GET_COUNT` handlers |
| `server/service.ts` | Supabase access and row mapping |

## Endpoints

| Method | Path | Request | Response |
| --- | --- | --- | --- |
| GET | `/api/reports` | `{ limit? }` (1 to 100, default 50) | `{ reports: Report[] }` |
| POST | `/api/reports` | `CreateReportInput` | `Report` |
| GET | `/api/reports/count` | none | `{ count }` |

`/api/reports/count/route.ts` re-exports `GET_COUNT` as `GET`.

## Data

- Table `public.reports`, migration `20261111120000_reports_init.sql`.
- RLS on. Everyone (anon and authenticated) can read. Authenticated users, including anonymous sign-ins, can insert rows where `user_id = auth.uid()` and `source = 'user'`. No update or delete policies.
- `external_id` is unique and reserved for imported Open311 records.

## Dependencies on other features

None.

## Mock status

Real implementation. `NEXT_PUBLIC_MOCK_REPORTS=true` forces the mock. If Supabase is missing or down, the client falls back to the mock. A 401 (no session, for example anonymous sign-ins disabled) is shown to the user, not masked.

## Known gaps

- Photo is a URL field, not an upload.
- No map, no geocoding, no pagination, no edit or delete.
- No Open311 import script. Mock data only imitates its shape.
- Mock reports added while the backend is down exist only in that browser tab.

## Assumptions

- Guests (anonymous users) may submit reports.
- The count includes seeded Open311 rows.

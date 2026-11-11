---
name: new-feature
description: Scaffold a new feature from src/features/_template, then write its contract and mock and stop for human review.
argument-hint: <feature-name>
disable-model-invocation: true
---

Create the feature named `$ARGUMENTS`. The name must be lowercase letters and hyphens, for example `routes` or `trip-plans`. If it is not, ask for a valid one.

Name forms used below: `<name>` is the folder (`trip-plans`), `<Name>` is PascalCase (`TripPlans`), `<name_camel>` is camelCase (`tripPlans`), `<NAME>` is UPPER_SNAKE (`TRIP_PLANS`).

## Steps

1. Check that `src/features/<name>` does not exist. If it does, stop and say so.
2. Copy `src/features/_template` to `src/features/<name>`. In the copied files replace `template` with `<name_camel>` in identifiers and `<name>` in paths and strings, `Template` with `<Name>`, `TEMPLATE` with `<NAME>`. Rename `ui/template-panel.tsx` to `ui/<name>-panel.tsx`.
3. Create `src/app/api/<name>/route.ts` containing one line: `export { GET } from "@/features/<name>/server";`
4. Create `src/app/<name>/page.tsx` that renders `<<Name>Panel />` imported from `@/features/<name>/ui`.
5. Create `supabase/migrations/<timestamp>_<name>_init.sql` with only a comment. Get the timestamp from `date -u +%Y%m%d%H%M%S`. Use underscores for hyphens in the file name.
6. Add one line to `NAV_LINKS` in `src/app/site-nav.tsx` and `NEXT_PUBLIC_MOCK_<NAME>=` to `.env.example`.
7. Ask at most 3 questions, in one message: the purpose of the feature, who owns it, and what role it plays in the golden path. If the user does not answer, make the simplest assumption and record it.
8. Fill in `src/features/<name>/CLAUDE.md` (purpose, owner, assumptions).
9. Write `contract.ts` first: zod schemas, inferred types, and each endpoint with `defineEndpoint`. Then write `mock.ts` with realistic data that matches it, and adjust `client.ts`.
10. Run `npm run typecheck && npm run lint`. Fix failures.
11. STOP. Show the contract and mock to the human and ask for review. Do not build `server/` or `ui/` until they approve.

## Rules

- Do not edit any other feature. Do not touch `src/core`.
- Do not add dependencies.
- Cross-feature data is imported from the other feature's `contract.ts` only.

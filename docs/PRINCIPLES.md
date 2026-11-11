# Coding principles

Read this before writing or restructuring code. The original, unedited file is in `docs/source/Core_AI_Coding_Principles.md`. This version is adapted for a 48-hour hackathon with four people and four agents working in parallel.

## 1. Process

- Clarify before building. Ask about data structure, user flow and edge cases on any new feature before writing code. Timebox this to 3 questions. Then write your assumptions into the feature's `CLAUDE.md` and start building.
- Build in small pieces. One component or function at a time. Never a whole feature or page in one shot.
- Work in small runnable increments. A human smoke-tests at merge points, not after every file. Keep the app runnable after every commit.
- End every step with how to run it: commands, env vars needed, what is mocked or skipped.
- Demo first. The golden path (see `tests/e2e/golden-path.spec.ts`) must always work on the deployed URL. If a change breaks it, fix that before anything else.
- No drive-by refactors. Touch only what your task needs. Note other problems in the PR description and leave them alone.

## 2. Code quality

- Meaningful names over comments. Comments only explain a non-obvious decision (why), never what the code does.
- Functions stay under about 100 lines. Files stay under about 300 lines.
- Split proactively, not after the fact. While writing a function, if it looks like it will pass about 100 lines, stop and break it into smaller named functions before continuing. While writing a file, if it looks like it will pass about 300 lines, stop and split it into separate files before continuing. Do not write past the limit and refactor later. Catch it during the write.
- Types live in one dedicated location, not scattered inline. In this repo that location is each feature's `contract.ts`. Only types that are truly shared across features live in `src/core`.
- Consistent formatting that matches the project's existing style. Files use kebab-case names.

Bad versus good:

```ts
// bad: cryptic names, comment restates the obvious
function calc(u, t) {
  // loop through items
  let s = 0;
  for (let i = 0; i < u.length; i++) {
    s += u[i].p * t;
  }
  return s;
}

// good: names carry the meaning, no comment needed
function calculateTotalPrice(items: CartItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}
```

## 3. Architecture

- Group code by feature, not by file type. A feature owns its UI and its server logic in one folder under `src/features/<name>/`.
- Edit only your own feature. If you need a change elsewhere, make a tiny PR to that feature's owner or to `core`.
- Cross-feature use goes only through the other feature's `contract.ts` (types, zod schemas, endpoint shapes). Never import another feature's `ui/`, `server/`, `client.ts` or `mock.ts`. ESLint enforces this.
- External services (database, third-party APIs, SDKs) live only inside a dedicated service layer. Each feature has its own: `src/features/<name>/server/service.ts`. UI components and hooks never call the database or an SDK directly. This applies always, including prototypes and hackathon projects. It localizes any bug to one function in one file instead of a scattered SDK call somewhere in the UI, which matters more under time pressure.
- Functions in the service layer expose typed, app-shaped inputs and outputs, not raw rows or raw API responses. Map once, at the boundary.
- Contract first. The feature owner writes `contract.ts` (zod schemas, inferred types, endpoint shapes) before any server or UI code. A human reviews it.
- Mock first. `mock.ts` holds realistic fake data that matches the contract, plus a `USE_MOCK` switch driven by `NEXT_PUBLIC_MOCK_<FEATURE>`. UI work never waits for the server.
- Every feature must degrade to its mock if the backend is down. Use `callOrMock` from `@/core/api/client`.
- `src/app/` holds routing glue only. Pages render a feature's UI. Route files are one-line re-exports from `features/<name>/server`.
- `src/core/` is shared and kept tiny. A change there is a small PR merged immediately.

Service layer boundary, as used in this repo:

```ts
// src/features/example/server/service.ts
// The only file in the example feature that talks to Supabase.
export async function listItems(): Promise<Item[]> {
  const db = await getDb();
  const { data, error } = await db.from("example_items").select("*");
  if (error) throw backendUnavailable(error.message);
  return data.map(mapRowToItem); // raw row -> typed domain object
}

// src/features/example/ui/example-panel.tsx
// Never imports a database client. It calls the feature client, which calls the endpoint.
import { listItems } from "../client";
```

Swapping the database later means rewriting the body of `listItems`. The signature, the `Item` type and every component that calls it stay untouched.

## 4. Design tokens and consistency

- Generate the design system once, at project start: colors, spacing scale, typography, radius, motion durations. Store it as tokens (CSS variables in `src/core/ui/tokens.css`, mapped in the Tailwind theme), not as scattered literal values.
- Design tokens live in one place: `core/ui` and the Tailwind theme. No hard-coded colors or spacing in features.
- Reference tokens and semantic classes in components. No raw values such as `text-white`, `#fff` or `bg-[#CC571F]` inline.
- No Tailwind soup. Extract long or repeated class combinations into a variant system (`cva`) or a named class in the stylesheet.
- Once a pattern exists (button, card, input, spinner), reuse it from `core/ui`. Do not regenerate a slightly different version per screen. Need a new shared primitive? Add it to `core/ui` in a tiny PR.

Bad versus good:

```tsx
// bad: inline literals, repeated long class string, no shared source of truth
<button className="px-4 py-2 bg-[#CC571F] text-white rounded-md shadow-sm hover:bg-[#b34d1a] transition-colors duration-200">
  Continue
</button>

// good: semantic token plus extracted variant
<Button variant="default">Continue</Button>
```

## 5. Communication

- No filler or marketing language ("seamless", "robust", "cutting-edge") in code, docs, commits or messages.
- Be direct about complexity and tradeoffs.
- Say "I don't know" when it is true.
- Push back on requests that are unsafe, overcomplicated or unnecessary.
- Use plain, direct sentences. Docs have no em-dashes.

## 6. Security and privacy

- Flag any risk to data, secrets, logs, tokens or credentials the moment it comes up, unprompted.
- Secrets, keys and tokens never appear in client-side code. The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is server only and is used only through `@/core/db/admin`, only inside a feature's `server/` folder.
- Never prefix a secret with `NEXT_PUBLIC_`. Never commit `.env.local`.
- Every table has RLS enabled and policies defined in the same migration file that creates it.
- Default to privacy-preserving choices: store only what is needed, keep sensitive data server-side, and keep personal data out of logs.
- Review every SQL statement before applying it. Use migrations, not ad-hoc DDL.

## 7. Budget and practicality

- Prefer simple, working solutions. No overengineering, no premature optimization. Simple and cheap choices win.
- Prefer cheap, swappable tools. Flag ongoing costs when relevant.
- Announce any new dependency in the PR title. Only one person runs installs, to avoid lockfile conflicts.

## 8. Team rules for the hackathon

- One owner per feature. One agent per worktree (`claude --worktree <name>`).
- Small PRs every 30 to 60 minutes. Rebase on main before opening a PR.
- A feature's `CLAUDE.md` is updated in the same PR as any behavior change.
- Feature freeze at about hour 40. After that, only fixes to the golden path and demo prep.

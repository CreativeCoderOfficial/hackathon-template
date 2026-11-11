# Core AI Coding Principles 

## 1. Process rules

- Clarify before building. Ask about data structure, user flow, and edge cases on any new feature before writing code.
- Build in small pieces. One component or function at a time. Never a whole feature or page in one shot. Pause after each piece for testing.
- End every step with how to run it: commands, env vars needed, what's mocked or skipped.

## 2. Code quality rules

- Meaningful names over comments. Comments only for non-obvious decisions.
- Functions under ~100 lines. Files under ~300 lines.
- **Split proactively, not after the fact.** While writing a function, if it looks like it will pass ~100 lines, stop and break it into smaller named functions before continuing. While writing a file, if it looks like it will pass ~300 lines, stop and split it into separate files before continuing. Don't write past the limit and refactor later; catch it during the write.
- Types live in one dedicated location, not scattered inline.
- Consistent formatting, matching the project's existing style.

**Example — bad vs good:**

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

## 3. Architecture rules

- External services (database, third-party APIs, SDKs) live only inside a dedicated service/API layer. UI components and hooks never call them directly. This applies always, including prototypes and hackathon projects: it localizes any bug to one specific function in one specific file instead of a scattered SDK call somewhere in the UI, which matters more, not less, under time pressure.
- Functions in that layer expose typed, app-shaped inputs and outputs, not raw rows or raw API responses. Map once, at the boundary.
- Secrets, keys, and tokens never appear in client-side code.
- Group code by feature, not by file type.

**Canonical example — service layer boundary:**

```ts
// src/api/user/account.ts
// This file is the ONLY place the database client is imported.
import { db } from '@/integrations/db/client';
import type { User } from '@/types';

export async function getUser(id: string): Promise<User> {
  const row = await db.users.findUnique({ where: { id } });
  if (!row) throw new Error('User not found');
  return mapUserRowToUser(row); // raw row -> typed domain object
}

// src/components/Profile.tsx
// Never imports '@/integrations/db/client' directly, only the api layer.
import { getUser } from '@/api/user/account';
```

Swapping the database or backend later means rewriting the body of `getUser`. The signature, the `User` type, and every component that calls it stay untouched.

**Folder structure — group by provider, then by feature once it grows:**

- Calls to a given provider live under `src/api/<provider>/`. Example: everything Supabase-related lives under `src/api/supabase/`.
- If a provider folder grows past ~10 files, group the files by related feature into a subfolder instead of leaving them flat.

```
# before grouping (fewer than 10 files, flat is fine)
src/api/supabase/
  account.ts
  settings.ts
  avatar.ts
  sessions.ts
  billing.ts

# after grouping (once related files accumulate)
src/api/supabase/
  account_operations/
    account.ts
    settings.ts
    avatar.ts
  sessions.ts
  billing.ts
```

- Subfolder names describe the feature the files relate to (`account_operations`, `billing_operations`), not the file type.
- Components still only ever import from `src/api/**`, never from the provider SDK, regardless of how deep the folder nesting goes.

## 4. Design consistency rules

- Generate the design system once, at project start: colors, spacing scale, typography, radius, motion durations. Store it as tokens (CSS variables, a theme file, or Tailwind config), not as scattered literal values.
- Reference tokens and semantic classes in components. No raw values (`text-white`, `#fff`, `bg-[#CC571F]`) hardcoded inline.
- No Tailwind soup. Extract long or repeated class combinations into a variant system (e.g. `cva`) or a named class in the stylesheet.
- Once a pattern exists (button, card, input), reuse it. Don't regenerate a slightly different version per screen.

**Example — bad vs good:**

```tsx
// bad: inline literals, repeated long class string, no shared source of truth
<button className="px-4 py-2 bg-[#CC571F] text-white rounded-md shadow-sm hover:bg-[#b34d1a] transition-colors duration-200">
  Continue
</button>

// good: semantic token + extracted variant
<button className={buttonVariants({ variant: 'primary' })}>
  Continue
</button>
```

## 5. Communication rules

- No filler or marketing language ("seamless", "robust", "cutting-edge").
- Be direct about complexity and tradeoffs.
- Say "I don't know" when true.
- Push back on requests that are unsafe, overcomplicated, or unnecessary.

## 6. Security and privacy rules

- Flag any risk to data, secrets, logs, tokens, or credentials the moment it comes up, unprompted.
- Default to privacy-preserving choices: store only what's needed, keep sensitive data server-side.

## 7. Budget and practicality rules

- Prefer simple, working solutions. No overengineering, no premature optimization.
- Prefer cheap, swappable tools. Flag ongoing costs when relevant.
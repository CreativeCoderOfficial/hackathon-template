---
name: sync
description: Bring the current branch up to date with main, regenerate DB types if migrations changed, and report conflicts in plain words.
---

Sync the current branch with main.

## Steps

1. Run `git status`. If there are uncommitted changes, ask the user whether to commit them first. Do not stash silently.
2. Run `git fetch origin`.
3. Check whether the branch was already pushed: `git branch -r --contains HEAD` or `git ls-remote --heads origin <branch>`.
   - Not pushed: `git rebase origin/main`.
   - Already pushed: `git merge origin/main`, because rebasing would need a force push.
4. If there are conflicts, stop and report them in plain words: which files, what each side changed, and what you suggest. Do not resolve conflicts inside another person's feature folder. Do not abort without telling the user.
5. If `git diff --name-only ORIG_HEAD HEAD -- supabase/migrations` lists files (or the new migrations came in with the rebase), run `npm run db:types` and check `git diff src/core/db/types.ts`. Tell the user if `SUPABASE_PROJECT_ID` or the Supabase CLI is missing. New migrations must also be applied to the dev database by whoever owns it.
6. If `package.json` or `package-lock.json` changed, tell the user to run `npm ci`. Only the install owner runs `npm install`.
7. Run `npm run typecheck && npm run lint` and report the result.

## Rules

- Never force push. Never run `git reset --hard` or `git checkout .` to get out of trouble.

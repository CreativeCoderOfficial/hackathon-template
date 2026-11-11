---
name: ship
description: Run all checks, update the feature docs, rebase on main, commit, push the branch and open a small PR. Refuses if checks fail.
disable-model-invocation: true
---

Ship the current branch as one small PR.

## Steps

1. Run `npm run typecheck && npm run lint && npm run build`. If anything fails, stop. Show the failure and fix it with the user. Never skip hooks or checks.
2. Find which features changed with `git diff --name-only origin/main...HEAD`. For each one, update `src/features/<name>/CLAUDE.md` for the behavior that changed (files, endpoints, data, mock status, known gaps). If `core` changed, update `src/core/CLAUDE.md`.
3. Make sure the diff touches only your own feature, plus tiny `core` changes if needed. If it touches another feature's folder, stop and tell the user.
4. Run `git fetch origin` and `git rebase origin/main`. If there are conflicts, stop and report them in plain words (which files, what each side changed). Do not resolve conflicts in another person's feature.
5. If the rebase changed anything, run the checks from step 1 again.
6. Commit with a clear message in the imperative, for example `Add item sorting`. Use the commit attribution from the session instructions.
7. Push with `git push -u origin HEAD`. Never use `--force`.
8. Open the PR with `gh pr create`. Title: short and clear. If `package.json` changed, put `[new dependency: <name>]` in the title. Body: exactly 3 lines, which are what changed, why, and how to check it.

## Rules

- No force push, no amending commits that are already pushed.
- If checks fail, refuse to push and say which check failed.

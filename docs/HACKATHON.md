# Hackathon plan

48 hours, four people, four agents. Humans work at the architecture and prompting level. Agents write the code.

## Timeline

| Hours | Phase | What happens |
| --- | --- | --- |
| 0 to 2 | Together | Pick the idea. Define the golden path. Split features and owners. Write each contract and mock. Scaffold with `/new-feature`. Deploy hello world to Vercel. |
| 2 to 36 | Parallel build | Each person builds their feature with their own agent. Contract, then mock UI, then server. |
| 36 to 42 | Integration | Wire real endpoints, turn mocks off one by one, fix the golden path on the deployed URL. Feature freeze at about hour 40. |
| 42 to 48 | Demo prep only | No new features. Seed data, rehearse, record a backup video, fix only what breaks the demo. |

## Roles

- One owner per feature. The owner is the only person who edits that folder.
- One person owns Vercel and the Supabase dev project. Only that person runs `npm install` and commits `package-lock.json`.
- One person owns `src/core`. Others send tiny PRs.

Fill in names:

| Feature | Owner | Agent worktree |
| --- | --- | --- |
| example (delete when real features exist) | TODO | |

## Merge rhythm

- Small PRs every 30 to 60 minutes. Use `/ship`.
- Rebase on main before opening a PR. Use `/sync`.
- One worktree per agent: `claude --worktree <feature-name>`.
- CI must be green. A human smoke-tests the preview at merge points, not after every file.
- A change to another feature's contract goes through that feature's owner first.

## Before the demo

- Golden path works on the deployed URL: the flow in `tests/e2e/golden-path.spec.ts` passes.
- `AUTH_MODE` is set the way the demo needs it.
- Anonymous sign-ins are enabled in the Supabase dashboard.
- Seed data is present so lists are not empty.

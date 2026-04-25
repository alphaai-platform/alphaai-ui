# Contributing to `@alphaai/ui`

Thanks for your interest! This guide covers branching, commit conventions, the PR workflow, and how to add a new primitive or cut a release. For deeper architectural context see [`packages/CLAUDE.md`](./packages/CLAUDE.md).

## Setup

```bash
corepack enable pnpm                              # uses the version pinned in package.json
pnpm install                                      # workspace deps
pnpm -r --filter "./packages/*" build             # compile dist/
pnpm -r --filter "./packages/*" typecheck         # tsc --noEmit
```

Required: Node ≥ 20, pnpm 10, Git.

## Branch policy

We use **GitHub Flow** — a single long-lived `main` branch, short-lived feature branches, all changes land via Pull Request.

**`main` is the only long-lived branch and is protected:**

- Direct pushes are blocked.
- All changes land via PR.
- At least **1 approving review** is required.
- Stale reviews are **automatically dismissed** when new commits are pushed.
- **Linear history** is enforced — merges are squash-or-rebase only, no merge commits.
- Force pushes and branch deletion are blocked.

### Branch naming

Use a short, kebab-cased name with a type prefix:

| Prefix | When to use | Example |
|---|---|---|
| `feat/` | New primitive, feature, or capability | `feat/accordion-primitive` |
| `fix/` | Bug fix to existing behaviour | `fix/dialog-overlay-pointer-events` |
| `docs/` | Documentation only | `docs/contributing-clarifications` |
| `chore/` | Tooling, deps, or build config | `chore/bump-tsup` |
| `refactor/` | Internal restructure, no behaviour change | `refactor/cn-helper-location` |
| `test/` | Adding or fixing tests | `test/button-a11y-coverage` |
| `release/` | Version bump + changelog | `release/0.2.0` |

Branch from `main`, keep branches small (< 400 lines of diff is ideal), and rebase rather than merge if `main` advances.

## Commit conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for the commit *subject*. The body and footer are free-form.

```
<type>(<optional scope>): <imperative summary>

<optional body — explain "why", not "what">

<optional footer — references, breaking-change notes, co-authors>
```

Types we use:

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `chore` — tooling, deps
- `refactor` — internal change, no API/behaviour change
- `test` — tests only
- `perf` — performance improvement
- `build` — build system change
- `ci` — CI config change

Examples:

```
feat(ui): add Accordion primitive

Wraps @radix-ui/react-accordion with token-driven styles and matches the
shadcn/ui API. Includes both single and multiple selection variants.
```

```
fix(tailwind-preset): declare tw-animate-css as a runtime dep

The CSS @import only resolves through pnpm hoisting in workspace
consumers; registry consumers were left unable to install. Closes #N.
```

A single PR may contain multiple commits — squash on merge keeps `main` history tidy. **The PR title becomes the squashed commit subject**, so make sure it follows the same convention.

## Pull Request workflow

1. **Branch** from `main` using a name from the table above.
2. **Make changes** in a focused, small commit set. Run `pnpm -r build` and `pnpm -r typecheck` locally before pushing.
3. **Add a Changeset** for any user-visible change (see [Releasing](#releasing) below).
4. **Push** and **open a PR** against `main`. The PR description should explain *why* the change is needed and link any related issue.
5. **Pass CI** (when CI lands — see open follow-ups). At minimum, your PR must build and typecheck.
6. **Get one approving review** from a maintainer.
7. **Squash and merge.** Maintainers handle the merge — please do not click "Merge" on your own PR unless explicitly asked.

### What makes a good PR

- One logical change per PR. Refactors, dep bumps, and features are separate PRs.
- Token-driven colors only — never hardcode utility colors like `bg-indigo-600`. See [`packages/CLAUDE.md`](./packages/CLAUDE.md#theme-tokens-canonical-names).
- Keep public API breaks behind an explicit major-version Changeset. We are pre-1.0 so minor bumps may break, but call it out in the Changeset.
- Update relevant `README.md` and the per-package `CHANGELOG.md` (the latter is auto-managed by Changesets — don't hand-edit).

## Adding a new primitive

We're tracking ~40 missing primitives (Accordion, Avatar, Badge, Checkbox, DropdownMenu, Popover, Tabs, Tooltip, Switch, etc.). The recipe is consistent:

1. Drop a file in `packages/ui/src/components/<name>.tsx`. Pattern: Radix primitive + `class-variance-authority` for variants + token-driven Tailwind classes.
2. Add to `packages/ui/tsup.config.ts` `entry` array.
3. Add to `packages/ui/package.json` `exports` map (per-component path).
4. Re-export from `packages/ui/src/index.ts` so it's available from the barrel.
5. Add the Radix runtime dep to `packages/ui/package.json` `dependencies`.
6. Run `pnpm --filter @alphaai/ui build` and confirm `dist/components/<name>.js` and `.d.ts` land.
7. Add a Changeset: `pnpm changeset` → pick `@alphaai/ui` → minor bump → describe the new primitive.
8. Open a PR following the conventions above.

Accessibility is **non-negotiable** for new primitives:

- Wrap a Radix primitive — don't roll your own focus traps or keyboard handlers.
- Always include `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Icon-only triggers must accept an `aria-label` from props.
- Form fields must support `aria-invalid` / `aria-describedby` wiring.

## Releasing

Maintainers only. We use [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset                        # describe the change, pick semver bump
pnpm changeset version                # bump package.json + CHANGELOG.md
pnpm -r --filter "./packages/*" build
pnpm -r --filter "./packages/*" publish --no-git-checks --access public --otp=XXX
```

Topological order is handled automatically by `pnpm -r publish`: `tokens` → `tailwind-preset` → `ui`.

Publish requires:
- `npm login` as an account with publish rights to the `@alphaai` org.
- A 6-digit OTP from your authenticator (or a granular access token via `NPM_CONFIG_USERCONFIG=/tmp/rc` — never write a token to `~/.npmrc`).
- A clean git status (or `--no-git-checks`).

After publishing, the package-root index endpoint on the npm CDN takes 5-30 minutes to populate. `npm view` and `npm install` may 404 during that window even though the version is live.

Push the release commit + the tags to `main` via PR (since `main` is protected):

```bash
git checkout -b release/<version>
git add . && git commit -m "release: @alphaai/* v<version>"
git push -u origin release/<version>
gh pr create --title "release: @alphaai/* v<version>" --body "..."
```

## Reporting bugs / requesting features

Open a GitHub issue with:
- Package + version (`@alphaai/ui@0.1.0`)
- Minimum reproduction (CodeSandbox or repo link is best)
- What you expected vs. what happened
- Console / build output if relevant

For a11y bugs, please flag them as such — they are highest priority and can ship as a patch even mid-release-cycle.

## Code of Conduct

Be respectful, assume good intent, keep feedback focused on the work. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) — abusive behaviour is grounds for removal from the project.

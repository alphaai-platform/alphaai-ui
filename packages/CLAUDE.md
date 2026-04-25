# CLAUDE.md — `@alphaai/*` design system

This file provides guidance to Claude Code (and any other coding agent) when working in this repository. Auto-loaded for sessions in `/packages/`.

## What lives here

Three published npm packages consumed by AlphaAI products and any external project that wants the same primitives:

| Package | Purpose |
|---|---|
| [`@alphaai/tokens`](./tokens) | HSL CSS variables + per-product theme overrides |
| [`@alphaai/tailwind-preset`](./tailwind-preset) | Single-import Tailwind v4 + tokens + `cn()` helper |
| [`@alphaai/ui`](./ui) | React primitives — Button, Input, Label, Textarea, Card, Dialog, Select, Toaster |

```
packages/
├── tokens/
│   ├── src/tokens.css          ← :root + .dark HSL vars (neutral defaults)
│   ├── src/themes/             ← per-product overrides (primary/secondary/ring)
│   └── src/index.ts            ← TS exports for non-CSS consumers
│
├── tailwind-preset/
│   ├── theme.css               ← @import "tailwindcss" + tw-animate-css + tokens.css + @theme inline
│   └── src/cn.ts               ← clsx + tailwind-merge canonical helper
│
└── ui/
    ├── src/components/         ← Radix + CVA + Tailwind, all theme-driven
    ├── src/lib/cn.ts           ← inlined cn() (no @alphaai/* runtime deps)
    └── tsup.config.ts          ← per-component entries → tree-shakeable exports
```

## How a consumer wires this up

```css
/* app's src/index.css */
@import "@alphaai/tailwind-preset/theme.css";
@import "@alphaai/tokens/themes/framecraft.css";  /* OR another theme */
```

```tsx
import { Button } from "@alphaai/ui/button";
import { Card, CardHeader, CardTitle } from "@alphaai/ui/card";
```

Per-component imports (`@alphaai/ui/button`) are tree-shakeable — importing one primitive does not pull in the others. The barrel `@alphaai/ui` is also exported.

Dark mode: any ancestor with class `.dark` flips the variables. Works out of the box with `next-themes`.

## Iterating

```bash
pnpm install                                    # install workspace deps
pnpm -r --filter "./packages/*" build           # build all 3 packages
pnpm -r --filter "./packages/*" typecheck       # tsc --noEmit
```

To add a new primitive:

1. Drop a `shadcn/ui`-style file in `packages/ui/src/components/<name>.tsx`. Keep colors token-driven (`bg-primary`, `text-foreground`, `ring-ring`) — never hardcode utility colors like `bg-indigo-600`.
2. Wrap interactive elements with the matching Radix primitive (`@radix-ui/react-<name>`). Add the dep to `packages/ui/package.json` runtime dependencies.
3. Add the file path to `packages/ui/tsup.config.ts` `entry` array.
4. Add the per-component export to `packages/ui/package.json` `exports` map.
5. Re-export from `packages/ui/src/index.ts` for the barrel.
6. Run `pnpm build` from the package directory and verify `dist/components/<name>.js` lands.

Accessibility baseline (non-negotiable for new primitives):

- Wrap a Radix primitive — don't roll your own focus traps.
- Always include `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Icon-only triggers must accept an `aria-label` from props.
- Form fields must support `aria-invalid` / `aria-describedby` wiring.
- Honor `prefers-reduced-motion` (handled at the `tokens.css` layer).

## Releasing

We use [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset           # describe the change, pick affected packages, pick semver bumps
pnpm changeset version   # apply the bump to package.json files + write CHANGELOG.md
pnpm -r --filter "./packages/*" build
pnpm -r --filter "./packages/*" publish --no-git-checks --access public --otp=XXX
```

Topological order for `pnpm -r publish`: `tokens` → `tailwind-preset` (depends on tokens) → `ui`. pnpm handles this automatically.

`pnpm` rewrites `workspace:*` specifiers to actual semver (`^0.1.0`) automatically before tarballing — do not manually edit them.

After publishing, the package-root index endpoint on the npm CDN takes 5-30 minutes to populate. `npm view` and `npm install` may 404 during that window even though the version is live. The version-specific endpoint (`https://registry.npmjs.org/@alphaai/<pkg>/<version>`) is immediate.

## Theme tokens (canonical names)

These are the HSL CSS variables every primitive consumes. Always reference them via Tailwind utilities (`bg-background`, `text-primary-foreground`) — never compute colors in component code.

```
--background / --foreground            page surfaces
--card / --card-foreground             cards, panels
--popover / --popover-foreground       dropdowns, tooltips
--primary / --primary-foreground       brand accent (per-product)
--secondary / --secondary-foreground   neutral accent
--muted / --muted-foreground           low-contrast surface + text
--accent / --accent-foreground         hover/active backgrounds
--destructive / --destructive-foreground  errors, danger
--border / --input / --ring            chrome
--radius                               geometry (default 0.75rem)
--font-sans / --font-display / --font-mono
```

## Tooling

- `pnpm@10.33.2` (pinned via `packageManager` field; corepack-managed)
- Node >= 20
- TypeScript ~5.7
- React ^19 (peer)
- Tailwind CSS ^4 (peer of preset)
- Build: `tsup` (esbuild) for `@alphaai/ui`; plain `tsc` for the other two

## Known limitations of v0.1.0

1. **`@alphaai/tailwind-preset@0.1.0` missing `tw-animate-css` runtime dep.** The `theme.css` imports `tw-animate-css` but the package doesn't list it in `dependencies`. Consumers must `npm install tw-animate-css` themselves until `0.1.1` ships.

2. **No `"use client"` directive in built output.** `tsup` + `rollup-dts` strip module-level directives during bundling. Means `@alphaai/ui@0.1.0` does **not** work with Next.js App Router server components — only Vite SPAs, CRA, and Next.js Pages Router. Fix planned for `0.2.x` via `esbuild-plugin-preserve-directives`.

3. **Only 8 primitives in `0.1.0`.** Missing: Accordion, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, Drawer, DropdownMenu, Field, Form, HoverCard, InputGroup, InputOTP, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Separator, Sheet, Skeleton, Slider, Switch, Table, Tabs, Tooltip. PRs welcome — same recipe as the existing 8.

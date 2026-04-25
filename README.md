# AlphaAI UI

Shared React design system used across AlphaAI products. Accessible, themeable, and built on Tailwind CSS v4.

[![@alphaai/ui](https://img.shields.io/npm/v/@alphaai/ui.svg?label=%40alphaai%2Fui)](https://www.npmjs.com/package/@alphaai/ui)
[![@alphaai/tailwind-preset](https://img.shields.io/npm/v/@alphaai/tailwind-preset.svg?label=%40alphaai%2Ftailwind-preset)](https://www.npmjs.com/package/@alphaai/tailwind-preset)
[![@alphaai/tokens](https://img.shields.io/npm/v/@alphaai/tokens.svg?label=%40alphaai%2Ftokens)](https://www.npmjs.com/package/@alphaai/tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Packages

| Package | Description |
|---|---|
| [`@alphaai/ui`](./packages/ui) | React primitives — Button, Input, Label, Textarea, Card, Dialog, Select, Toaster |
| [`@alphaai/tailwind-preset`](./packages/tailwind-preset) | Single-import Tailwind v4 + tokens + `cn()` helper |
| [`@alphaai/tokens`](./packages/tokens) | HSL CSS variables and per-product theme overrides |

## Install

```bash
npm i @alphaai/ui @alphaai/tailwind-preset @alphaai/tokens
# also required by the preset until 0.1.1:
npm i tw-animate-css
```

## Setup

Add two lines to your app's main CSS:

```css
/* src/index.css */
@import "@alphaai/tailwind-preset/theme.css";
@import "@alphaai/tokens/themes/framecraft.css"; /* or voicemint, rewriter, or your own */
```

This wires up Tailwind CSS v4, `tw-animate-css`, the `@theme inline` block that maps Tailwind utility colors to CSS variables, and the base HSL token values for both light and dark modes. Dark mode = any ancestor with class `.dark` (works out of the box with [`next-themes`](https://github.com/pacocoursey/next-themes)).

## Use

```tsx
import { Button } from "@alphaai/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@alphaai/ui/card";
import { Toaster, toast } from "@alphaai/ui/toaster";

export function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => toast.success("Hi")}>Click me</Button>
        <Toaster />
      </CardContent>
    </Card>
  );
}
```

Per-component imports (`@alphaai/ui/button`) are tree-shakeable — pulling in one primitive does not load the others. The barrel `@alphaai/ui` is also exported.

## Theming

All colors resolve through HSL CSS variables. Override `--primary`, `--secondary`, `--ring` (and optionally font families) to brand the system to your product:

```css
:root {
  --primary: 186 100% 37%;          /* H S L */
  --primary-foreground: 0 0% 100%;
  --ring: 186 100% 50%;
}

.dark {
  --primary: 186 100% 50%;
  --primary-foreground: 240 10% 4%;
  --ring: 186 100% 50%;
}
```

Pre-built themes in `@alphaai/tokens/themes/`:

| Theme | Vibe |
|---|---|
| `framecraft.css` | Neon Cyan + Electric Blue |
| `voicemint.css` | Amber + Emerald |
| `rewriter.css` | Indigo |

## Components in v0.1.0

- **Button** — variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`. Supports `asChild`, `loading`.
- **Input** / **Textarea** — with `invalid` prop for form error states.
- **Label** — Radix-backed.
- **Card** — `Card` + `CardHeader` / `Title` / `Description` / `Content` / `Footer`.
- **Dialog** — Radix-backed, full a11y (focus trap, ESC, click-outside, ARIA).
- **Select** — Radix-backed.
- **Toaster** + `toast` — Sonner wrapper.

## Accessibility

- All interactive primitives wrap [Radix UI](https://www.radix-ui.com/) which is WAI-ARIA APG compliant out of the box (correct roles, focus management, keyboard nav).
- Every primitive ships `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- Form fields support `aria-invalid` / `aria-describedby` wiring.
- Color tokens target WCAG AA contrast in both light and dark modes.
- Honors `prefers-reduced-motion` at the token layer.

## Compatibility

| Environment | Status |
|---|---|
| Vite + React 19 | ✅ |
| Create React App | ✅ |
| Next.js Pages Router | ✅ |
| Next.js App Router (server components) | ⚠️ v0.1.0 omits the `"use client"` directive (esbuild strips it during bundling). Track via the GitHub issues — fix coming in `0.2`. |
| Remix | ✅ |
| Tailwind CSS | ^4 (peer) |

## Contributing

```bash
pnpm install                                    # install workspace deps
pnpm -r --filter "./packages/*" build           # build all 3 packages
pnpm -r --filter "./packages/*" typecheck       # tsc --noEmit
```

To add a new primitive, drop a `shadcn/ui`-style file in `packages/ui/src/components/<name>.tsx`, register it in `packages/ui/tsup.config.ts` (entries) and `packages/ui/package.json` (exports map), and re-export it from `packages/ui/src/index.ts`. Keep colors token-driven — never hardcode utility colors like `bg-indigo-600`.

See [`packages/CLAUDE.md`](./packages/CLAUDE.md) for the full design-system playbook.

## Releasing

We use [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset           # describe the change
pnpm changeset version   # apply semver bumps
pnpm -r --filter "./packages/*" build
pnpm -r --filter "./packages/*" publish --access public
```

## License

MIT — see [LICENSE](./LICENSE).

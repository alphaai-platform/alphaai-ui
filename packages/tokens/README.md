# @alphaai/tokens

Design tokens for AlphaAI products — colors, spacing, typography, motion. Source of truth for `@alphaai/ui` and consuming apps.

## Install

```bash
npm i @alphaai/tokens
```

## Usage

In your app's `src/index.css`:

```css
@import "@alphaai/tokens/tokens.css";
@import "@alphaai/tokens/themes/framecraft.css"; /* or voicemint, rewriter */
```

This sets up all HSL CSS variables (`--background`, `--foreground`, `--primary`, etc.) for `:root` (light mode) and `.dark`. Per-product theme files only override `--primary`, `--secondary`, `--ring`.

For non-CSS consumers (SVG generation, email templates), the package also exports JS constants:

```ts
import { fontFamily, motion, radius, shadow } from "@alphaai/tokens";
```

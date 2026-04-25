# @alphaai/tailwind-preset

Tailwind v4 preset for AlphaAI products. A single CSS import wires up Tailwind, tw-animate-css, the `@theme inline` block, and base tokens from `@alphaai/tokens`.

## Install

```bash
npm i @alphaai/tailwind-preset @alphaai/tokens tailwindcss
```

## Usage

In your app's `src/index.css`:

```css
@import "@alphaai/tailwind-preset/theme.css";
@import "@alphaai/tokens/themes/framecraft.css"; /* or voicemint, rewriter */
```

Also exports the canonical `cn()` helper used by `@alphaai/ui`:

```ts
import { cn } from "@alphaai/tailwind-preset";

cn("text-sm", isActive && "text-primary"); // → "text-sm text-primary"
```

`cn()` combines `clsx` (conditional class composition) with `tailwind-merge` (deduplicating conflicting Tailwind utilities).

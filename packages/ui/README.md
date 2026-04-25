# @alphaai/ui

Shared UI primitives for Alpha AI products. Accessible by default, themed via CSS variables.

## Install

```bash
npm i @alphaai/ui @alphaai/tailwind-preset
```

## Setup

Add a single import to your `src/index.css`:

```css
@import "@alphaai/tailwind-preset/theme.css";
@import "@alphaai/tokens/themes/framecraft.css"; /* or voicemint, rewriter */
```

## Usage

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

## Components in v0.1.0

- `Button` (variants: default, destructive, outline, secondary, ghost, link; sizes: default, sm, lg, icon; supports `asChild`, `loading`)
- `Input` / `Textarea` (with `invalid` prop for form error states)
- `Label`
- `Card` (+ Header/Title/Description/Content/Footer)
- `Dialog` (Radix-backed, full a11y)
- `Select` (Radix-backed)
- `Toaster` + `toast` (Sonner wrapper)

## Theming

All colors use HSL CSS variables: `--primary`, `--background`, `--foreground`, `--ring`, etc. Override them in your app or pick a pre-built theme from `@alphaai/tokens/themes/*.css`. Dark mode = `.dark` class on any ancestor (works with `next-themes`).

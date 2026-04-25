/**
 * @alphaai/tokens — design token exports for non-CSS consumers
 *
 * The canonical values live in `tokens.css` as HSL CSS variables; these
 * exports mirror them for cases where CSS variables aren't available
 * (SVG generation, email templates, native renderers, etc.).
 */

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
} as const;

export const fontFamily = {
  sans: "'Inter', sans-serif",
  display: "'Outfit', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const motion = {
  duration: {
    instant: "0ms",
    fast: "150ms",
    base: "250ms",
    slow: "400ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.3, 0, 0, 1)",
  },
} as const;

export const shadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
} as const;

export type Radius = keyof typeof radius;
export type FontFamily = keyof typeof fontFamily;
export type MotionDuration = keyof typeof motion.duration;
export type Shadow = keyof typeof shadow;

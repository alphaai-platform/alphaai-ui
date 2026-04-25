import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Canonical class merger for AlphaAI components.
 *
 * Combines `clsx` (conditional class composition) with `tailwind-merge`
 * (deduplicating conflicting Tailwind utilities). Used by every primitive
 * in @alphaai/ui so consumers can override styling via `className` without
 * worrying about specificity wars.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/button.tsx",
    "src/components/input.tsx",
    "src/components/label.tsx",
    "src/components/textarea.tsx",
    "src/components/card.tsx",
    "src/components/dialog.tsx",
    "src/components/select.tsx",
    "src/components/toaster.tsx",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ["react", "react-dom"],
});

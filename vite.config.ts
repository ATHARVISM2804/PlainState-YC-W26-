import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Two builds from one source tree.
 *
 *   build        what gets deployed: the below-fold content is a separate
 *                chunk, so the first paint does not pay for it
 *   build:embed  everything inlined into one HTML file, for previewing the
 *                page somewhere that cannot serve additional assets. The
 *                dynamic import is flattened, so this is genuinely the same
 *                app rather than an approximation of it.
 */
export default defineConfig(({ mode }) => {
  const embed = mode === "embed";
  return {
    server: { watch: { ignored: ["**/dist/**", "**/dist-embed/**"] } },
    // The dep scanner otherwise picks up dist-embed/index.html, whose inlined
    // Motion bundle references the optional @emotion/is-prop-valid.
    optimizeDeps: { entries: ["index.html"] },
    plugins: [react(), ...(embed ? [viteSingleFile()] : [])],
    build: {
      target: "es2020",
      outDir: embed ? "dist-embed" : "dist",
      cssCodeSplit: !embed,
      assetsInlineLimit: embed ? 100_000_000 : 4096,
      rollupOptions: embed
        ? { output: { inlineDynamicImports: true } }
        : { input: { main: "index.html", method: "method.html" } },
    },
  };
});

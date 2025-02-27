// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://y4p.rileyperalta.com",
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Prevent node modules from being bundled for browser
      rollupOptions: {
        external: [
          "node:util",
          "node:stream",
          "node:path",
          "node:events",
          "node:os",
          "node:child_process",
          "node:crypto",
          "fs",
          "child_process",
        ],
      },
    },
  },
  integrations: [sitemap()],
});

import { defineConfig } from "vite";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { remixDevTools } from "remix-development-tools/vite";
import unocss from "unocss/vite";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
    }),
    remixDevTools(),
      unocss()
  ],
});

// src/index.ts
import { VitePWA } from "vite-plugin-pwa";
function createPWAPlugin(options = {}) {
  const safeOptions = options || {};
  const {
    manifest = {},
    workbox = {}
  } = safeOptions;
  return {
    name: "enhance:pwa",
    version: "0.1.0",
    apply: "build",
    vitePlugin() {
      const pwaPlugins = VitePWA({
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          ...workbox
        },
        manifest: {
          name: "Vite Enhance App",
          short_name: "ViteEnhance",
          description: "A Vite Enhanced Application",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          ...manifest
        }
      });
      return Array.isArray(pwaPlugins) ? pwaPlugins : [pwaPlugins];
    },
    configResolved(_config) {
      console.log("[vek:pwa] PWA plugin initialized");
      console.log("[vek:pwa] Service worker will be generated for production builds");
    }
  };
}
var index_default = createPWAPlugin;
export {
  createPWAPlugin,
  index_default as default
};

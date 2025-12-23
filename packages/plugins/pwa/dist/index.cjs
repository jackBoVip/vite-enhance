"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createPWAPlugin: () => createPWAPlugin,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_vite_plugin_pwa = require("vite-plugin-pwa");
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
      const pwaPlugins = (0, import_vite_plugin_pwa.VitePWA)({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPWAPlugin
});

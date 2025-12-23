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
  createAnalyzePlugin: () => createAnalyzePlugin,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_rollup_plugin_visualizer = require("rollup-plugin-visualizer");
function createAnalyzePlugin(options = {}) {
  const safeOptions = options || {};
  const {
    open = true,
    filename = "dist/stats.html"
  } = safeOptions;
  let buildStartTime;
  let pluginTimings = {};
  return {
    name: "enhance:analyze",
    version: "0.1.0",
    apply: "build",
    vitePlugin() {
      return [
        // Bundle visualizer plugin
        (0, import_rollup_plugin_visualizer.visualizer)({
          filename,
          open,
          gzipSize: true,
          brotliSize: true,
          template: "treemap"
          // 'treemap' | 'sunburst' | 'network'
        }),
        // Plugin timing analysis
        {
          name: "vite:enhance-analyze-timing",
          apply: "build",
          configResolved() {
            buildStartTime = Date.now();
            console.log("[vek:analyze] Build timing analysis started");
          },
          buildStart() {
            const startTime = Date.now();
            pluginTimings["buildStart"] = startTime - buildStartTime;
          },
          generateBundle() {
            const currentTime = Date.now();
            pluginTimings["generateBundle"] = currentTime - buildStartTime;
          },
          writeBundle() {
            const currentTime = Date.now();
            pluginTimings["writeBundle"] = currentTime - buildStartTime;
            console.log("\n[vek:analyze] Plugin Timing Analysis:");
            console.log("=====================================");
            Object.entries(pluginTimings).forEach(([phase, time]) => {
              console.log(`${phase.padEnd(20)}: ${time}ms`);
            });
            console.log(`Total build time: ${currentTime - buildStartTime}ms`);
            console.log("=====================================\n");
          }
        }
      ];
    },
    buildStart(_context) {
      console.log("[vek:analyze] Bundle analysis started");
      console.log(`[vek:analyze] Output file: ${filename}`);
      if (open) {
        console.log("[vek:analyze] Will open analysis report in browser");
      }
    },
    buildEnd(context) {
      const duration = context.endTime - context.startTime;
      console.log(`[vek:analyze] Bundle analysis completed in ${duration}ms`);
      const jsonFilename = filename.replace(".html", ".json");
      console.log(`[vek:analyze] JSON report available at: ${jsonFilename}`);
    },
    configResolved(_config) {
      console.log("[vek:analyze] Bundle analysis plugin initialized");
    }
  };
}
var index_default = createAnalyzePlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAnalyzePlugin
});

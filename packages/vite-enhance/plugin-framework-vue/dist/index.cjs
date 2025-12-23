"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createVuePlugin: () => createVuePlugin,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_plugin_vue = __toESM(require("@vitejs/plugin-vue"), 1);
var import_vite_plugin_vue_devtools = __toESM(require("vite-plugin-vue-devtools"), 1);
function createVuePlugin(options = {}) {
  const safeOptions = options || {};
  const {
    devtools = {
      enabled: true,
      componentInspector: true
    }
  } = safeOptions;
  return {
    name: "enhance:framework-vue",
    version: "0.2.0",
    enforce: "pre",
    apply: "both",
    vitePlugin() {
      const plugins = [];
      const vuePlugins = (0, import_plugin_vue.default)({
        script: {
          defineModel: true
        }
      });
      if (Array.isArray(vuePlugins)) {
        plugins.push(...vuePlugins);
      } else {
        plugins.push(vuePlugins);
      }
      if (devtools.enabled !== false) {
        const devToolsOptions = {};
        if (devtools.launchEditor) {
          devToolsOptions.launchEditor = devtools.launchEditor;
        }
        if (devtools.componentInspector !== void 0) {
          devToolsOptions.componentInspector = devtools.componentInspector;
        }
        if (devtools.appendTo) {
          devToolsOptions.appendTo = devtools.appendTo;
        }
        const devToolsPlugin = (0, import_vite_plugin_vue_devtools.default)(devToolsOptions);
        if (devToolsPlugin) {
          plugins.push(devToolsPlugin);
        }
      }
      return plugins;
    },
    configResolved() {
      console.log("[vek:vue] Vue framework plugin initialized");
      if (devtools.enabled !== false) {
        console.log("[vek:vue] Vue DevTools enabled");
        if (devtools.componentInspector) {
          console.log("[vek:vue] Component Inspector enabled");
        }
        if (devtools.launchEditor) {
          console.log(`[vek:vue] Launch Editor: ${devtools.launchEditor}`);
        }
      } else {
        console.log("[vek:vue] Vue DevTools disabled");
      }
    }
  };
}
var index_default = createVuePlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createVuePlugin
});

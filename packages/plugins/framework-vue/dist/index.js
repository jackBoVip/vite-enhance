// src/index.ts
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
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
      const vuePlugins = vue({
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
        const devToolsPlugin = VueDevTools(devToolsOptions);
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
export {
  createVuePlugin,
  index_default as default
};

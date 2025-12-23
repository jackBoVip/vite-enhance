// src/index.ts
import react from "@vitejs/plugin-react";
function createReactPlugin(_options = {}) {
  return {
    name: "enhance:framework-react",
    version: "0.1.0",
    enforce: "pre",
    apply: "both",
    vitePlugin() {
      const reactPlugins = react({
        // @vitejs/plugin-react options
        // fastRefresh is enabled by default in development
      });
      return Array.isArray(reactPlugins) ? reactPlugins : [reactPlugins];
    },
    configResolved(config) {
      if (config.framework === "react") {
        console.log("[vek:react] React framework plugin initialized");
        console.log("[vek:react] Fast Refresh enabled by default in development");
      }
    }
  };
}
var index_default = createReactPlugin;
export {
  createReactPlugin,
  index_default as default
};

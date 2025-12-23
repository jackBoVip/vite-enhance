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
  createCDNPlugin: () => createCDNPlugin,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_path = require("path");
var import_fs = require("fs");
var MODULE_CONFIGS = {
  // React 生态
  "react": {
    name: "react",
    var: "React",
    path: "umd/react.production.min.js"
  },
  "react-dom": {
    name: "react-dom",
    var: "ReactDOM",
    path: "umd/react-dom.production.min.js",
    alias: ["react-dom/client"]
  },
  "react-router-dom": {
    name: "react-router-dom",
    var: "ReactRouterDOM",
    path: "dist/umd/react-router-dom.production.min.js"
  },
  // Vue 生态  
  "vue": {
    name: "vue",
    var: "Vue",
    path: "dist/vue.global.prod.js"
  },
  "vue-router": {
    name: "vue-router",
    var: "VueRouter",
    path: "dist/vue-router.global.min.js"
  },
  "vue2": {
    name: "vue",
    var: "Vue",
    path: "dist/vue.min.js"
  },
  // UI 库
  "antd": {
    name: "antd",
    var: "antd",
    path: "dist/antd.min.js",
    css: "dist/reset.min.css"
  },
  "element-plus": {
    name: "element-plus",
    var: "ElementPlus",
    path: "dist/index.full.min.js",
    css: "dist/index.css"
  },
  "element-ui": {
    name: "element-ui",
    var: "ELEMENT",
    path: "lib/index.js",
    css: "lib/theme-chalk/index.css"
  },
  // 工具库
  "lodash": {
    name: "lodash",
    var: "_",
    path: "lodash.min.js"
  },
  "axios": {
    name: "axios",
    var: "axios",
    path: "dist/axios.min.js"
  },
  "moment": {
    name: "moment",
    var: "moment",
    path: "moment.min.js"
  },
  "dayjs": {
    name: "dayjs",
    var: "dayjs",
    path: "dayjs.min.js"
  },
  // 其他常用库
  "jquery": {
    name: "jquery",
    var: "$",
    path: "dist/jquery.min.js"
  },
  "bootstrap": {
    name: "bootstrap",
    var: "bootstrap",
    path: "dist/js/bootstrap.bundle.min.js",
    css: "dist/css/bootstrap.min.css"
  },
  "echarts": {
    name: "echarts",
    var: "echarts",
    path: "dist/echarts.min.js"
  },
  "three": {
    name: "three",
    var: "THREE",
    path: "build/three.min.js"
  }
};
function getCDNUrlTemplate(provider, customUrl) {
  if (customUrl) return customUrl;
  switch (provider) {
    case "unpkg":
      return "https://unpkg.com/{name}@{version}/{path}";
    case "jsdelivr":
      return "https://cdn.jsdelivr.net/npm/{name}@{version}/{path}";
    case "cdnjs":
      return "https://cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path}";
    default:
      return "https://cdn.jsdelivr.net/npm/{name}@{version}/{path}";
  }
}
function detectCDNProvider(url) {
  if (url.includes("unpkg.com")) return "unpkg";
  if (url.includes("jsdelivr.net")) return "jsdelivr";
  if (url.includes("cdnjs.cloudflare.com")) return "cdnjs";
  return "custom";
}
function getModuleVersion(name) {
  try {
    const packageJsonPath = (0, import_path.join)(process.cwd(), "node_modules", name, "package.json");
    if ((0, import_fs.existsSync)(packageJsonPath)) {
      const packageJson = JSON.parse((0, import_fs.readFileSync)(packageJsonPath, "utf-8"));
      return packageJson.version;
    }
  } catch (error) {
  }
  return "";
}
function renderUrl(template, data) {
  let url = template.replace(/\{name\}/g, data.name).replace(/\{version\}/g, data.version).replace(/\{path\}/g, data.path);
  if (!data.version) {
    url = url.replace("@", "@latest");
  }
  return url;
}
function createCDNPlugin(options = {}) {
  const {
    modules = [],
    enableInDevMode = false,
    generateScriptTag,
    generateCssLinkTag,
    // Auto-detection options
    autoDetect = false,
    autoDetectDeps = "dependencies",
    autoDetectExclude = [],
    autoDetectInclude = [],
    // CDN provider options
    cdnProvider = "jsdelivr",
    customProdUrl,
    prodUrl
  } = options;
  const finalProdUrl = prodUrl || customProdUrl || getCDNUrlTemplate(cdnProvider);
  const detectedProvider = detectCDNProvider(finalProdUrl);
  let finalModules = [...modules];
  let autoDetectedModules = [];
  let moduleInfos = [];
  return {
    name: "enhance:cdn",
    version: "0.3.0",
    apply: enableInDevMode ? "both" : "build",
    vitePlugin() {
      return [
        {
          name: "vite:enhance-cdn",
          enforce: "pre",
          configResolved(config) {
            if (autoDetect) {
              autoDetectedModules = autoDetectModulesFromPackageJson(
                config.root,
                autoDetectDeps,
                autoDetectExclude,
                autoDetectInclude
              );
              finalModules = [.../* @__PURE__ */ new Set([...modules, ...autoDetectedModules])];
              if (autoDetectedModules.length > 0) {
                console.log(`[vek:cdn] Auto-detected ${autoDetectedModules.length} modules: ${autoDetectedModules.join(", ")}`);
              }
            }
            moduleInfos = finalModules.map((name) => {
              const config2 = MODULE_CONFIGS[name];
              if (!config2) return null;
              const version = getModuleVersion(name);
              const paths = Array.isArray(config2.path) ? config2.path : [config2.path];
              const jsUrls = paths.map((path) => renderUrl(finalProdUrl, { name, version, path }));
              const cssFiles = config2.css ? Array.isArray(config2.css) ? config2.css : [config2.css] : [];
              const cssUrls = cssFiles.map((css) => renderUrl(finalProdUrl, { name, version, path: css }));
              return { name, config: config2, version, jsUrls, cssUrls };
            }).filter((info) => info !== null);
          },
          config(config) {
            if (moduleInfos.length === 0) return;
            config.build ??= {};
            config.build.rollupOptions ??= {};
            config.build.rollupOptions.external ??= [];
            config.build.rollupOptions.output ??= {};
            const external = Array.isArray(config.build.rollupOptions.external) ? [...config.build.rollupOptions.external] : config.build.rollupOptions.external ? [config.build.rollupOptions.external] : [];
            const output = config.build.rollupOptions.output;
            output.globals ??= {};
            moduleInfos.forEach(({ name, config: moduleConfig }) => {
              external.push(name);
              output.globals[name] = moduleConfig.var;
              if (moduleConfig.alias) {
                moduleConfig.alias.forEach((alias) => {
                  external.push(alias);
                  output.globals[alias] = moduleConfig.var;
                });
              }
            });
            config.build.rollupOptions.external = external;
          },
          transformIndexHtml(html) {
            if (!enableInDevMode && process.env.NODE_ENV !== "production") {
              return html;
            }
            if (moduleInfos.length === 0) return html;
            const tags = [];
            moduleInfos.forEach(({ name, jsUrls, cssUrls }) => {
              cssUrls.forEach((url) => {
                if (generateCssLinkTag) {
                  const customAttrs = generateCssLinkTag(name, url);
                  const attrs = Object.entries({ href: url, rel: "stylesheet", ...customAttrs }).map(([key, value]) => `${key}="${value}"`).join(" ");
                  tags.push(`<link ${attrs}>`);
                } else {
                  tags.push(`<link rel="stylesheet" href="${url}">`);
                }
              });
              jsUrls.forEach((url) => {
                if (generateScriptTag) {
                  const customAttrs = generateScriptTag(name, url);
                  const attrs = Object.entries({ src: url, ...customAttrs }).map(([key, value]) => `${key}="${value}"`).join(" ");
                  tags.push(`<script ${attrs}></script>`);
                } else {
                  tags.push(`<script src="${url}"></script>`);
                }
              });
            });
            if (tags.length > 0) {
              const headCloseIndex = html.indexOf("</head>");
              if (headCloseIndex !== -1) {
                const tagsHtml = tags.join("\n  ");
                html = html.slice(0, headCloseIndex) + `  ${tagsHtml}
` + html.slice(headCloseIndex);
              }
            }
            return html;
          },
          generateBundle() {
            if (moduleInfos.length === 0) return;
            const manifest = {
              provider: detectedProvider,
              baseUrl: finalProdUrl,
              autoDetected: autoDetect,
              autoDetectedModules,
              manualModules: modules,
              modules: moduleInfos.map(({ name, config, version, jsUrls, cssUrls }) => ({
                name,
                var: config.var,
                version,
                alias: config.alias,
                jsUrls,
                cssUrls
              })),
              scripts: moduleInfos.flatMap(({ jsUrls }) => jsUrls),
              styles: moduleInfos.flatMap(({ cssUrls }) => cssUrls),
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            };
            this.emitFile({
              type: "asset",
              fileName: "cdn-manifest.json",
              source: JSON.stringify(manifest, null, 2)
            });
            console.log("[vek:cdn] CDN resources generated:");
            manifest.scripts.forEach((script) => console.log(`  JS: ${script}`));
            manifest.styles.forEach((style) => console.log(`  CSS: ${style}`));
          }
        }
      ];
    },
    configResolved() {
      if (finalModules.length > 0 || autoDetect) {
        console.log(`[vek:cdn] Enhanced CDN plugin initialized`);
        console.log(`[vek:cdn] Provider: ${detectedProvider}`);
        console.log(`[vek:cdn] Base URL: ${finalProdUrl}`);
        if (autoDetect) {
          console.log(`[vek:cdn] Auto-detection enabled (${autoDetectDeps})`);
          if (autoDetectedModules.length > 0) {
            console.log(`[vek:cdn] Auto-detected modules: ${autoDetectedModules.join(", ")}`);
          }
        }
        if (modules.length > 0) {
          console.log(`[vek:cdn] Manual modules: ${modules.join(", ")}`);
        }
        const unsupportedModules = finalModules.filter((name) => !MODULE_CONFIGS[name]);
        if (unsupportedModules.length > 0) {
          console.warn(`[vek:cdn] Unsupported modules (no CDN config): ${unsupportedModules.join(", ")}`);
        }
      }
    }
  };
}
function autoDetectModulesFromPackageJson(root, depsType, exclude = [], include = []) {
  try {
    const packageJsonPath = (0, import_path.join)(root, "package.json");
    if (!(0, import_fs.existsSync)(packageJsonPath)) {
      console.warn("[vek:cdn] package.json not found, skipping auto-detection");
      return [];
    }
    const packageJson = JSON.parse((0, import_fs.readFileSync)(packageJsonPath, "utf-8"));
    const detectedModules = [];
    let allDeps = {};
    switch (depsType) {
      case "dependencies":
        allDeps = packageJson.dependencies || {};
        break;
      case "production":
        allDeps = {
          ...packageJson.dependencies || {},
          ...packageJson.peerDependencies || {}
        };
        break;
      case "all":
        allDeps = {
          ...packageJson.dependencies || {},
          ...packageJson.devDependencies || {},
          ...packageJson.peerDependencies || {}
        };
        break;
    }
    for (const [depName] of Object.entries(allDeps)) {
      if (exclude.includes(depName)) {
        continue;
      }
      if (MODULE_CONFIGS[depName] || include.includes(depName)) {
        detectedModules.push(depName);
      }
    }
    for (const moduleName of include) {
      if (!detectedModules.includes(moduleName)) {
        detectedModules.push(moduleName);
      }
    }
    return detectedModules;
  } catch (error) {
    console.warn("[vek:cdn] Failed to auto-detect modules from package.json:", error);
    return [];
  }
}
var index_default = createCDNPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCDNPlugin
});

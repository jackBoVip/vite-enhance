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
  createCachePlugin: () => createCachePlugin,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_node_crypto = require("crypto");
var import_node_fs = require("fs");
var import_node_path = require("path");
function createCachePlugin(options = {}) {
  const safeOptions = options ?? {};
  const {
    cacheDir = "node_modules/.vite-enhance/cache",
    include = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.vue", "**/*.css", "**/*.scss"],
    exclude = ["**/node_modules/**", "**/dist/**", "**/.git/**", "**/coverage/**"]
  } = safeOptions;
  let cacheManifest = {
    version: "2.0.0",
    files: /* @__PURE__ */ new Map(),
    metadata: {
      created: Date.now(),
      lastModified: Date.now(),
      nodeVersion: process.version
    }
  };
  let manifestPath;
  let hasChanges = false;
  const fileHashCache = /* @__PURE__ */ new Map();
  return {
    name: "enhance:cache",
    version: "0.2.0",
    apply: "build",
    vitePlugin() {
      return [
        {
          name: "vite:enhance-cache",
          apply: "build",
          configResolved(config) {
            manifestPath = (0, import_node_path.join)(config.root, cacheDir, "manifest.json");
            const cacheDirPath = (0, import_node_path.join)(config.root, cacheDir);
            if (!(0, import_node_fs.existsSync)(cacheDirPath)) {
              (0, import_node_fs.mkdirSync)(cacheDirPath, { recursive: true });
            }
            loadCacheManifest();
          },
          buildStart() {
            console.log(`[vek:cache] Cache initialized with ${cacheManifest.files.size} cached files`);
          },
          load(id) {
            if (id.startsWith("\0") || id.includes("node_modules")) {
              return null;
            }
            if (shouldCache(id, include, exclude)) {
              const cacheResult = checkFileCache(id);
              if (cacheResult.hit) {
                console.log(`[vek:cache] Cache hit: ${(0, import_node_path.relative)(process.cwd(), id)}`);
              } else {
                console.log(`[vek:cache] Cache miss: ${(0, import_node_path.relative)(process.cwd(), id)}`);
                hasChanges = true;
              }
            }
            return null;
          },
          buildEnd() {
            if (hasChanges) {
              saveCacheManifest();
            }
          },
          closeBundle() {
            cleanupOldEntries();
          }
        }
      ];
    },
    configResolved(_config) {
      console.log("[vek:cache] Enhanced build cache plugin initialized");
      console.log(`[vek:cache] Cache directory: ${cacheDir}`);
      console.log(`[vek:cache] Include patterns: ${include.join(", ")}`);
      console.log(`[vek:cache] Exclude patterns: ${exclude.join(", ")}`);
    }
  };
  function loadCacheManifest() {
    if (!(0, import_node_fs.existsSync)(manifestPath)) {
      return;
    }
    try {
      const content = (0, import_node_fs.readFileSync)(manifestPath, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed.version === "1.0.0") {
        migrateLegacyManifest(parsed);
      } else {
        cacheManifest = {
          ...parsed,
          files: new Map(Object.entries(parsed.files || {}))
        };
      }
      console.log("[vek:cache] Loaded cache manifest");
    } catch (error) {
      console.warn("[vek:cache] Failed to load cache manifest, starting fresh:", error);
      cacheManifest.files.clear();
    }
  }
  function saveCacheManifest() {
    try {
      cacheManifest.metadata.lastModified = Date.now();
      const serializable = {
        ...cacheManifest,
        files: Object.fromEntries(cacheManifest.files)
      };
      (0, import_node_fs.writeFileSync)(manifestPath, JSON.stringify(serializable, null, 2));
      console.log(`[vek:cache] Cache manifest updated with ${cacheManifest.files.size} entries`);
    } catch (error) {
      console.warn("[vek:cache] Failed to save cache manifest:", error);
    }
  }
  function migrateLegacyManifest(legacy) {
    console.log("[vek:cache] Migrating legacy cache manifest");
    cacheManifest.files.clear();
    if (legacy.files && typeof legacy.files === "object") {
      for (const [filePath, hash] of Object.entries(legacy.files)) {
        if (typeof hash === "string") {
          try {
            const stats = (0, import_node_fs.statSync)(filePath);
            cacheManifest.files.set(filePath, {
              hash,
              size: stats.size,
              mtime: stats.mtimeMs
            });
          } catch {
          }
        }
      }
    }
  }
  function checkFileCache(filePath) {
    try {
      const stats = (0, import_node_fs.statSync)(filePath);
      const cachedInfo = cacheManifest.files.get(filePath);
      if (!cachedInfo) {
        const hash = computeFileHash(filePath);
        const info = {
          hash,
          size: stats.size,
          mtime: stats.mtimeMs
        };
        cacheManifest.files.set(filePath, info);
        return { hit: false, info };
      }
      if (stats.mtimeMs !== cachedInfo.mtime || stats.size !== cachedInfo.size) {
        const hash = computeFileHash(filePath);
        const info = {
          hash,
          size: stats.size,
          mtime: stats.mtimeMs
        };
        cacheManifest.files.set(filePath, info);
        return { hit: hash === cachedInfo.hash, info };
      }
      return { hit: true, info: cachedInfo };
    } catch (error) {
      cacheManifest.files.delete(filePath);
      return { hit: false };
    }
  }
  function computeFileHash(filePath) {
    const cached = fileHashCache.get(filePath);
    if (cached) {
      return cached;
    }
    try {
      const content = (0, import_node_fs.readFileSync)(filePath);
      const hash = (0, import_node_crypto.createHash)("sha256").update(content).digest("hex").slice(0, 16);
      if (fileHashCache.size < 1e4) {
        fileHashCache.set(filePath, hash);
      }
      return hash;
    } catch (error) {
      console.warn(`[vek:cache] Failed to hash file ${filePath}:`, error);
      return "";
    }
  }
  function cleanupOldEntries() {
    const filesToRemove = [];
    for (const filePath of cacheManifest.files.keys()) {
      if (!(0, import_node_fs.existsSync)(filePath)) {
        filesToRemove.push(filePath);
      }
    }
    if (filesToRemove.length > 0) {
      for (const filePath of filesToRemove) {
        cacheManifest.files.delete(filePath);
      }
      console.log(`[vek:cache] Cleaned up ${filesToRemove.length} stale cache entries`);
      hasChanges = true;
    }
  }
}
function shouldCache(filePath, include, exclude) {
  for (const pattern of exclude) {
    if (matchesPattern(pattern, filePath)) {
      return false;
    }
  }
  for (const pattern of include) {
    if (matchesPattern(pattern, filePath)) {
      return true;
    }
  }
  return false;
}
var patternCache = /* @__PURE__ */ new Map();
function matchesPattern(pattern, filePath) {
  let regex = patternCache.get(pattern);
  if (!regex) {
    const regexPattern = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
    regex = new RegExp(`^${regexPattern}$`);
    if (patternCache.size < 100) {
      patternCache.set(pattern, regex);
    }
  }
  return regex.test(filePath);
}
var index_default = createCachePlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createCachePlugin
});

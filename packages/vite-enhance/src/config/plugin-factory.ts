import { createRequire } from 'node:module';
import type { Plugin as VitePlugin } from 'vite';
import { createLogger, type Logger } from '../shared/logger.js';

const logger: Logger = createLogger('plugin-factory');

/**
 * Plugin registry entry
 */
interface PluginEntry {
  /** Primary package name */
  package: string;
  /** Fallback package name */
  fallback?: string;
}

/**
 * Framework plugin registry
 */
export const FRAMEWORK_PLUGINS: Readonly<Record<string, PluginEntry>> = {
  vue: {
    package: '@vitejs/plugin-vue',
  },
  react: {
    package: '@vitejs/plugin-react',
  },
  svelte: {
    package: '@sveltejs/vite-plugin-svelte',
  },
  solid: {
    package: 'vite-plugin-solid',
  },
  lit: {
    package: '@lit-labs/vite-plugin',
    fallback: 'vite-plugin-lit',
  },
  preact: {
    package: '@preact/preset-vite',
  },
} as const;

/**
 * Feature plugin registry
 */
export const FEATURE_PLUGINS: Readonly<Record<string, PluginEntry>> = {
  pwa: {
    package: 'vite-plugin-pwa',
  },
  visualizer: {
    package: 'rollup-plugin-visualizer',
  },
  vueDevtools: {
    package: 'vite-plugin-vue-devtools',
  },
  cdnImport: {
    package: 'vite-plugin-cdn-import',
  },
  cache: {
    package: 'vite-plugin-cache',
  },
} as const;

/**
 * Dynamic plugin import cache with size limit
 */
const MAX_PLUGIN_CACHE_SIZE = 100;
const pluginCache = new Map<string, unknown>();

/**
 * Validate package name to prevent path traversal attacks
 * @param packageName - Package name to validate
 * @returns true if valid, false otherwise
 */
function isValidPackageName(packageName: string): boolean {
  // Valid npm package names:
  // - Start with @scope/ for scoped packages, or letter/number for regular
  // - Can contain letters, numbers, ., -, _, /
  // - Cannot contain .. or start with / or \
  
  // Block path traversal
  if (packageName.includes('..') || packageName.includes('\\')) {
    return false;
  }
  
  // Block absolute paths
  if (packageName.startsWith('/') || /^[a-zA-Z]:/.test(packageName)) {
    return false;
  }
  
  // Validate package name format
  // Scoped: @scope/name or @scope/name/subpath
  // Regular: name or name/subpath
  const validPattern = /^(@[a-zA-Z0-9][\w.-]*\/)?[a-zA-Z0-9][\w.-]*(\/[\w.-]+)*$/;
  return validPattern.test(packageName);
}

/**
 * Try to dynamically import a plugin
 * @param packageName - Package name to import
 * @returns Plugin function or null if not found
 */
export function tryImportPlugin(packageName: string): unknown {
  // Security: validate package name
  if (!isValidPackageName(packageName)) {
    logger.error(`Invalid package name: ${packageName}`);
    return null;
  }
  
  // Check cache first
  if (pluginCache.has(packageName)) {
    return pluginCache.get(packageName);
  }

  try {
    const require = createRequire(import.meta.url);
    const module = require(packageName);
    
    // Handle different export patterns
    const plugin = module.default || module;
    
    // Enforce cache size limit (LRU-like)
    if (pluginCache.size >= MAX_PLUGIN_CACHE_SIZE) {
      const firstKey = pluginCache.keys().next().value;
      if (firstKey) pluginCache.delete(firstKey);
    }
    
    // Cache the result
    pluginCache.set(packageName, plugin);
    
    return plugin;
  } catch (error) {
    // Cache null for failed imports to avoid repeated attempts
    if (pluginCache.size >= MAX_PLUGIN_CACHE_SIZE) {
      const firstKey = pluginCache.keys().next().value;
      if (firstKey) pluginCache.delete(firstKey);
    }
    pluginCache.set(packageName, null);
    
    if (process.env.DEBUG) {
      logger.debug(`Plugin ${packageName} not available:`, error);
    }
    
    return null;
  }
}

/**
 * Clear the plugin cache
 */
export function clearPluginCache(): void {
  pluginCache.clear();
}

/**
 * Create a framework plugin
 * @param name - Framework name (vue, react, etc.)
 * @param options - Plugin options
 * @returns Array of Vite plugins
 */
export function createFrameworkPlugin(
  name: keyof typeof FRAMEWORK_PLUGINS,
  options: Record<string, unknown> = {}
): VitePlugin[] {
  const entry = FRAMEWORK_PLUGINS[name];
  if (!entry) {
    logger.warn(`Unknown framework: ${name}`);
    return [];
  }

  // Try primary package
  let pluginFactory = tryImportPlugin(entry.package);
  
  // Try fallback if primary fails
  if (!pluginFactory && entry.fallback) {
    pluginFactory = tryImportPlugin(entry.fallback);
  }

  if (!pluginFactory || typeof pluginFactory !== 'function') {
    logger.warn(
      `${name} plugin not found. Please install ${entry.package}` +
      (entry.fallback ? ` or ${entry.fallback}` : '')
    );
    return [];
  }

  try {
    const result = (pluginFactory as (opts: unknown) => VitePlugin | VitePlugin[])(options);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    logger.error(`Failed to create ${name} plugin:`, error);
    return [];
  }
}

/**
 * Create a feature plugin
 * @param name - Feature name (pwa, visualizer, etc.)
 * @param options - Plugin options
 * @returns Array of Vite plugins
 */
export function createFeaturePlugin(
  name: keyof typeof FEATURE_PLUGINS,
  options: Record<string, unknown> = {}
): VitePlugin[] {
  const entry = FEATURE_PLUGINS[name];
  if (!entry) {
    logger.warn(`Unknown feature plugin: ${name}`);
    return [];
  }

  let pluginFactory = tryImportPlugin(entry.package);
  
  if (entry.fallback && !pluginFactory) {
    pluginFactory = tryImportPlugin(entry.fallback);
  }

  if (!pluginFactory || typeof pluginFactory !== 'function') {
    logger.warn(
      `${name} plugin not found. Please install ${entry.package}` +
      (entry.fallback ? ` or ${entry.fallback}` : '')
    );
    return [];
  }

  try {
    const result = (pluginFactory as (opts: unknown) => VitePlugin | VitePlugin[])(options);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    logger.error(`Failed to create ${name} plugin:`, error);
    return [];
  }
}

/**
 * Check if a plugin is available
 */
export function isPluginAvailable(packageName: string): boolean {
  if (!isValidPackageName(packageName)) {
    return false;
  }
  const plugin = tryImportPlugin(packageName);
  return plugin !== null && plugin !== undefined;
}

// Main entry point for Vite Enhance Kit
// This allows users to import directly from '@vite-enhance'

import type { UserConfig as ViteUserConfig } from 'vite';
import type { EnhanceConfig, EnhanceFeatureConfig } from '@vite-enhance/shared';

/**
 * Define an enhance configuration with type safety
 * Supports both new nested structure and legacy flat structure
 */
export function defineEnhanceConfig(config: EnhanceConfig): ViteUserConfig & { __enhanceConfig?: EnhanceConfig } {
  // Create a Vite config from the enhance config
  const viteConfig = createViteConfig(config);
  
  // Attach the original enhance config for compatibility
  (viteConfig as any).__enhanceConfig = config;
  
  return viteConfig;
}

/**
 * Convert EnhanceConfig to ViteConfig for direct Vite usage
 */
function createViteConfig(config: EnhanceConfig): ViteUserConfig {
  // Normalize config to handle both new and legacy structures
  const normalizedConfig = normalizeConfig(config);
  
  const viteConfig: ViteUserConfig = {
    ...config.vite,
    plugins: [
      ...(config.vite?.plugins || []),
      ...(config.plugins || []),
      ...createEnhancePlugins(normalizedConfig),
    ],
  };

  return viteConfig;
}

/**
 * Normalize config to handle both new nested and legacy flat structures
 */
function normalizeConfig(config: EnhanceConfig): EnhanceFeatureConfig {
  // If using new nested structure, use it directly
  if (config.enhance) {
    return config.enhance;
  }
  
  // Otherwise, convert legacy flat structure to nested structure
  const normalized: EnhanceFeatureConfig = {};
  
  if (config.preset !== undefined) normalized.preset = config.preset;
  if (config.vue !== undefined) normalized.vue = config.vue;
  if (config.react !== undefined) normalized.react = config.react;
  if (config.cdn !== undefined) normalized.cdn = config.cdn;
  if (config.cache !== undefined) normalized.cache = config.cache;
  if (config.analyze !== undefined) normalized.analyze = config.analyze;
  if (config.pwa !== undefined) normalized.pwa = config.pwa;
  
  return normalized;
}

/**
 * Create Vite plugins from normalized EnhanceConfig
 */
function createEnhancePlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // Add preset plugins
  if (config.preset) {
    plugins.push(...createPresetPlugins(config.preset, config));
  }

  return plugins;
}

/**
 * Create plugins for a preset
 */
function createPresetPlugins(preset: string | { name: string; options?: Record<string, unknown> }, config: EnhanceFeatureConfig): any[] {
  const presetName = typeof preset === 'string' ? preset : preset.name;
  const plugins: any[] = [];

  switch (presetName) {
    case 'app':
      // Add framework plugins
      plugins.push(...createFrameworkPlugins(config));
      // Add feature plugins
      plugins.push(...createFeaturePlugins(config));
      break;

    case 'lib':
      // Add framework plugins for library
      plugins.push(...createFrameworkPlugins(config));
      // Libraries typically don't need CDN, PWA, etc.
      break;
  }

  return plugins;
}

/**
 * Create framework-specific plugins
 */
function createFrameworkPlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // Vue plugin
  if (config.vue !== false) {
    const framework = detectFramework(config);
    if (framework === 'vue' || config.vue) {
      plugins.push(...createVuePlugin(config.vue));
    }
  }

  // React plugin
  if (config.react !== false) {
    const framework = detectFramework(config);
    if (framework === 'react' || config.react) {
      plugins.push(...createReactPlugin(config.react));
    }
  }

  return plugins;
}

/**
 * Create feature plugins
 */
function createFeaturePlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // CDN plugin
  if (config.cdn !== false) {
    plugins.push(...createCDNPlugin(config.cdn));
  }

  // Cache plugin
  if (config.cache !== false) {
    plugins.push(...createCachePlugin(config.cache));
  }

  // Analyze plugin
  if (config.analyze) {
    plugins.push(...createAnalyzePlugin(config.analyze));
  }

  // PWA plugin
  if (config.pwa) {
    plugins.push(...createPWAPlugin(config.pwa));
  }

  return plugins;
}

/**
 * Detect framework from config or dependencies
 */
function detectFramework(config: EnhanceFeatureConfig): 'vue' | 'react' | 'none' {
  // Check explicit framework config
  if (config.vue) return 'vue';
  if (config.react) return 'react';

  // Try to detect from package.json dependencies
  try {
    const fs = eval('require')('fs');
    const path = eval('require')('path');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
      };

      if (allDeps.vue || allDeps['@vue/core']) return 'vue';
      if (allDeps.react || allDeps['react-dom']) return 'react';
    }
  } catch {
    // Ignore errors in detection
  }

  return 'none';
}

/**
 * Create Vue plugin
 */
function createVuePlugin(options: any = {}): any[] {
  try {
    // Try to import the enhance Vue plugin first
    const enhanceVue = eval('require')('@vite-enhance/plugin-framework-vue');
    const plugin = enhanceVue.createVuePlugin(typeof options === 'boolean' ? {} : options);
    const vitePlugins = plugin.vitePlugin();
    return Array.isArray(vitePlugins) ? vitePlugins : [vitePlugins];
  } catch {
    try {
      // Fallback to @vitejs/plugin-vue
      const vue = eval('require')('@vitejs/plugin-vue');
      const plugin = vue.default ? vue.default(typeof options === 'boolean' ? {} : options) : vue(typeof options === 'boolean' ? {} : options);
      return Array.isArray(plugin) ? plugin : [plugin];
    } catch {
      console.warn('[vite-enhance] Vue plugin not found. Please install @vitejs/plugin-vue or @vite-enhance/plugin-framework-vue');
      return [];
    }
  }
}

/**
 * Create React plugin
 */
function createReactPlugin(options: any = {}): any[] {
  try {
    // Try to import the enhance React plugin first
    const enhanceReact = eval('require')('@vite-enhance/plugin-framework-react');
    const plugin = enhanceReact.createReactPlugin(typeof options === 'boolean' ? {} : options);
    const vitePlugins = plugin.vitePlugin();
    return Array.isArray(vitePlugins) ? vitePlugins : [vitePlugins];
  } catch {
    try {
      // Fallback to @vitejs/plugin-react
      const react = eval('require')('@vitejs/plugin-react');
      const plugin = react.default ? react.default(typeof options === 'boolean' ? {} : options) : react(typeof options === 'boolean' ? {} : options);
      return Array.isArray(plugin) ? plugin : [plugin];
    } catch {
      console.warn('[vite-enhance] React plugin not found. Please install @vitejs/plugin-react or @vite-enhance/plugin-framework-react');
      return [];
    }
  }
}

/**
 * Create CDN plugin
 */
function createCDNPlugin(options: any): any[] {
  try {
    const enhanceCDN = eval('require')('@vite-enhance/plugin-cdn');
    const plugin = enhanceCDN.createCDNPlugin(typeof options === 'boolean' ? {} : options);
    const vitePlugins = plugin.vitePlugin();
    return Array.isArray(vitePlugins) ? vitePlugins : [vitePlugins];
  } catch {
    console.warn('[vite-enhance] CDN plugin not found. Please install @vite-enhance/plugin-cdn');
    return [];
  }
}

/**
 * Create Cache plugin
 */
function createCachePlugin(options: any): any[] {
  try {
    const enhanceCache = eval('require')('@vite-enhance/plugin-cache');
    const plugin = enhanceCache.createCachePlugin(typeof options === 'boolean' ? {} : options);
    const vitePlugins = plugin.vitePlugin();
    return Array.isArray(vitePlugins) ? vitePlugins : [vitePlugins];
  } catch {
    console.warn('[vite-enhance] Cache plugin not found. Please install @vite-enhance/plugin-cache');
    return [];
  }
}

/**
 * Create Analyze plugin
 */
function createAnalyzePlugin(options: any): any[] {
  try {
    const enhanceAnalyze = eval('require')('@vite-enhance/plugin-analyze');
    const plugin = enhanceAnalyze.createAnalyzePlugin(typeof options === 'boolean' ? {} : options);
    const vitePlugins = plugin.vitePlugin();
    return Array.isArray(vitePlugins) ? vitePlugins : [vitePlugins];
  } catch {
    console.warn('[vite-enhance] Analyze plugin not found. Please install @vite-enhance/plugin-analyze');
    return [];
  }
}

/**
 * Create PWA plugin
 */
function createPWAPlugin(options: any): any[] {
  try {
    const enhancePWA = eval('require')('@vite-enhance/plugin-pwa');
    const plugin = enhancePWA.createPWAPlugin(typeof options === 'boolean' ? {} : options);
    const vitePlugins = plugin.vitePlugin();
    return Array.isArray(vitePlugins) ? vitePlugins : [vitePlugins];
  } catch {
    console.warn('[vite-enhance] PWA plugin not found. Please install @vite-enhance/plugin-pwa');
    return [];
  }
}

// Re-export types for convenience
export type { 
  EnhanceConfig, 
  EnhanceFeatureConfig,
  VuePluginOptions,
  ReactPluginOptions,
  CDNOptions,
  CacheOptions,
  AnalyzeOptions,
  PWAOptions
} from '@vite-enhance/shared';
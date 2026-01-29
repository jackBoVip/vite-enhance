import type { UserConfig as ViteUserConfig, Plugin as VitePlugin, LibraryFormats } from 'vite';
import type { 
  EnhanceConfig, 
  EnhanceFeatureConfig, 
  CDNOptions, 
  CacheOptions, 
  AnalyzeOptions, 
  PWAOptions,
  VuePluginOptions,
} from '../shared/index.js';
import { getPackageName } from '../shared/package-utils.js';
import { createLogger } from '../shared/logger.js';
import { detectFramework, detectPreset } from './detectors.js';
import { createFrameworkPlugin, tryImportPlugin } from './plugin-factory.js';
import { createCompressPlugin } from '../plugins/compress/index.js';
import { createCDNPlugin } from '../plugins/cdn/index.js';

const logger = createLogger('vite-integration');

/**
 * Get build output directory based on preset
 */
function getBuildOutDir(preset: string | { name: string } | undefined): string {
  const presetName = typeof preset === 'string' ? preset : preset?.name;
  
  if (presetName === 'lib') {
    return 'dist';
  }
  
  return `dist/${getPackageName()}`;
}

/**
 * Get default library build configuration
 */
function getDefaultLibConfig(): {
  entry: string;
  name: string;
  formats: LibraryFormats[];
  fileName: (format: string) => string;
} {
  return {
    entry: 'src/index.ts',
    name: getPackageName(),
    formats: ['es', 'cjs'] as LibraryFormats[],
    fileName: (format: string) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
  };
}

/**
 * Get default Rollup output options
 */
function getDefaultRollupOptions(): { output: { exports: 'named' } } {
  return {
    output: {
      exports: 'named' as const,
    },
  };
}

/**
 * Normalize config to extract enhance features
 */
function normalizeConfig(config: EnhanceConfig): EnhanceFeatureConfig {
  if (config.enhance) {
    const normalized = { ...config.enhance };
    
    if (normalized.preset === undefined) {
      const detected = detectPreset();
      // Only use 'app' or 'lib', ignore 'monorepo'
      normalized.preset = detected === 'monorepo' ? 'app' : detected;
    }
    
    return normalized;
  }
  
  return {};
}

/**
 * Convert EnhanceConfig to ViteConfig
 */
export function createViteConfig(config: EnhanceConfig): ViteUserConfig {
  const normalizedConfig = normalizeConfig(config);
  const outDir = getBuildOutDir(normalizedConfig.preset);
  const presetName = typeof normalizedConfig.preset === 'string' 
    ? normalizedConfig.preset 
    : normalizedConfig.preset?.name;
  const isLibBuild = presetName === 'lib';
  
  // Build configuration - handle null/undefined safely
  const viteBuild = config.vite?.build;
  const buildConfig: ViteUserConfig['build'] = {
    ...(viteBuild && typeof viteBuild === 'object' ? viteBuild : {}),
    outDir: viteBuild?.outDir || outDir,
  };
  
  // Library build defaults
  if (isLibBuild) {
    const defaultLib = getDefaultLibConfig();
    const defaultRollup = getDefaultRollupOptions();
    
    buildConfig.lib = viteBuild?.lib
      ? { ...defaultLib, ...viteBuild.lib }
      : defaultLib;
    
    const rollupOptions = viteBuild?.rollupOptions;
    const rollupOutput = rollupOptions?.output;
    
    buildConfig.rollupOptions = rollupOptions
      ? {
          ...defaultRollup,
          ...rollupOptions,
          output: {
            ...defaultRollup.output,
            ...(rollupOutput && typeof rollupOutput === 'object' && !Array.isArray(rollupOutput) 
              ? rollupOutput as Record<string, unknown> 
              : {}),
          },
        }
      : defaultRollup;
  }
  
  // Collect all plugins - ensure arrays
  const vitePlugins = config.vite?.plugins;
  const extraPlugins = config.plugins;
  
  const plugins: VitePlugin[] = [
    ...(Array.isArray(vitePlugins) ? vitePlugins as VitePlugin[] : []),
    ...(Array.isArray(extraPlugins) ? extraPlugins as VitePlugin[] : []),
    ...createEnhancePlugins(normalizedConfig),
  ];
  
  return {
    ...config.vite,
    build: buildConfig,
    plugins,
  };
}

/**
 * Create Vite plugins from EnhanceConfig
 */
function createEnhancePlugins(config: EnhanceFeatureConfig): VitePlugin[] {
  const plugins: VitePlugin[] = [];
  const presetName = typeof config.preset === 'string' 
    ? config.preset 
    : config.preset?.name || 'app';

  // Framework plugins
  plugins.push(...createFrameworkPlugins(config));

  // Feature plugins based on preset
  if (presetName === 'app') {
    plugins.push(...createAppFeaturePlugins(config));
  } else if (presetName === 'lib') {
    plugins.push(...createLibFeaturePlugins(config));
  }

  return plugins;
}

/**
 * Create framework-specific plugins
 */
function createFrameworkPlugins(config: EnhanceFeatureConfig): VitePlugin[] {
  const plugins: VitePlugin[] = [];
  const detectedFramework = detectFramework(config);

  // Map of framework to config key
  const frameworks = ['vue', 'react', 'svelte', 'solid', 'lit', 'preact'] as const;

  for (const framework of frameworks) {
    const configValue = config[framework];
    
    // Skip if explicitly disabled
    if (configValue === false) continue;
    
    // Create plugin if explicitly configured or auto-detected
    if (configValue || detectedFramework === framework) {
      // Handle null case: typeof null === 'object'
      const options = (typeof configValue === 'object' && configValue !== null) ? configValue : {};
      plugins.push(...createFrameworkPlugin(framework, options as Record<string, unknown>));
      
      // Add Vue DevTools if Vue
      if (framework === 'vue' && typeof configValue === 'object' && configValue !== null) {
        const vueOptions = configValue as VuePluginOptions;
        if (vueOptions.devtools && vueOptions.devtools.enabled !== false) {
          plugins.push(...createVueDevToolsPlugin(vueOptions.devtools));
        }
      }
    }
  }

  return plugins;
}

/**
 * Create Vue DevTools plugin
 */
function createVueDevToolsPlugin(options: Record<string, unknown>): VitePlugin[] {
  const plugin = tryImportPlugin('vite-plugin-vue-devtools');
  if (!plugin || typeof plugin !== 'function') {
    return [];
  }
  
  try {
    const result = (plugin as (opts: unknown) => VitePlugin | VitePlugin[])(options);
    return Array.isArray(result) ? result : [result];
  } catch {
    return [];
  }
}

/**
 * Create feature plugins for app preset
 */
function createAppFeaturePlugins(config: EnhanceFeatureConfig): VitePlugin[] {
  const plugins: VitePlugin[] = [];

  // CDN plugin
  if (config.cdn !== false && config.cdn !== undefined) {
    plugins.push(...createCDNPluginInternal(config.cdn as boolean | CDNOptions));
  }

  // Cache plugin
  if (config.cache !== false && config.cache !== undefined) {
    plugins.push(...createCachePluginInternal(config.cache as boolean | CacheOptions));
  }

  // Analyze plugin
  if (config.analyze) {
    plugins.push(...createAnalyzePluginInternal(config.analyze as boolean | AnalyzeOptions));
  }

  // PWA plugin
  if (config.pwa) {
    plugins.push(...createPWAPluginInternal(config.pwa as boolean | PWAOptions));
  }

  // Compress plugin
  if (config.compress !== false) {
    const compressOptions = config.compress === true ? {} : (config.compress || {});
    const compressPluginInstance = createCompressPlugin(compressOptions);
    const compressVitePlugins = compressPluginInstance.vitePlugin?.();
    if (compressVitePlugins) {
      if (Array.isArray(compressVitePlugins)) {
        plugins.push(...compressVitePlugins);
      } else {
        plugins.push(compressVitePlugins);
      }
    }
  }

  return plugins;
}

/**
 * Create feature plugins for lib preset
 */
function createLibFeaturePlugins(config: EnhanceFeatureConfig): VitePlugin[] {
  const plugins: VitePlugin[] = [];

  // Compress plugin
  if (config.compress !== false) {
    const compressOptions = config.compress === true ? {} : (config.compress || {});
    const compressPluginInstance = createCompressPlugin(compressOptions);
    const compressVitePlugins = compressPluginInstance.vitePlugin?.();
    if (compressVitePlugins) {
      if (Array.isArray(compressVitePlugins)) {
        plugins.push(...compressVitePlugins);
      } else {
        plugins.push(compressVitePlugins);
      }
    }
  }

  // Analyze plugin
  if (config.analyze) {
    plugins.push(...createAnalyzePluginInternal(config.analyze as boolean | AnalyzeOptions));
  }

  return plugins;
}

/**
 * Create CDN plugin with enhanced configuration
 * Uses our internal CDN plugin implementation with auto-detection support
 */
function createCDNPluginInternal(options: boolean | CDNOptions): VitePlugin[] {
  // Convert boolean/options to CDNOptions
  const opts = options === true ? {} : (options === false ? null : options);
  
  try {
    const cdnPlugin = createCDNPlugin(opts);
    const vitePlugins = cdnPlugin.vitePlugin?.();
    
    if (vitePlugins) {
      if (Array.isArray(vitePlugins)) {
        return vitePlugins;
      }
      return [vitePlugins];
    }
    return [];
  } catch (error) {
    logger.error('Failed to create CDN plugin:', error);
    return [];
  }
}

/**
 * Create Cache plugin
 */
function createCachePluginInternal(options: boolean | CacheOptions): VitePlugin[] {
  const cachePlugin = tryImportPlugin('vite-plugin-cache');
  if (!cachePlugin) {
    logger.debug('vite-plugin-cache not found, skipping cache plugin');
    return [];
  }

  try {
    const opts = options === true ? {} : options;
    const plugin = (cachePlugin as (opts: unknown) => VitePlugin)(opts);
    return [plugin];
  } catch (error) {
    logger.error('Failed to create cache plugin:', error);
    return [];
  }
}

/**
 * Create Analyze plugin
 */
function createAnalyzePluginInternal(options: boolean | AnalyzeOptions): VitePlugin[] {
  const visualizer = tryImportPlugin('rollup-plugin-visualizer');
  if (!visualizer) {
    logger.warn('rollup-plugin-visualizer not found. Please install it for bundle analysis.');
    return [];
  }

  try {
    const opts = options === true ? { open: true } : options;
    const plugin = (visualizer as (opts: unknown) => VitePlugin)(opts);
    return [plugin];
  } catch (error) {
    logger.error('Failed to create analyze plugin:', error);
    return [];
  }
}

/**
 * Create PWA plugin
 */
function createPWAPluginInternal(options: boolean | PWAOptions): VitePlugin[] {
  const pwa = tryImportPlugin('vite-plugin-pwa');
  if (!pwa) {
    logger.warn('vite-plugin-pwa not found. Please install it for PWA support.');
    return [];
  }

  try {
    const opts = options === true ? {} : options;
    const result = (pwa as (opts: unknown) => VitePlugin | VitePlugin[])(opts);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    logger.error('Failed to create PWA plugin:', error);
    return [];
  }
}

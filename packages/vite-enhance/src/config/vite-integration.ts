import type { UserConfig as ViteUserConfig, Plugin as VitePlugin, LibraryFormats } from 'vite';
import type {
  EnhanceConfig,
  EnhanceFeatureConfig,
  EnhancePlugin,
  CDNOptions,
  CacheOptions,
  AnalyzeOptions,
  PWAOptions,
  CompressOptions,
  VuePluginOptions,
} from '../shared/index.js';
import { getPackageName } from '../shared/package-utils.js';
import { createLogger } from '../shared/logger.js';
import { detectFramework, detectPreset } from './detectors.js';
import { applyDefaults } from './defaults.js';
import { createFrameworkPlugin, tryImportPlugin } from './plugin-factory.js';
import { createAnalyzePlugin } from '../plugins/analyze/index.js';
import { createCachePlugin } from '../plugins/cache/index.js';
import { createCDNPlugin } from '../plugins/cdn/index.js';
import { createCompressPlugin } from '../plugins/compress/index.js';
import { createPWAPlugin } from '../plugins/pwa/index.js';

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
  const normalized = { ...(config.enhance ?? {}) };

  if (normalized.preset === undefined) {
    normalized.preset = detectPreset() === 'lib' ? 'lib' : 'app';
  }

  return normalized;
}

/**
 * Convert EnhanceConfig to ViteConfig
 */
export function createViteConfig(config: EnhanceConfig): ViteUserConfig {
  const mergedConfig = applyDefaults(config);
  const normalizedConfig = normalizeConfig(mergedConfig);
  const outDir = getBuildOutDir(normalizedConfig.preset);
  const presetName = typeof normalizedConfig.preset === 'string'
    ? normalizedConfig.preset
    : normalizedConfig.preset?.name;
  const isLibBuild = presetName === 'lib';

  const viteBuild = mergedConfig.vite?.build;
  const buildConfig: ViteUserConfig['build'] = {
    ...(viteBuild && typeof viteBuild === 'object' ? viteBuild : {}),
    outDir: viteBuild?.outDir || outDir,
  };

  if (isLibBuild) {
    const defaultLib = getDefaultLibConfig();
    const defaultRollup = getDefaultRollupOptions();

    buildConfig.lib = viteBuild?.lib
      ? { ...defaultLib, ...viteBuild.lib }
      : defaultLib;

    const rollupOptions = viteBuild?.rollupOptions;
    const rollupOutput = rollupOptions?.output;

    const output = Array.isArray(rollupOutput)
      ? rollupOutput
      : {
          ...defaultRollup.output,
          ...(rollupOutput && typeof rollupOutput === 'object'
            ? rollupOutput as Record<string, unknown>
            : {}),
        };

    buildConfig.rollupOptions = rollupOptions
      ? {
          ...defaultRollup,
          ...rollupOptions,
          output,
        }
      : defaultRollup;
  }

  const vitePlugins = mergedConfig.vite?.plugins;
  const extraPlugins = mergedConfig.plugins;

  const plugins: VitePlugin[] = [
    ...(Array.isArray(vitePlugins) ? vitePlugins as VitePlugin[] : []),
    ...(Array.isArray(extraPlugins) ? extraPlugins as VitePlugin[] : []),
    ...createEnhancePlugins(normalizedConfig),
  ];

  return {
    ...mergedConfig.vite,
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

  plugins.push(...createFrameworkPlugins(config));

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
  const frameworks = ['vue', 'react', 'svelte', 'solid', 'lit', 'preact'] as const;

  for (const framework of frameworks) {
    const configValue = config[framework];

    if (configValue === false) continue;

    if (configValue || detectedFramework === framework) {
      const options = (typeof configValue === 'object' && configValue !== null) ? configValue : {};
      plugins.push(...createFrameworkPlugin(framework, options as Record<string, unknown>));

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

  if (config.cdn !== false && config.cdn !== undefined) {
    const cdnOptions = config.cdn === true ? {} : config.cdn;
    appendEnhancePluginFromFactory(plugins, 'CDN', () => createCDNPlugin(cdnOptions as CDNOptions));
  }

  if (config.cache !== false && config.cache !== undefined) {
    const cacheOptions = config.cache === true ? {} : config.cache;
    appendEnhancePluginFromFactory(plugins, 'cache', () => createCachePlugin(cacheOptions as CacheOptions));
  }

  if (shouldEnableAnalyze(config.analyze)) {
    const analyzeOptions = config.analyze === true ? {} : config.analyze;
    appendEnhancePluginFromFactory(
      plugins,
      'analyze',
      () => createAnalyzePlugin(analyzeOptions as AnalyzeOptions)
    );
  }

  if (config.pwa) {
    const pwaOptions = config.pwa === true ? {} : config.pwa;
    appendEnhancePluginFromFactory(plugins, 'PWA', () => createPWAPlugin(pwaOptions as PWAOptions));
  }

  if (shouldEnableCompressionForPreset(config.compress, 'app')) {
    appendEnhancePluginFromFactory(
      plugins,
      'compress',
      () => createCompressPlugin(resolveCompressOptions(config.compress))
    );
  }

  return plugins;
}

/**
 * Create feature plugins for lib preset
 */
function createLibFeaturePlugins(config: EnhanceFeatureConfig): VitePlugin[] {
  const plugins: VitePlugin[] = [];

  if (shouldEnableCompressionForPreset(config.compress, 'lib')) {
    appendEnhancePluginFromFactory(
      plugins,
      'compress',
      () => createCompressPlugin(resolveCompressOptions(config.compress))
    );
  }

  if (shouldEnableAnalyze(config.analyze)) {
    const analyzeOptions = config.analyze === true ? {} : config.analyze;
    appendEnhancePluginFromFactory(
      plugins,
      'analyze',
      () => createAnalyzePlugin(analyzeOptions as AnalyzeOptions)
    );
  }

  return plugins;
}

function shouldEnableAnalyze(analyze: boolean | AnalyzeOptions | undefined): boolean {
  if (analyze === undefined || analyze === false) {
    return false;
  }
  if (analyze === true) {
    return true;
  }
  return analyze.enabled !== false;
}

function shouldEnableCompressionForPreset(
  compress: boolean | CompressOptions | undefined,
  preset: 'app' | 'lib'
): boolean {
  if (compress === false) {
    return false;
  }
  if (compress === true || compress === undefined) {
    return true;
  }
  if (compress.enabled === false) {
    return false;
  }
  if (preset === 'lib' && (compress.disableForLib === true || compress.appOnly === true)) {
    return false;
  }
  return true;
}

function resolveCompressOptions(compress: boolean | CompressOptions | undefined): CompressOptions {
  if (compress === true || compress === undefined) {
    return {};
  }
  if (compress === false) {
    return { enabled: false };
  }
  return compress;
}

function appendEnhancePluginFromFactory(
  plugins: VitePlugin[],
  name: string,
  factory: () => EnhancePlugin
): void {
  try {
    appendEnhancePlugin(plugins, factory());
  } catch (error) {
    logger.error(`Failed to create ${name} plugin:`, error);
  }
}

function appendEnhancePlugin(plugins: VitePlugin[], plugin: EnhancePlugin): void {
  const vitePlugins = plugin.vitePlugin?.();
  if (!vitePlugins) {
    return;
  }
  if (Array.isArray(vitePlugins)) {
    plugins.push(...vitePlugins);
  } else {
    plugins.push(vitePlugins);
  }
}

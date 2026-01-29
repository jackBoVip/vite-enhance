/**
 * Vite Enhance Kit
 * A modular Vite enhancement toolkit for enterprise-grade frontend engineering
 * 
 * @packageDocumentation
 */

// Main configuration function
export { defineEnhanceConfig } from './config/index.js';

// Configuration utilities
export { 
  validateConfig,
  defaultConfig,
  applyDefaults,
  EnhanceConfigSchema,
  detectFramework,
  detectPreset,
  isMonorepo,
} from './config/index.js';

// Plugin factory
export {
  tryImportPlugin,
  createFrameworkPlugin,
  createFeaturePlugin,
  isPluginAvailable,
  clearPluginCache,
} from './config/index.js';

// Type exports
export type { 
  EnhanceConfig, 
  EnhanceFeatureConfig,
  ResolvedEnhanceConfig,
  PresetConfig,
  VuePluginOptions,
  ReactPluginOptions,
  SveltePluginOptions,
  SolidPluginOptions,
  LitPluginOptions,
  PreactPluginOptions,
  CDNOptions,
  CacheOptions,
  AnalyzeOptions,
  PWAOptions,
  CompressOptions,
  ValidationResult,
  ValidationError,
} from './config/index.js';

// Plugin creation functions
export { createAnalyzePlugin } from './plugins/analyze/index.js';
export { createCachePlugin, clearPatternCache } from './plugins/cache/index.js';
export { createCDNPlugin } from './plugins/cdn/index.js';
export { createVuePlugin } from './plugins/framework-vue/index.js';
export { createReactPlugin } from './plugins/framework-react/index.js';
export { createPWAPlugin } from './plugins/pwa/index.js';
export { createCompressPlugin, compressPlugin } from './plugins/compress/index.js';

// Plugin option types
export type { CreateAnalyzePluginOptions } from './plugins/analyze/index.js';
export type { CreateCachePluginOptions } from './plugins/cache/index.js';
export type { CreateCDNPluginOptions } from './plugins/cdn/index.js';
export type { CreateVuePluginOptions } from './plugins/framework-vue/index.js';
export type { CreateReactPluginOptions } from './plugins/framework-react/index.js';
export type { CreatePWAPluginOptions } from './plugins/pwa/index.js';
export type { CreateCompressPluginOptions } from './plugins/compress/index.js';

// Shared utilities
export { 
  createLogger, 
  setLogLevel, 
  getLogLevel,
  type Logger,
  type LogLevel,
} from './shared/logger.js';

// Package utilities
export {
  getPackageJson,
  getPackageName,
  getAllDependencies,
  getProductionDependencies,
  hasDependency,
  hasAnyDependency,
  clearPackageCache,
  type PackageJson,
} from './shared/package-utils.js';

// CDN module utilities
export {
  CDN_MODULE_CONFIGS,
  CDN_PROVIDERS,
  getCDNUrlTemplate,
  detectCDNProvider,
  renderCDNUrl,
  getModuleConfig,
  isModuleSupported,
  getSupportedModules,
  autoDetectCDNModules,
  type CDNModule,
  type CDNProvider,
} from './shared/cdn-modules.js';

// Plugin types
export type { 
  EnhancePlugin, 
  PluginContext,
  ProjectType,
  FrameworkType,
} from './shared/types/plugin.js';

// Build context
export type { BuildContext } from './shared/types/hooks.js';

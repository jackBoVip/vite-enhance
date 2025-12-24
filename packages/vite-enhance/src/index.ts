// Main entry point for Vite Enhance Kit
// This allows users to import directly from 'vite-enhance'

// Re-export everything from config package
export { 
  defineEnhanceConfig,
  validateConfig,
  defaultConfig,
  applyDefaults,
  EnhanceConfigSchema,
} from './config/index.js';

// Re-export types for convenience
export type { 
  EnhanceConfig, 
  EnhanceFeatureConfig,
  ResolvedEnhanceConfig,
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
  PresetConfig,
} from './config/index.js';

// Export plugin creation functions
export { createAnalyzePlugin } from './plugins/analyze/index.js';
export { createCachePlugin } from './plugins/cache/index.js';
export { createCDNPlugin } from './plugins/cdn/index.js';
export { createVuePlugin } from './plugins/framework-vue/index.js';
export { createReactPlugin } from './plugins/framework-react/index.js';
export { createPWAPlugin } from './plugins/pwa/index.js';
export { compressPlugin } from './plugins/compress/index.js';

// Export plugin types
export type { CreateAnalyzePluginOptions } from './plugins/analyze/index.js';
export type { CreateCachePluginOptions } from './plugins/cache/index.js';
export type { CreateCDNPluginOptions } from './plugins/cdn/index.js';
export type { CreateVuePluginOptions } from './plugins/framework-vue/index.js';
export type { CreateReactPluginOptions } from './plugins/framework-react/index.js';
export type { CreatePWAPluginOptions } from './plugins/pwa/index.js';

// Export shared utilities
export { createLogger } from './shared/logger.js';
export type { Logger } from './shared/logger.js';
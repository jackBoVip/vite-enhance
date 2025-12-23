// Main entry point for Vite Enhance Kit
// This allows users to import directly from '@vite-enhance'

// Re-export everything from config package to avoid duplication
export { 
  defineEnhanceConfig,
  validateConfig,
  defaultConfig,
  applyDefaults,
  EnhanceConfigSchema,
} from '@vite-enhance/config';

// Re-export types for convenience
export type { 
  EnhanceConfig, 
  EnhanceFeatureConfig,
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
  ValidationResult,
  ValidationError,
  PresetConfig,
} from '@vite-enhance/config';
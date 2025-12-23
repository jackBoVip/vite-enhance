import type { EnhanceConfig } from '@vite-enhance/shared';
import type { UserConfig as ViteUserConfig } from 'vite';
import { createViteConfig } from './vite-integration.js';

/**
 * Define an enhance configuration with type safety
 * Can be used directly as a Vite config or with vek CLI
 * @param config - The enhance configuration object
 * @returns A configuration object that works with both Vite and vek
 */
export function defineEnhanceConfig(config: EnhanceConfig): ViteUserConfig & { __enhanceConfig?: EnhanceConfig } {
  // Create a Vite config from the enhance config
  const viteConfig = createViteConfig(config);
  
  // Attach the original enhance config for vek CLI compatibility
  (viteConfig as any).__enhanceConfig = config;
  
  return viteConfig;
}

// Re-export types for convenience
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
} from '@vite-enhance/shared';

// Re-export validation functions
export { validateConfig } from './validator.js';
export type { ValidationResult, ValidationError } from './validator.js';

// Re-export default values and application
export { defaultConfig, applyDefaults } from './defaults.js';

// Re-export schema
export { EnhanceConfigSchema } from './schema.js';
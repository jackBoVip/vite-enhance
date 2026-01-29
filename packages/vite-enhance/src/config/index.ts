import type { EnhanceConfig } from '../shared/index.js';
import type { UserConfig as ViteUserConfig } from 'vite';
import { createViteConfig } from './vite-integration.js';

/**
 * Define an enhance configuration with type safety
 * Can be used directly as a Vite config or with vek CLI
 * @param config - The enhance configuration object
 * @returns A configuration object that works with both Vite and vek
 */
export function defineEnhanceConfig(
  config: EnhanceConfig
): ViteUserConfig & { __enhanceConfig?: EnhanceConfig } {
  const viteConfig = createViteConfig(config);
  
  // Attach the original enhance config for CLI compatibility
  (viteConfig as ViteUserConfig & { __enhanceConfig?: EnhanceConfig }).__enhanceConfig = config;
  
  return viteConfig;
}

// Re-export types
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
} from '../shared/index.js';

// Re-export validation
export { validateConfig } from './validator.js';
export type { ValidationResult, ValidationError } from './validator.js';

// Re-export defaults
export { defaultConfig, applyDefaults } from './defaults.js';

// Re-export schema
export { EnhanceConfigSchema } from './schema.js';

// Re-export detectors
export { detectFramework, detectPreset, isMonorepo } from './detectors.js';

// Re-export plugin factory
export { 
  tryImportPlugin, 
  createFrameworkPlugin, 
  createFeaturePlugin,
  isPluginAvailable,
  clearPluginCache,
} from './plugin-factory.js';

import type { EnhanceConfig } from '@vite-enhance/shared';
import type { UserConfig as ViteUserConfig } from 'vite';
/**
 * Define an enhance configuration with type safety
 * Can be used directly as a Vite config or with vek CLI
 * @param config - The enhance configuration object
 * @returns A configuration object that works with both Vite and vek
 */
export declare function defineEnhanceConfig(config: EnhanceConfig): ViteUserConfig & {
    __enhanceConfig?: EnhanceConfig;
};
export type { EnhanceConfig, EnhanceFeatureConfig, ResolvedEnhanceConfig, PresetConfig, VuePluginOptions, ReactPluginOptions, CDNOptions, CacheOptions, AnalyzeOptions, PWAOptions, } from '@vite-enhance/shared';
export { validateConfig } from './validator.js';
export type { ValidationResult, ValidationError } from './validator.js';
export { defaultConfig, applyDefaults } from './defaults.js';
export { EnhanceConfigSchema } from './schema.js';
//# sourceMappingURL=index.d.ts.map
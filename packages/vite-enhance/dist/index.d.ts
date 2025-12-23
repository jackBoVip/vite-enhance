import type { UserConfig as ViteUserConfig } from 'vite';
import type { EnhanceConfig } from '@vite-enhance/shared';
/**
 * Define an enhance configuration with type safety
 * Supports both new nested structure and legacy flat structure
 */
export declare function defineEnhanceConfig(config: EnhanceConfig): ViteUserConfig & {
    __enhanceConfig?: EnhanceConfig;
};
export type { EnhanceConfig, EnhanceFeatureConfig, VuePluginOptions, ReactPluginOptions, CDNOptions, CacheOptions, AnalyzeOptions, PWAOptions } from '@vite-enhance/shared';
//# sourceMappingURL=index.d.ts.map
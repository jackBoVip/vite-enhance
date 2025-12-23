import type { EnhanceConfig } from '@vite-enhance/shared';

/**
 * Default configuration values
 */
export const defaultConfig: Partial<EnhanceConfig> = {
  preset: 'app',
  plugins: [],
  cdn: false,
  cache: true,
  analyze: false,
  pwa: false,
};

/**
 * Apply default values to a partial configuration
 * @param config - Partial configuration to apply defaults to
 * @returns Configuration with defaults applied
 */
export function applyDefaults(config: Partial<EnhanceConfig> = {}): EnhanceConfig {
  return {
    ...defaultConfig,
    ...config,
    // Merge arrays instead of replacing them
    plugins: [
      ...(defaultConfig.plugins || []),
      ...(config.plugins || []),
    ],
  } as EnhanceConfig;
}
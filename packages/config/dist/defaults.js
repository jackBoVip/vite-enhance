/**
 * Default configuration values
 */
export const defaultConfig = {
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
export function applyDefaults(config = {}) {
    return {
        ...defaultConfig,
        ...config,
        // Merge arrays instead of replacing them
        plugins: [
            ...(defaultConfig.plugins || []),
            ...(config.plugins || []),
        ],
    };
}
//# sourceMappingURL=defaults.js.map
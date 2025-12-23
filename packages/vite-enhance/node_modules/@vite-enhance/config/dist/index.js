import { createViteConfig } from './vite-integration.js';
/**
 * Define an enhance configuration with type safety
 * Can be used directly as a Vite config or with vek CLI
 * @param config - The enhance configuration object
 * @returns A configuration object that works with both Vite and vek
 */
export function defineEnhanceConfig(config) {
    // Create a Vite config from the enhance config
    const viteConfig = createViteConfig(config);
    // Attach the original enhance config for vek CLI compatibility
    viteConfig.__enhanceConfig = config;
    return viteConfig;
}
// Re-export validation functions
export { validateConfig } from './validator.js';
// Re-export default values and application
export { defaultConfig, applyDefaults } from './defaults.js';
// Re-export schema
export { EnhanceConfigSchema } from './schema.js';
//# sourceMappingURL=index.js.map
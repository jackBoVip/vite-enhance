/**
 * Convert EnhanceConfig to ViteConfig for direct Vite usage
 */
export function createViteConfig(config) {
    // Normalize config to handle both new and legacy structures
    const normalizedConfig = normalizeConfig(config);
    const viteConfig = {
        ...config.vite,
        plugins: [
            ...(config.vite?.plugins || []),
            ...(config.plugins || []),
            ...createEnhancePlugins(normalizedConfig),
        ],
    };
    return viteConfig;
}
/**
 * Normalize config to handle both new nested and legacy flat structures
 */
function normalizeConfig(config) {
    // If using new nested structure, use it directly
    if (config.enhance) {
        return config.enhance;
    }
    // Otherwise, convert legacy flat structure to nested structure
    const normalized = {};
    if (config.preset !== undefined)
        normalized.preset = config.preset;
    if (config.vue !== undefined)
        normalized.vue = config.vue;
    if (config.react !== undefined)
        normalized.react = config.react;
    if (config.cdn !== undefined)
        normalized.cdn = config.cdn;
    if (config.cache !== undefined)
        normalized.cache = config.cache;
    if (config.analyze !== undefined)
        normalized.analyze = config.analyze;
    if (config.pwa !== undefined)
        normalized.pwa = config.pwa;
    return normalized;
}
/**
 * Create Vite plugins from normalized EnhanceConfig
 */
function createEnhancePlugins(config) {
    const plugins = [];
    // Add preset plugins
    if (config.preset) {
        plugins.push(...createPresetPlugins(config.preset, config));
    }
    return plugins;
}
/**
 * Create plugins for a preset
 */
function createPresetPlugins(preset, config) {
    const presetName = typeof preset === 'string' ? preset : preset.name;
    const plugins = [];
    switch (presetName) {
        case 'app':
            // Add framework plugins
            plugins.push(...createFrameworkPlugins(config));
            // Add feature plugins
            plugins.push(...createFeaturePlugins(config));
            break;
        case 'lib':
            // Add framework plugins for library
            plugins.push(...createFrameworkPlugins(config));
            // Libraries typically don't need CDN, PWA, etc.
            break;
    }
    return plugins;
}
/**
 * Create framework-specific plugins
 */
function createFrameworkPlugins(config) {
    const plugins = [];
    // Vue plugin
    if (config.vue !== false) {
        const framework = detectFramework(config);
        if (framework === 'vue' || config.vue) {
            plugins.push(...createVuePlugin(config.vue));
        }
    }
    // React plugin
    if (config.react !== false) {
        const framework = detectFramework(config);
        if (framework === 'react' || config.react) {
            plugins.push(...createReactPlugin(config.react));
        }
    }
    return plugins;
}
/**
 * Create feature plugins
 */
function createFeaturePlugins(config) {
    const plugins = [];
    // CDN plugin
    if (config.cdn !== false) {
        plugins.push(...createCDNPlugin(config.cdn));
    }
    // Cache plugin
    if (config.cache !== false) {
        plugins.push(...createCachePlugin(config.cache));
    }
    // Analyze plugin
    if (config.analyze) {
        plugins.push(...createAnalyzePlugin(config.analyze));
    }
    // PWA plugin
    if (config.pwa) {
        plugins.push(...createPWAPlugin(config.pwa));
    }
    return plugins;
}
/**
 * Detect framework from config or dependencies
 */
function detectFramework(config) {
    // Check explicit framework config
    if (config.vue)
        return 'vue';
    if (config.react)
        return 'react';
    // For now, just return 'none' to avoid file system access issues
    // In a real implementation, this would check package.json
    return 'none';
}
/**
 * Create Vue plugin
 */
function createVuePlugin(options = {}) {
    try {
        // Try to dynamically import the Vue plugin
        const vuePlugin = tryImportPlugin('@vitejs/plugin-vue');
        if (vuePlugin) {
            return [vuePlugin(options)];
        }
        console.warn('[vite-enhance] Vue plugin not found. Please install @vitejs/plugin-vue');
        return [];
    }
    catch (error) {
        console.warn('[vite-enhance] Vue plugin not found. Please install @vitejs/plugin-vue');
        console.warn('Error:', error?.message || 'Unknown error');
        return [];
    }
}
/**
 * Create React plugin
 */
function createReactPlugin(options = {}) {
    try {
        // Try to dynamically import the React plugin
        const reactPlugin = tryImportPlugin('@vitejs/plugin-react');
        if (reactPlugin) {
            return [reactPlugin(options)];
        }
        console.warn('[vite-enhance] React plugin not found. Please install @vitejs/plugin-react');
        return [];
    }
    catch (error) {
        console.warn('[vite-enhance] React plugin not found. Please install @vitejs/plugin-react');
        console.warn('Error:', error?.message || 'Unknown error');
        return [];
    }
}
/**
 * Create CDN plugin
 */
function createCDNPlugin(options) {
    try {
        // Try to import vite-plugin-cdn-import
        const cdnPlugin = tryImportPlugin('vite-plugin-cdn-import');
        if (cdnPlugin) {
            return [cdnPlugin(options)];
        }
        // Try alternative CDN plugins
        const cdnPlugin2 = tryImportPlugin('vite-plugin-externals');
        if (cdnPlugin2) {
            return [cdnPlugin2(options)];
        }
        console.warn('[vite-enhance] CDN plugin not found. Please install vite-plugin-cdn-import or vite-plugin-externals');
        return [];
    }
    catch (error) {
        console.warn('[vite-enhance] CDN plugin not available:', error?.message || 'Unknown error');
        return [];
    }
}
/**
 * Create Cache plugin
 */
function createCachePlugin(options) {
    try {
        // Try to import cache-related plugins
        const cachePlugin = tryImportPlugin('vite-plugin-cache');
        if (cachePlugin) {
            return [cachePlugin(options)];
        }
        // Try alternative cache plugins
        const cachePlugin2 = tryImportPlugin('vite-plugin-build-cache');
        if (cachePlugin2) {
            return [cachePlugin2(options)];
        }
        console.warn('[vite-enhance] Cache plugin not found. Please install vite-plugin-cache or vite-plugin-build-cache');
        return [];
    }
    catch (error) {
        console.warn('[vite-enhance] Cache plugin not available:', error?.message || 'Unknown error');
        return [];
    }
}
/**
 * Create Analyze plugin
 */
function createAnalyzePlugin(options) {
    try {
        // Try to import rollup-plugin-visualizer
        const analyzePlugin = tryImportPlugin('rollup-plugin-visualizer');
        if (analyzePlugin) {
            return [analyzePlugin(options)];
        }
        // Try alternative analyze plugins
        const analyzePlugin2 = tryImportPlugin('vite-bundle-analyzer');
        if (analyzePlugin2) {
            return [analyzePlugin2(options)];
        }
        console.warn('[vite-enhance] Analyze plugin not found. Please install rollup-plugin-visualizer or vite-bundle-analyzer');
        return [];
    }
    catch (error) {
        console.warn('[vite-enhance] Analyze plugin not available:', error?.message || 'Unknown error');
        return [];
    }
}
/**
 * Create PWA plugin
 */
function createPWAPlugin(options) {
    try {
        // Try to import vite-plugin-pwa
        const pwaPlugin = tryImportPlugin('vite-plugin-pwa');
        if (pwaPlugin) {
            return [pwaPlugin(options)];
        }
        console.warn('[vite-enhance] PWA plugin not found. Please install vite-plugin-pwa');
        return [];
    }
    catch (error) {
        console.warn('[vite-enhance] PWA plugin not available:', error?.message || 'Unknown error');
        return [];
    }
}
/**
 * Try to dynamically import a plugin
 */
function tryImportPlugin(packageName) {
    try {
        // In Node.js environment, use require for synchronous loading
        if (typeof require !== 'undefined') {
            return require(packageName);
        }
        // For ESM environments, we need to handle this differently
        // This is a limitation - dynamic imports are async but Vite config needs sync
        console.warn(`[vite-enhance] Cannot dynamically import ${packageName} in ESM environment`);
        return null;
    }
    catch (error) {
        // Plugin not installed or not available
        return null;
    }
}
//# sourceMappingURL=vite-integration.js.map
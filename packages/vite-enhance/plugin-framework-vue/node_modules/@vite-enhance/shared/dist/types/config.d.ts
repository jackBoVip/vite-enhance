import type { UserConfig as ViteUserConfig } from 'vite';
import type { EnhancePlugin, ProjectType, FrameworkType } from './plugin.js';
export interface EnhanceFeatureConfig {
    preset?: 'app' | 'lib' | PresetConfig;
    vue?: VuePluginOptions | boolean;
    react?: ReactPluginOptions | boolean;
    cdn?: CDNOptions | boolean;
    cache?: CacheOptions | boolean;
    analyze?: AnalyzeOptions | boolean;
    pwa?: PWAOptions | boolean;
}
export interface EnhanceConfig {
    enhance?: EnhanceFeatureConfig;
    vite?: ViteUserConfig;
    plugins?: any[];
    preset?: 'app' | 'lib' | PresetConfig;
    vue?: VuePluginOptions | boolean;
    react?: ReactPluginOptions | boolean;
    cdn?: CDNOptions | boolean;
    cache?: CacheOptions | boolean;
    analyze?: AnalyzeOptions | boolean;
    pwa?: PWAOptions | boolean;
}
export interface ResolvedEnhanceConfig extends EnhanceConfig {
    root: string;
    mode: string;
    command: 'serve' | 'build';
    projectType: ProjectType;
    framework: FrameworkType;
    plugins: EnhancePlugin[];
}
export interface PresetConfig {
    name: string;
    options?: Record<string, unknown>;
}
export interface VuePluginOptions {
    script?: {
        defineModel?: boolean;
        propsDestructure?: boolean;
        hoistStatic?: boolean;
    };
    template?: {
        compilerOptions?: Record<string, any>;
    };
    style?: {
        filename?: string;
    };
    devtools?: {
        enabled?: boolean;
        launchEditor?: string;
        componentInspector?: boolean;
        appendTo?: string | RegExp;
    };
}
export interface ReactPluginOptions {
    fastRefresh?: boolean;
    jsxRuntime?: 'automatic' | 'classic';
    jsxImportSource?: string;
    babel?: {
        plugins?: any[];
        presets?: any[];
    };
    include?: RegExp;
    exclude?: RegExp;
}
export interface CDNOptions {
    modules?: string[];
    prodUrl?: string;
    enableInDevMode?: boolean;
    autoDetect?: boolean;
    autoDetectDeps?: 'dependencies' | 'all' | 'production';
    autoDetectExclude?: string[];
    autoDetectInclude?: string[];
    provider?: 'unpkg' | 'jsdelivr' | 'cdnjs';
    customProdUrl?: string;
    generateScriptTag?: (name: string, scriptUrl: string) => Record<string, any>;
    generateCssLinkTag?: (name: string, cssUrl: string) => Record<string, any>;
}
export interface CacheOptions {
    cacheDir?: string;
    include?: string[];
    exclude?: string[];
    strategy?: {
        hashAlgorithm?: 'md5' | 'sha1' | 'sha256';
        invalidateOn?: string[];
        maxSize?: number;
        maxAge?: number;
    };
}
export interface AnalyzeOptions {
    enabled?: boolean;
    open?: boolean;
    filename?: string;
    template?: 'treemap' | 'sunburst' | 'network';
    gzipSize?: boolean;
    brotliSize?: boolean;
    sourcemap?: boolean;
    exclude?: (string | RegExp)[];
}
export interface PWAOptions {
    registerType?: 'prompt' | 'autoUpdate';
    workbox?: {
        globPatterns?: string[];
        runtimeCaching?: any[];
        skipWaiting?: boolean;
        clientsClaim?: boolean;
    };
    manifest?: {
        name?: string;
        short_name?: string;
        description?: string;
        theme_color?: string;
        background_color?: string;
        display?: string;
        orientation?: string;
        scope?: string;
        start_url?: string;
        icons?: Array<{
            src: string;
            sizes: string;
            type: string;
            purpose?: string;
        }>;
        shortcuts?: Array<{
            name: string;
            short_name?: string;
            description?: string;
            url: string;
            icons?: Array<{
                src: string;
                sizes: string;
            }>;
        }>;
    };
    devOptions?: {
        enabled?: boolean;
        type?: string;
    };
}
//# sourceMappingURL=config.d.ts.map
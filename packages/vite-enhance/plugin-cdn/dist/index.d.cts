import { EnhancePlugin } from '@vite-enhance/shared';

interface CDNModule {
    name: string;
    var: string;
    path: string | string[];
    alias?: string[];
    css?: string | string[];
    prodUrl?: string;
}
interface CreateCDNPluginOptions {
    modules?: string[];
    prodUrl?: string;
    enableInDevMode?: boolean;
    autoDetect?: boolean;
    autoDetectDeps?: 'dependencies' | 'all' | 'production';
    autoDetectExclude?: string[];
    autoDetectInclude?: string[];
    cdnProvider?: 'unpkg' | 'jsdelivr' | 'cdnjs' | 'custom';
    customProdUrl?: string;
    generateScriptTag?: (name: string, scriptUrl: string) => Record<string, any>;
    generateCssLinkTag?: (name: string, cssUrl: string) => Record<string, any>;
}
/**
 * Enhanced CDN plugin with auto-detection capabilities
 * 增强的 CDN 插件，支持自动检测依赖
 */
declare function createCDNPlugin(options?: CreateCDNPluginOptions): EnhancePlugin;

export { type CDNModule, type CreateCDNPluginOptions, createCDNPlugin, createCDNPlugin as default };

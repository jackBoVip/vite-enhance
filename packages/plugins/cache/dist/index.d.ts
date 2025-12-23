import { CacheOptions, EnhancePlugin } from '@vite-enhance/shared';

interface CreateCachePluginOptions extends CacheOptions {
}
/**
 * High-performance cache plugin with intelligent invalidation
 */
declare function createCachePlugin(options?: CreateCachePluginOptions | null): EnhancePlugin;

export { type CreateCachePluginOptions, createCachePlugin, createCachePlugin as default };

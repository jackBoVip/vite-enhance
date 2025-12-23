import { ReactPluginOptions, EnhancePlugin } from '@vite-enhance/shared';

interface CreateReactPluginOptions extends ReactPluginOptions {
}
/**
 * Creates a React framework plugin for Vite Enhance Kit
 * Integrates @vitejs/plugin-react with Fast Refresh support
 */
declare function createReactPlugin(_options?: CreateReactPluginOptions | null): EnhancePlugin;

export { type CreateReactPluginOptions, createReactPlugin, createReactPlugin as default };

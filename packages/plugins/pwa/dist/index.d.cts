import { PWAOptions, EnhancePlugin } from '@vite-enhance/shared';

interface CreatePWAPluginOptions extends PWAOptions {
}
/**
 * Creates a PWA plugin for Vite Enhance Kit
 * Integrates vite-plugin-pwa for Progressive Web App functionality
 */
declare function createPWAPlugin(options?: CreatePWAPluginOptions | null): EnhancePlugin;

export { type CreatePWAPluginOptions, createPWAPlugin, createPWAPlugin as default };

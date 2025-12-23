import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, PWAOptions } from '@vite-enhance/shared';

export interface CreatePWAPluginOptions extends PWAOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Creates a PWA plugin for Vite Enhance Kit
 * Integrates vite-plugin-pwa for Progressive Web App functionality
 */
export function createPWAPlugin(options: CreatePWAPluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options || {};
  const {
    manifest = {},
    workbox = {},
  } = safeOptions;

  return {
    name: 'enhance:pwa',
    version: '0.1.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      const pwaPlugins = VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          ...workbox,
        },
        manifest: {
          name: 'Vite Enhance App',
          short_name: 'ViteEnhance',
          description: 'A Vite Enhanced Application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          ...manifest,
        } as any,
      });
      return Array.isArray(pwaPlugins) ? pwaPlugins : [pwaPlugins];
    },
    
    configResolved(_config) {
      console.log('[vek:pwa] PWA plugin initialized');
      console.log('[vek:pwa] Service worker will be generated for production builds');
    },
  };
}

export default createPWAPlugin;
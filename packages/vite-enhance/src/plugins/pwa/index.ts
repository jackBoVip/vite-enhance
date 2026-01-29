import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, PWAOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';
import { tryImportPlugin } from '../../config/plugin-factory.js';

const logger = createLogger('pwa');

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
    registerType = 'autoUpdate',
    manifest = {},
    workbox = {},
    devOptions,
  } = safeOptions;

  return {
    name: 'enhance:pwa',
    version: '0.2.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      const VitePWA = tryImportPlugin('vite-plugin-pwa');
      
      if (!VitePWA || typeof VitePWA !== 'function') {
        logger.warn('vite-plugin-pwa not found. Please install it for PWA support.');
        return [];
      }

      const pwaPlugins = VitePWA({
        registerType,
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          ...workbox,
        },
        manifest: {
          name: 'Vite Enhance App',
          short_name: 'ViteEnhance',
          description: 'A Vite Enhanced Application',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          ...manifest,
        },
        devOptions,
      });
      
      return Array.isArray(pwaPlugins) ? pwaPlugins : [pwaPlugins];
    },
    
    configResolved() {
      logger.info('PWA plugin initialized');
      logger.info('Service worker will be generated for production builds');
    },
  };
}

export default createPWAPlugin;

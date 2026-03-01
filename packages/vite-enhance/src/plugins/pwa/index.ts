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

      const pwaFactory = resolvePWAFactory(VitePWA);
      if (!pwaFactory) {
        logger.warn('vite-plugin-pwa not found or has no callable export. Please install it for PWA support.');
        return [];
      }

      const pwaPlugins = pwaFactory({
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

function resolvePWAFactory(
  plugin: unknown
): ((opts: unknown) => VitePlugin | VitePlugin[]) | null {
  if (typeof plugin === 'function') {
    return plugin as (opts: unknown) => VitePlugin | VitePlugin[];
  }

  if (plugin && typeof plugin === 'object') {
    const namedExport = (plugin as Record<string, unknown>).VitePWA;
    if (typeof namedExport === 'function') {
      return namedExport as (opts: unknown) => VitePlugin | VitePlugin[];
    }
  }

  return null;
}

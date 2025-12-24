import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, ReactPluginOptions } from '../../shared';

export interface CreateReactPluginOptions extends ReactPluginOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Creates a React framework plugin for Vite Enhance Kit
 * Integrates @vitejs/plugin-react with Fast Refresh support
 */
export function createReactPlugin(_options: CreateReactPluginOptions | null = {}): EnhancePlugin {
  return {
    name: 'enhance:framework-react',
    version: '0.1.0',
    enforce: 'pre',
    apply: 'both',
    
    vitePlugin(): VitePlugin[] {
      // Dynamically import @vitejs/plugin-react to avoid bundling it
      const reactPlugin = require('@vitejs/plugin-react');
      const reactPlugins = reactPlugin.default({
        // @vitejs/plugin-react options
        // fastRefresh is enabled by default in development
      });
      return Array.isArray(reactPlugins) ? reactPlugins : [reactPlugins];
    },
    
    configResolved(config) {
      // Log React plugin configuration
      if (config.framework === 'react') {
        console.log('[vek:react] React framework plugin initialized');
        console.log('[vek:react] Fast Refresh enabled by default in development');
      }
    },
  };
}

export default createReactPlugin;
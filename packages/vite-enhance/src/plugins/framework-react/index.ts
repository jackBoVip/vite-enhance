import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, ReactPluginOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';
import { tryImportPlugin } from '../../config/plugin-factory.js';

const logger = createLogger('react');

export interface CreateReactPluginOptions extends ReactPluginOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Creates a React framework plugin for Vite Enhance Kit
 * Integrates @vitejs/plugin-react with Fast Refresh support
 */
export function createReactPlugin(options: CreateReactPluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options || {};
  const {
    fastRefresh,
    jsxRuntime,
    jsxImportSource,
    babel,
    include,
    exclude,
  } = safeOptions;

  return {
    name: 'enhance:framework-react',
    version: '0.2.0',
    enforce: 'pre',
    apply: 'both',
    
    vitePlugin(): VitePlugin[] {
      const reactPlugin = tryImportPlugin('@vitejs/plugin-react');
      
      if (!reactPlugin || typeof reactPlugin !== 'function') {
        logger.warn('React plugin not found. Please install @vitejs/plugin-react');
        return [];
      }

      const reactOptions: Record<string, unknown> = {};
      
      if (fastRefresh !== undefined) reactOptions.fastRefresh = fastRefresh;
      if (jsxRuntime) reactOptions.jsxRuntime = jsxRuntime;
      if (jsxImportSource) reactOptions.jsxImportSource = jsxImportSource;
      if (babel) reactOptions.babel = babel;
      if (include) reactOptions.include = include;
      if (exclude) reactOptions.exclude = exclude;

      const result = reactPlugin(reactOptions);
      return Array.isArray(result) ? result : [result as VitePlugin];
    },
    
    configResolved() {
      logger.info('React framework plugin initialized');
      logger.info('Fast Refresh enabled by default in development');
    },
  };
}

export default createReactPlugin;

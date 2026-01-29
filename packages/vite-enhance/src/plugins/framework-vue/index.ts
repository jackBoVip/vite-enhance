import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, VuePluginOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';
import { tryImportPlugin } from '../../config/plugin-factory.js';

const logger = createLogger('vue');

export interface CreateVuePluginOptions extends VuePluginOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Creates a Vue framework plugin for Vite Enhance Kit
 * Integrates @vitejs/plugin-vue with Vue 3 SFC compilation support
 */
export function createVuePlugin(options: CreateVuePluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options || {};
  const {
    script,
    template,
    style,
    devtools = { enabled: true, componentInspector: true },
  } = safeOptions;

  return {
    name: 'enhance:framework-vue',
    version: '0.3.0',
    enforce: 'pre',
    apply: 'both',
    
    vitePlugin(): VitePlugin[] {
      const plugins: VitePlugin[] = [];
      
      // Vue plugin
      const vuePlugin = tryImportPlugin('@vitejs/plugin-vue');
      if (vuePlugin && typeof vuePlugin === 'function') {
        const vueOptions: Record<string, unknown> = {};
        
        if (script) {
          vueOptions.script = {
            defineModel: script.defineModel ?? true,
            propsDestructure: script.propsDestructure,
            hoistStatic: script.hoistStatic,
          };
        } else {
          vueOptions.script = { defineModel: true };
        }
        
        if (template) vueOptions.template = template;
        if (style) vueOptions.style = style;
        
        const result = vuePlugin(vueOptions);
        if (Array.isArray(result)) {
          plugins.push(...result);
        } else {
          plugins.push(result as VitePlugin);
        }
      } else {
        logger.warn('Vue plugin not found. Please install @vitejs/plugin-vue');
      }
      
      // Vue DevTools plugin (development only)
      if (devtools && devtools.enabled !== false) {
        const VueDevTools = tryImportPlugin('vite-plugin-vue-devtools');
        if (VueDevTools && typeof VueDevTools === 'function') {
          try {
            const devToolsOptions: Record<string, unknown> = {};
            
            if (devtools.launchEditor) {
              devToolsOptions.launchEditor = devtools.launchEditor;
            }
            if (devtools.componentInspector !== undefined) {
              devToolsOptions.componentInspector = devtools.componentInspector;
            }
            if (devtools.appendTo) {
              devToolsOptions.appendTo = devtools.appendTo;
            }
            
            const devToolsPlugin = VueDevTools(devToolsOptions);
            if (devToolsPlugin) {
              plugins.push(devToolsPlugin as VitePlugin);
            }
          } catch (error) {
            logger.debug('Vue DevTools initialization failed:', error);
          }
        }
      }
      
      return plugins;
    },
    
    configResolved() {
      logger.info('Vue framework plugin initialized');
      if (devtools && devtools.enabled !== false) {
        logger.info('Vue DevTools enabled');
      }
    },
  };
}

export default createVuePlugin;

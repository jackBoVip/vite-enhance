import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, VuePluginOptions } from '@vite-enhance/shared';

export interface CreateVuePluginOptions extends VuePluginOptions {
  // Additional options specific to the enhance plugin
  
  // Vue DevTools options
  devtools?: {
    enabled?: boolean; // 是否启用 Vue DevTools
    launchEditor?: 'appcode' | 'atom' | 'atom-beta' | 'brackets' | 'clion' | 'code' | 'code-insiders' | 'codium' | 'emacs' | 'idea' | 'notepad++' | 'pycharm' | 'phpstorm' | 'rubymine' | 'sublime' | 'vim' | 'visualstudio' | 'webstorm' | 'rider' | string;
    componentInspector?: boolean; // 组件检查器
    appendTo?: string | RegExp; // 追加到模块
  };
}

/**
 * Creates a Vue framework plugin for Vite Enhance Kit
 * Integrates @vitejs/plugin-vue with Vue 3 SFC compilation support and Vue DevTools
 */
export function createVuePlugin(options: CreateVuePluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options || {};
  const {
    devtools = {
      enabled: true,
      componentInspector: true
    }
  } = safeOptions;

  return {
    name: 'enhance:framework-vue',
    version: '0.2.0',
    enforce: 'pre',
    apply: 'both',
    
    vitePlugin(): VitePlugin[] {
      const plugins: VitePlugin[] = [];
      
      // Dynamically import Vue plugin to avoid bundling it
      const vuePlugin = require('@vitejs/plugin-vue');
      const vuePlugins = vuePlugin.default({
        script: {
          defineModel: true,
        }
      });
      
      if (Array.isArray(vuePlugins)) {
        plugins.push(...vuePlugins);
      } else {
        plugins.push(vuePlugins);
      }
      
      // Vue DevTools 插件 (仅在开发模式下启用)
      if (devtools.enabled !== false) {
        try {
          const VueDevTools = require('vite-plugin-vue-devtools');
          const devToolsOptions: any = {};
          
          if (devtools.launchEditor) {
            devToolsOptions.launchEditor = devtools.launchEditor;
          }
          
          if (devtools.componentInspector !== undefined) {
            devToolsOptions.componentInspector = devtools.componentInspector;
          }
          
          if (devtools.appendTo) {
            devToolsOptions.appendTo = devtools.appendTo;
          }
          
          const devToolsPlugin = VueDevTools.default(devToolsOptions);
          if (devToolsPlugin) {
            plugins.push(devToolsPlugin as VitePlugin);
          }
        } catch (error) {
          console.warn('[vek:vue] Vue DevTools not available:', error);
        }
      }
      
      return plugins;
    },
    
    configResolved() {
      // Log Vue plugin configuration
      console.log('[vek:vue] Vue framework plugin initialized');
      
      if (devtools.enabled !== false) {
        console.log('[vek:vue] Vue DevTools enabled');
        if (devtools.componentInspector) {
          console.log('[vek:vue] Component Inspector enabled');
        }
        if (devtools.launchEditor) {
          console.log(`[vek:vue] Launch Editor: ${devtools.launchEditor}`);
        }
      } else {
        console.log('[vek:vue] Vue DevTools disabled');
      }
    },
  };
}

export default createVuePlugin;
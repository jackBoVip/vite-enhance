import { VuePluginOptions, EnhancePlugin } from '@vite-enhance/shared';

interface CreateVuePluginOptions extends VuePluginOptions {
    devtools?: {
        enabled?: boolean;
        launchEditor?: 'appcode' | 'atom' | 'atom-beta' | 'brackets' | 'clion' | 'code' | 'code-insiders' | 'codium' | 'emacs' | 'idea' | 'notepad++' | 'pycharm' | 'phpstorm' | 'rubymine' | 'sublime' | 'vim' | 'visualstudio' | 'webstorm' | 'rider' | string;
        componentInspector?: boolean;
        appendTo?: string | RegExp;
    };
}
/**
 * Creates a Vue framework plugin for Vite Enhance Kit
 * Integrates @vitejs/plugin-vue with Vue 3 SFC compilation support and Vue DevTools
 */
declare function createVuePlugin(options?: CreateVuePluginOptions | null): EnhancePlugin;

export { type CreateVuePluginOptions, createVuePlugin, createVuePlugin as default };

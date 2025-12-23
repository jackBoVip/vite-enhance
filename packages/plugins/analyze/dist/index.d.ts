import { AnalyzeOptions, EnhancePlugin } from '@vite-enhance/shared';

interface CreateAnalyzePluginOptions extends AnalyzeOptions {
}
/**
 * Creates an analyze plugin for Vite Enhance Kit
 * Integrates rollup-plugin-visualizer for bundle analysis
 */
declare function createAnalyzePlugin(options?: CreateAnalyzePluginOptions | null): EnhancePlugin;

export { type CreateAnalyzePluginOptions, createAnalyzePlugin, createAnalyzePlugin as default };

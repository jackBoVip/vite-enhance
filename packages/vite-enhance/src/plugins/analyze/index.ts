import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, AnalyzeOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';
import { tryImportPlugin } from '../../config/plugin-factory.js';

const logger = createLogger('analyze');

export interface CreateAnalyzePluginOptions extends AnalyzeOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Creates an analyze plugin for Vite Enhance Kit
 * Integrates rollup-plugin-visualizer for bundle analysis
 */
export function createAnalyzePlugin(options: CreateAnalyzePluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options || {};
  const {
    open = true,
    filename = 'dist/stats.html',
    template = 'treemap',
    gzipSize = true,
    brotliSize = true,
  } = safeOptions;

  let buildStartTime: number;
  const pluginTimings: Record<string, number> = {};

  return {
    name: 'enhance:analyze',
    version: '0.2.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      const visualizer = tryImportPlugin('rollup-plugin-visualizer');
      
      if (!visualizer || typeof visualizer !== 'function') {
        logger.warn('rollup-plugin-visualizer not found. Please install it for bundle analysis.');
        return [];
      }

      return [
        // Bundle visualizer plugin
        visualizer({
          filename,
          open,
          gzipSize,
          brotliSize,
          template,
        }) as VitePlugin,
        
        // Plugin timing analysis
        {
          name: 'vite:enhance-analyze-timing',
          apply: 'build',
          
          configResolved() {
            buildStartTime = Date.now();
            logger.info('Build timing analysis started');
          },
          
          buildStart() {
            pluginTimings['buildStart'] = Date.now() - buildStartTime;
          },
          
          generateBundle() {
            pluginTimings['generateBundle'] = Date.now() - buildStartTime;
          },
          
          writeBundle() {
            const currentTime = Date.now();
            pluginTimings['writeBundle'] = currentTime - buildStartTime;
            
            logger.info('Build Timing Analysis:');
            for (const [phase, time] of Object.entries(pluginTimings)) {
              console.log(`  ${phase.padEnd(20)}: ${time}ms`);
            }
            logger.success(`Total build time: ${currentTime - buildStartTime}ms`);
          },
        },
      ];
    },
    
    buildStart() {
      logger.info(`Bundle analysis enabled (output: ${filename})`);
    },
    
    buildEnd(context) {
      if (context.endTime && context.startTime) {
        const duration = context.endTime - context.startTime;
        logger.success(`Bundle analysis completed in ${duration}ms`);
      }
    },
    
    configResolved() {
      logger.info('Bundle analysis plugin initialized');
    },
  };
}

export default createAnalyzePlugin;

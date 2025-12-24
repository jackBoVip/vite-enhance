import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, AnalyzeOptions } from '../../shared';

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
  } = safeOptions;

  let buildStartTime: number;
  let pluginTimings: Record<string, number> = {};

  return {
    name: 'enhance:analyze',
    version: '0.1.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      return [
        // Bundle visualizer plugin
        visualizer({
          filename,
          open,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap', // 'treemap' | 'sunburst' | 'network'
        }) as VitePlugin,
        
        // Plugin timing analysis
        {
          name: 'vite:enhance-analyze-timing',
          apply: 'build',
          
          configResolved() {
            buildStartTime = Date.now();
            console.log('[vek:analyze] Build timing analysis started');
          },
          
          buildStart() {
            const startTime = Date.now();
            pluginTimings['buildStart'] = startTime - buildStartTime;
          },
          
          generateBundle() {
            const currentTime = Date.now();
            pluginTimings['generateBundle'] = currentTime - buildStartTime;
          },
          
          writeBundle() {
            const currentTime = Date.now();
            pluginTimings['writeBundle'] = currentTime - buildStartTime;
            
            // Output timing analysis
            console.log('\n[vek:analyze] Plugin Timing Analysis:');
            console.log('=====================================');
            Object.entries(pluginTimings).forEach(([phase, time]) => {
              console.log(`${phase.padEnd(20)}: ${time}ms`);
            });
            console.log(`Total build time: ${currentTime - buildStartTime}ms`);
            console.log('=====================================\n');
          },
        },
      ];
    },
    
    buildStart(_context) {
      console.log('[vek:analyze] Bundle analysis started');
      console.log(`[vek:analyze] Output file: ${filename}`);
      if (open) {
        console.log('[vek:analyze] Will open analysis report in browser');
      }
    },
    
    buildEnd(context) {
      const duration = context.endTime! - context.startTime;
      console.log(`[vek:analyze] Bundle analysis completed in ${duration}ms`);
      
      // Generate JSON report for programmatic access
      const jsonFilename = filename.replace('.html', '.json');
      console.log(`[vek:analyze] JSON report available at: ${jsonFilename}`);
    },
    
    configResolved(_config) {
      console.log('[vek:analyze] Bundle analysis plugin initialized');
    },
  };
}

export default createAnalyzePlugin;
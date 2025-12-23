import type { UserConfig as ViteUserConfig } from 'vite';
import type { EnhanceConfig, EnhanceFeatureConfig } from '@vite-enhance/shared';
import { createRequire } from 'module';


/**
 * Convert EnhanceConfig to ViteConfig for direct Vite usage
 */
export function createViteConfig(config: EnhanceConfig): ViteUserConfig {
  // Normalize config to handle both new and legacy structures
  const normalizedConfig = normalizeConfig(config);
  
  const viteConfig: ViteUserConfig = {
    ...config.vite,
    plugins: [
      ...(config.vite?.plugins || []),
      ...(config.plugins || []),
      ...createEnhancePlugins(normalizedConfig),
    ],
  };

  return viteConfig;
}

/**
 * Normalize config to handle both new nested and legacy flat structures
 */
function normalizeConfig(config: EnhanceConfig): EnhanceFeatureConfig {
  // If using new nested structure, use it directly
  if (config.enhance) {
    let normalized = { ...config.enhance };
    
    // Auto-detect preset if not explicitly provided
    if (normalized.preset === undefined) {
      normalized.preset = detectPreset();
    }
    
    return normalized;
  }
  
  // Otherwise, convert legacy flat structure to nested structure
  const normalized: EnhanceFeatureConfig = {};
  
  if (config.preset !== undefined) normalized.preset = config.preset;
  if (config.vue !== undefined) normalized.vue = config.vue;
  if (config.react !== undefined) normalized.react = config.react;
  if (config.cdn !== undefined) normalized.cdn = config.cdn;
  if (config.cache !== undefined) normalized.cache = config.cache;
  if (config.analyze !== undefined) normalized.analyze = config.analyze;
  if (config.pwa !== undefined) normalized.pwa = config.pwa;
  
  // Auto-detect preset if not explicitly provided
  if (normalized.preset === undefined) {
    normalized.preset = detectPreset();
  }
  
  return normalized;
}

/**
 * Create Vite plugins from normalized EnhanceConfig
 */
function createEnhancePlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // Add preset plugins
  if (config.preset) {
    plugins.push(...createPresetPlugins(config.preset, config));
  }

  return plugins;
}

/**
 * Create plugins for a preset
 */
function createPresetPlugins(preset: string | { name: string; options?: Record<string, unknown> }, config: EnhanceFeatureConfig): any[] {
  const presetName = typeof preset === 'string' ? preset : preset.name;
  const plugins: any[] = [];

  switch (presetName) {
    case 'app':
      // Add framework plugins
      plugins.push(...createFrameworkPlugins(config));
      // Add feature plugins
      plugins.push(...createFeaturePlugins(config));
      break;

    case 'lib':
      // Add framework plugins for library
      plugins.push(...createFrameworkPlugins(config));
      // Libraries typically don't need CDN, PWA, etc.
      break;
  }

  return plugins;
}

/**
 * Create framework-specific plugins
 */
function createFrameworkPlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // Vue plugin
  if (config.vue !== false) {
    const framework = detectFramework(config);
    if (framework === 'vue' || config.vue) {
      plugins.push(...createVuePlugin(config.vue));
    }
  }

  // React plugin
  if (config.react !== false) {
    const framework = detectFramework(config);
    if (framework === 'react' || config.react) {
      plugins.push(...createReactPlugin(config.react));
    }
  }
  
  // Svelte plugin
  if (config.svelte !== false) {
    const framework = detectFramework(config);
    if (framework === 'svelte' || config.svelte) {
      plugins.push(...createSveltePlugin(config.svelte));
    }
  }
  
  // Solid plugin
  if (config.solid !== false) {
    const framework = detectFramework(config);
    if (framework === 'solid' || config.solid) {
      plugins.push(...createSolidPlugin(config.solid));
    }
  }
  
  // Lit plugin
  if (config.lit !== false) {
    const framework = detectFramework(config);
    if (framework === 'lit' || config.lit) {
      plugins.push(...createLitPlugin(config.lit));
    }
  }
  
  // Preact plugin
  if (config.preact !== false) {
    const framework = detectFramework(config);
    if (framework === 'preact' || config.preact) {
      plugins.push(...createPreactPlugin(config.preact));
    }
  }

  return plugins;
}

/**
 * Create feature plugins
 */
function createFeaturePlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // CDN plugin
  if (config.cdn !== false) {
    plugins.push(...createCDNPlugin(config.cdn));
  }

  // Cache plugin
  if (config.cache !== false) {
    plugins.push(...createCachePlugin(config.cache));
  }

  // Analyze plugin
  if (config.analyze) {
    plugins.push(...createAnalyzePlugin(config.analyze));
  }

  // PWA plugin
  if (config.pwa) {
    plugins.push(...createPWAPlugin(config.pwa));
  }

  return plugins;
}

/**
 * Detect framework from config or dependencies
 */
function detectFramework(config: EnhanceFeatureConfig): 'vue' | 'react' | 'svelte' | 'solid' | 'lit' | 'preact' | 'none' {
  // Check explicit framework config
  if (config.vue) return 'vue';
  if (config.react) return 'react';

  // Try to detect from package.json dependencies
  try {
    const fs = require('fs');
    const path = require('path');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
      };

      // Vue detection
      if (allDeps.vue || allDeps['@vue/core']) return 'vue';
      
      // React detection
      if (allDeps.react || allDeps['react-dom']) return 'react';
      
      // Svelte detection
      if (allDeps.svelte || allDeps['@sveltejs/vite-plugin-svelte']) return 'svelte';
      
      // Solid detection
      if (allDeps['solid-js'] || allDeps['@solidjs/vite-plugin-solid']) return 'solid';
      
      // Lit detection
      if (allDeps['lit-element'] || allDeps['lit-html'] || allDeps['lit'] || allDeps['@lit-labs/vite-plugin']) return 'lit';
      
      // Preact detection
      if (allDeps.preact || allDeps['@preact/preset-vite']) return 'preact';
    }
  } catch {
    // Ignore errors in detection
  }

  return 'none';
}

/**
 * Detect project preset (app or lib) from package.json and project structure
 */
function detectPreset(): 'app' | 'lib' {
  try {
    const fs = require('fs');
    const path = require('path');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Check for library-specific indicators
      // Libraries typically have build configuration for multiple formats
      if (
        packageJson.main || // CommonJS entry
        packageJson.module || // ES Module entry
        packageJson.types || // TypeScript declaration
        packageJson.typings || // TypeScript declaration
        (packageJson.exports && // Multiple export points
          (typeof packageJson.exports === 'object' || 
           (typeof packageJson.exports === 'string' && packageJson.exports.includes('dist/')))
        )
      ) {
        // Additional checks to differentiate from apps that might have these fields
        const scripts = packageJson.scripts || {};
        
        // Check for library-specific scripts
        const libScripts = ['build:lib', 'build:esm', 'build:cjs', 'build:umd', 'build:iife', 'prebuild', 'postbuild'];
        for (const script of libScripts) {
          if (scripts[script]) {
            return 'lib';
          }
        }
        
        // Check for library-specific dependencies
        const libDeps = ['rollup', '@rollup', 'vite-plugin-dts', 'unbuild', '@microsoft/api-extractor'];
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
          ...packageJson.peerDependencies,
        };
        
        for (const dep of libDeps) {
          if (allDeps[dep] || Object.keys(allDeps).some(d => d.startsWith(dep))) {
            return 'lib';
          }
        }
        
        // If it has main/module/types but no library-specific scripts/dependencies,
        // check if it's more likely a library by looking for build output patterns
        if (packageJson.main && (packageJson.main.includes('dist/') || packageJson.main.includes('lib/') || packageJson.main.includes('es/'))) {
          return 'lib';
        }
        
        if (packageJson.module && (packageJson.module.includes('dist/') || packageJson.module.includes('es/'))) {
          return 'lib';
        }
      }
      
      // Check for app-specific indicators
      // Apps typically have dev/build/start scripts
      const appScripts = ['dev', 'start', 'serve', 'preview'];
      const scripts = packageJson.scripts || {};
      for (const script of appScripts) {
        if (scripts[script]) {
          // Check if it doesn't have library characteristics
          if (!packageJson.main || !packageJson.main.includes('dist/')) {
            return 'app';
          }
        }
      }
      
      // Additional check: if it has a browser field or a "build" script that suggests app building
      if (packageJson.browser && typeof packageJson.browser === 'string') {
        // Browser field often indicates an app that targets browsers
        return 'app';
      }
      
      // Check for frontend entry files (HTML) which indicate app projects
      const commonHtmlFiles = [
        'index.html',
        'public/index.html',
        'src/index.html',
        'index.htm',
        'public/index.htm',
        'src/index.htm'
      ];
      
      for (const htmlFile of commonHtmlFiles) {
        const htmlPath = path.join(process.cwd(), htmlFile);
        if (fs.existsSync(htmlPath)) {
          // Read the HTML file to check for framework-specific indicators
          try {
            const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
            
            // Look for framework-specific indicators in the HTML
            if (
              htmlContent.includes('id="app"') ||
              htmlContent.includes('id="root"') ||
              htmlContent.includes('div id=') && (htmlContent.includes('app') || htmlContent.includes('root')) ||
              htmlContent.includes('data-') && htmlContent.includes('app') ||
              htmlContent.includes('mount')
            ) {
              return 'app';
            }
          } catch {
            // If there's an error reading the HTML file, continue checking
          }
        }
      }
      
      // Additional check: Look for common app directories
      const appDirs = ['public', 'assets', 'static'];
      for (const dir of appDirs) {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
          return 'app';
        }
      }
    }
  } catch {
    // If there's an error in detection, default to 'app'
  }
  
  // Default to 'app' if no clear indicators found
  return 'app';
}

/**
 * Create Vue plugin
 */
function createVuePlugin(options: any = {}): any[] {
  try {
    // Try to dynamically import the Vue plugin
    const vuePlugin = tryImportPlugin('@vitejs/plugin-vue');
    if (vuePlugin) {
      return [vuePlugin(options)];
    }
    
    console.warn('[vite-enhance] Vue plugin not found. Please install @vitejs/plugin-vue');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Vue plugin not found. Please install @vitejs/plugin-vue');
    console.warn('Error:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create React plugin
 */
function createReactPlugin(options: any = {}): any[] {
  try {
    // Try to dynamically import the React plugin
    const reactPlugin = tryImportPlugin('@vitejs/plugin-react');
    if (reactPlugin) {
      return [reactPlugin(options)];
    }
    
    console.warn('[vite-enhance] React plugin not found. Please install @vitejs/plugin-react');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] React plugin not found. Please install @vitejs/plugin-react');
    console.warn('Error:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create CDN plugin
 */
function createCDNPlugin(options: any): any[] {
  try {
    // Try to import vite-plugin-cdn-import
    const cdnPlugin = tryImportPlugin('vite-plugin-cdn-import');
    if (cdnPlugin) {
      return [cdnPlugin(options)];
    }
    
    // Try alternative CDN plugins
    const cdnPlugin2 = tryImportPlugin('vite-plugin-externals');
    if (cdnPlugin2) {
      return [cdnPlugin2(options)];
    }
    
    console.warn('[vite-enhance] CDN plugin not found. Please install vite-plugin-cdn-import or vite-plugin-externals');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] CDN plugin not available:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create Cache plugin
 */
function createCachePlugin(options: any): any[] {
  try {
    // Try to import cache-related plugins
    const cachePlugin = tryImportPlugin('vite-plugin-cache');
    if (cachePlugin) {
      return [cachePlugin(options)];
    }
    
    // Try alternative cache plugins
    const cachePlugin2 = tryImportPlugin('vite-plugin-build-cache');
    if (cachePlugin2) {
      return [cachePlugin2(options)];
    }
    
    console.warn('[vite-enhance] Cache plugin not found. Please install vite-plugin-cache or vite-plugin-build-cache');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Cache plugin not available:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create Analyze plugin
 */
function createAnalyzePlugin(options: any): any[] {
  try {
    // Try to import rollup-plugin-visualizer
    const analyzePlugin = tryImportPlugin('rollup-plugin-visualizer');
    if (analyzePlugin) {
      return [analyzePlugin(options)];
    }
    
    // Try alternative analyze plugins
    const analyzePlugin2 = tryImportPlugin('vite-bundle-analyzer');
    if (analyzePlugin2) {
      return [analyzePlugin2(options)];
    }
    
    console.warn('[vite-enhance] Analyze plugin not found. Please install rollup-plugin-visualizer or vite-bundle-analyzer');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Analyze plugin not available:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create PWA plugin
 */
function createPWAPlugin(options: any): any[] {
  try {
    // Try to import vite-plugin-pwa
    const pwaPlugin = tryImportPlugin('vite-plugin-pwa');
    if (pwaPlugin) {
      return [pwaPlugin(options)];
    }
    
    console.warn('[vite-enhance] PWA plugin not found. Please install vite-plugin-pwa');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] PWA plugin not available:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create Svelte plugin
 */
function createSveltePlugin(options: any = {}): any[] {
  try {
    // Try to dynamically import the Svelte plugin
    const sveltePlugin = tryImportPlugin('@sveltejs/vite-plugin-svelte');
    if (sveltePlugin) {
      return [sveltePlugin(options)];
    }
    
    console.warn('[vite-enhance] Svelte plugin not found. Please install @sveltejs/vite-plugin-svelte');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Svelte plugin not found. Please install @sveltejs/vite-plugin-svelte');
    console.warn('Error:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create Solid plugin
 */
function createSolidPlugin(options: any = {}): any[] {
  try {
    // Try to dynamically import the Solid plugin
    const solidPlugin = tryImportPlugin('@solidjs/vite-plugin-solid');
    if (solidPlugin) {
      return [solidPlugin(options)];
    }
    
    console.warn('[vite-enhance] Solid plugin not found. Please install @solidjs/vite-plugin-solid');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Solid plugin not found. Please install @solidjs/vite-plugin-solid');
    console.warn('Error:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create Lit plugin
 */
function createLitPlugin(options: any = {}): any[] {
  try {
    // Try to dynamically import the Lit plugin
    const litPlugin = tryImportPlugin('@lit-labs/vite-plugin');
    if (litPlugin) {
      return [litPlugin(options)];
    }
    
    // Try alternative Lit plugin
    const litPlugin2 = tryImportPlugin('vite-plugin-lit');
    if (litPlugin2) {
      return [litPlugin2(options)];
    }
    
    console.warn('[vite-enhance] Lit plugin not found. Please install @lit-labs/vite-plugin or vite-plugin-lit');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Lit plugin not available:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Create Preact plugin
 */
function createPreactPlugin(options: any = {}): any[] {
  try {
    // Try to dynamically import the Preact plugin
    const preactPlugin = tryImportPlugin('@preact/preset-vite');
    if (preactPlugin) {
      return [preactPlugin(options)];
    }
    
    console.warn('[vite-enhance] Preact plugin not found. Please install @preact/preset-vite');
    return [];
  } catch (error: any) {
    console.warn('[vite-enhance] Preact plugin not found. Please install @preact/preset-vite');
    console.warn('Error:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Try to dynamically import a plugin
 */
function tryImportPlugin(packageName: string): any {
  try {
    // Create a require function for dynamic imports in ESM
    const require = createRequire(import.meta.url);
    return require(packageName);
  } catch (error) {
    // Plugin not installed or not available
    return null;
  }
}
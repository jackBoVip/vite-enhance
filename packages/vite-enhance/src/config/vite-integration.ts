import type { UserConfig as ViteUserConfig } from 'vite';
import type { EnhanceConfig, EnhanceFeatureConfig } from '../shared';
import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';
import { compressPlugin } from '../plugins/compress/index.js';


/**
 * 从包名中移除特殊字符
 */
function sanitizePackageName(name: string): string {
  return name.replace(/[@\/]/g, '-').replace(/[^a-zA-Z0-9\-_.]/g, '');
}

/**
 * 获取包名
 */
function getPackageName(): string {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return sanitizePackageName(packageJson.name || 'package');
    }
  } catch (error) {
    // Ignore errors
  }
  return 'package';
}

/**
 * 获取构建输出目录
 * 库构建直接输出到 dist，应用构建输出到 dist/包名
 */
function getBuildOutDir(preset: string | { name: string; options?: Record<string, unknown> } | undefined): string {
  const presetName = typeof preset === 'string' ? preset : preset?.name;
  
  // 库构建直接输出到 dist 目录
  if (presetName === 'lib') {
    return 'dist';
  }
  
  // 应用构建输出到 dist/包名 目录
  const packageName = getPackageName();
  return `dist/${packageName}`;
}

/**
 * 获取默认的库构建配置
 */
function getDefaultLibConfig() {
  const packageName = getPackageName();
  
  return {
    entry: 'src/index.ts',
    name: packageName,
    formats: ['es', 'cjs'] as const,
    fileName: (format: string) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
  };
}

/**
 * 获取默认的 Rollup 输出配置
 */
function getDefaultRollupOptions() {
  return {
    output: {
      exports: 'named' as const, // 使用命名导出，避免混合导出警告
    }
  };
}

/**
 * Convert EnhanceConfig to ViteConfig for direct Vite usage
 * Only supports the new nested structure
 */
export function createViteConfig(config: EnhanceConfig): ViteUserConfig {
  // Normalize config to handle the new nested structure
  const normalizedConfig = normalizeConfig(config);
  
  // Get output directory based on preset
  const outDir = getBuildOutDir(normalizedConfig.preset);
  
  // 检查是否为库构建
  const isLibBuild = (typeof normalizedConfig.preset === 'string' ? normalizedConfig.preset : normalizedConfig.preset?.name) === 'lib';
  
  // 为库构建提供默认配置
  const buildConfig: any = {
    ...config.vite?.build,
    outDir: config.vite?.build?.outDir || outDir,
  };
  
  // 如果是库构建且用户没有配置 lib，则使用默认配置
  if (isLibBuild) {
    if (!config.vite?.build?.lib) {
      buildConfig.lib = getDefaultLibConfig();
    } else {
      // 用户配置了 lib，合并默认配置（用户配置优先）
      const defaultLib = getDefaultLibConfig();
      buildConfig.lib = {
        ...defaultLib,
        ...config.vite.build.lib,
      };
    }
    
    // 添加默认的 Rollup 配置
    if (!config.vite?.build?.rollupOptions) {
      buildConfig.rollupOptions = getDefaultRollupOptions();
    } else {
      // 合并用户的 rollupOptions
      const defaultRollup = getDefaultRollupOptions();
      buildConfig.rollupOptions = {
        ...defaultRollup,
        ...config.vite.build.rollupOptions,
        output: {
          ...defaultRollup.output,
          ...(config.vite.build.rollupOptions.output || {}),
        }
      };
    }
  }
  
  const viteConfig: ViteUserConfig = {
    ...config.vite,
    build: buildConfig,
    plugins: [
      ...(config.vite?.plugins || []),
      ...(config.plugins || []),
      ...createEnhancePlugins(normalizedConfig),
    ],
  };

  return viteConfig;
}

/**
 * Normalize config to handle the new nested structure
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
  
  // If no nested structure, return an empty config
  return {};
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
      // Add compress plugin for library builds
      if (config.compress !== false) {
        plugins.push(...createCompressPlugin(config.compress));
      }
      // Add analyze plugin if enabled
      if (config.analyze) {
        plugins.push(...createAnalyzePlugin(config.analyze));
      }
      break;
  }

  return plugins;
}

/**
 * Create framework-specific plugins
 */
function createFrameworkPlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];
  
  // Detect framework once
  const detectedFramework = detectFramework(config);

  // Vue plugin
  if (config.vue !== false) {
    if (detectedFramework === 'vue' || config.vue) {
      plugins.push(...createVuePlugin(config.vue));
    }
  }

  // React plugin
  if (config.react !== false) {
    if (detectedFramework === 'react' || config.react) {
      plugins.push(...createReactPlugin(config.react));
    }
  }
  
  // Svelte plugin
  if (config.svelte !== false) {
    if (detectedFramework === 'svelte' || config.svelte) {
      plugins.push(...createSveltePlugin(config.svelte));
    }
  }
  
  // Solid plugin
  if (config.solid !== false) {
    if (detectedFramework === 'solid' || config.solid) {
      plugins.push(...createSolidPlugin(config.solid));
    }
  }
  
  // Lit plugin
  if (config.lit !== false) {
    if (detectedFramework === 'lit' || config.lit) {
      plugins.push(...createLitPlugin(config.lit));
    }
  }
  
  // Preact plugin
  if (config.preact !== false) {
    if (detectedFramework === 'preact' || config.preact) {
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
  
  // Compress plugin
  if (config.compress !== false) {
    plugins.push(...createCompressPlugin(config.compress));
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
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies,
      };

      // Vue detection
      if (allDeps.vue || allDeps['@vue/core']) {
        return 'vue';
      }
      
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
 * Check if a path points to a library output directory
 */
function isLibraryPath(filePath: string): boolean {
  return filePath.includes('dist/') || 
         filePath.includes('lib/') || 
         filePath.includes('es/');
}

/**
 * Check if package.json has strong library indicators
 */
function hasStrongLibraryIndicators(packageJson: any): boolean {
  // Check for library entry points (main/module/types)
  const hasLibraryEntryPoints = (
    (packageJson.main && isLibraryPath(packageJson.main)) ||
    (packageJson.module && isLibraryPath(packageJson.module)) ||
    packageJson.types ||
    packageJson.typings
  );
  
  // Check for exports field (object structure indicates library)
  const hasExportsField = (
    packageJson.exports &&
    typeof packageJson.exports === 'object'
  );
  
  // Return true if either check passes
  return hasLibraryEntryPoints || hasExportsField;
}

/**
 * Check if project has app-specific indicators
 */
function hasAppIndicators(): boolean {
  try {
    // Check for HTML entry files
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
        return true;
      }
    }
    
    // Check for common app directories
    const appDirs = ['public', 'assets', 'static'];
    for (const dir of appDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        return true;
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Detect project preset (app or lib) from package.json and project structure
 */
function detectPreset(): 'app' | 'lib' {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.warn('[vite-enhance] package.json not found, defaulting to app preset');
      return 'app';
    }
    
    let packageJson;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    } catch (error) {
      console.warn('[vite-enhance] Failed to parse package.json, defaulting to app preset');
      return 'app';
    }
    
    // Check for strong library indicators first (early return)
    if (hasStrongLibraryIndicators(packageJson)) {
      return 'lib';
    }
    
    // Check for app indicators
    if (hasAppIndicators()) {
      return 'app';
    }
    
    // Default to 'app' if no clear indicators found
    return 'app';
  } catch (error) {
    console.warn('[vite-enhance] Error during preset detection, defaulting to app preset:', error);
    return 'app';
  }
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
 * Create CDN plugin - wrapper around vite-plugin-cdn-import with enhancements
 */
function createCDNPlugin(options: any): any[] {
  try {
    // Import vite-plugin-cdn-import
    const cdnImport = tryImportPlugin('vite-plugin-cdn-import');
    if (!cdnImport) {
      console.warn('[vite-enhance] vite-plugin-cdn-import not found. Please install it.');
      return [];
    }
    
    // Transform our options to vite-plugin-cdn-import format
    const cdnOptions = transformCDNOptions(options || {});
    
    // Enhance with custom module configurations
    if (cdnOptions.modules && cdnOptions.modules.length > 0) {
      cdnOptions.modules = enhanceModuleConfigs(cdnOptions.modules, cdnImport);
    }
    
    return [cdnImport(cdnOptions)];
  } catch (error: any) {
    console.warn('[vite-enhance] CDN plugin not available:', error?.message || 'Unknown error');
    return [];
  }
}

/**
 * Enhance module configurations with custom definitions
 */
function enhanceModuleConfigs(modules: any[], cdnImport: any): any[] {
  // Custom module configurations
  const CUSTOM_MODULES: Record<string, any> = {
    'vue': {
      name: 'vue',
      var: 'Vue',
      path: 'dist/vue.runtime.global.prod.js', // 使用 runtime 版本（不含编译器）
    },
    'vue-router': {
      name: 'vue-router',
      var: 'VueRouter',
      path: 'dist/vue-router.global.prod.js',
    },
    'element-plus': {
      name: 'element-plus',
      var: 'ElementPlus',
      path: 'dist/index.full.min.js',
      css: 'dist/index.css',
    },
    'element-ui': {
      name: 'element-ui',
      var: 'ELEMENT',
      path: 'lib/index.js',
      css: 'lib/theme-chalk/index.css',
    },
    'antd': {
      name: 'antd',
      var: 'antd',
      path: 'dist/antd.min.js',
      css: 'dist/reset.min.css',
    },
    'react': {
      name: 'react',
      var: 'React',
      path: 'umd/react.production.min.js',
    },
    'react-dom': {
      name: 'react-dom',
      var: 'ReactDOM',
      path: 'umd/react-dom.production.min.js',
    },
    'lodash': {
      name: 'lodash',
      var: '_',
      path: 'lodash.min.js',
    },
    'axios': {
      name: 'axios',
      var: 'axios',
      path: 'dist/axios.min.js',
    },
  };
  
  return modules.map(module => {
    // If module is a string, try to convert it to module config
    if (typeof module === 'string') {
      // Use custom config if available
      if (CUSTOM_MODULES[module]) {
        return CUSTOM_MODULES[module];
      }
      
      // If no custom config, try vite-plugin-cdn-import's autoComplete
      const { autoComplete } = cdnImport;
      if (autoComplete) {
        try {
          const config = autoComplete(module);
          if (config) return config;
        } catch {
          // Ignore errors from autoComplete
        }
      }
      
      console.warn(`[vite-enhance:cdn] Module "${module}" is not supported. Please provide custom config.`);
      return null;
    }
    
    // If already a module config object, return as-is
    return module;
  }).filter(Boolean); // Remove null values
}

/**
 * Transform our CDN options to vite-plugin-cdn-import format
 */
function transformCDNOptions(options: any): any {
  const {
    modules = [],
    cdnProvider = 'jsdelivr',
    customProdUrl,
    prodUrl,
    enableInDevMode = false,
    autoDetect = false,
    autoDetectDeps = 'dependencies',
    autoDetectExclude = [],
    autoDetectInclude = [],
    generateScriptTag,
    generateCssLinkTag,
  } = options;
  
  // Auto-detect modules if enabled
  let finalModules = [...modules];
  if (autoDetect) {
    const detectedModules = autoDetectModulesFromPackageJson(
      process.cwd(),
      autoDetectDeps,
      autoDetectExclude,
      autoDetectInclude
    );
    finalModules = [...new Set([...modules, ...detectedModules])];
    
    if (detectedModules.length > 0) {
      console.log(`[vite-enhance:cdn] Auto-detected ${detectedModules.length} modules: ${detectedModules.join(', ')}`);
    }
  }
  
  // vite-plugin-cdn-import uses 'prodUrl' for the base URL template
  // It should be the full CDN domain, the plugin handles the path
  let finalProdUrl = prodUrl || customProdUrl;
  if (!finalProdUrl) {
    // vite-plugin-cdn-import default is jsdelivr, so we can omit if using jsdelivr
    // For other providers, we need to specify
    if (cdnProvider !== 'jsdelivr') {
      switch (cdnProvider) {
        case 'unpkg':
          finalProdUrl = 'https://unpkg.com';
          break;
        case 'cdnjs':
          finalProdUrl = 'https://cdnjs.cloudflare.com/ajax/libs';
          break;
      }
    }
  }
  
  const config: any = {
    modules: finalModules,
    enableInDevMode,
  };
  
  // Only add prodUrl if specified
  if (finalProdUrl) {
    config.prodUrl = finalProdUrl;
  }
  
  // Add custom tag generators if provided, or use defaults with crossorigin
  if (generateScriptTag) {
    config.generateScriptTag = generateScriptTag;
  } else {
    // Default: add crossorigin="anonymous" for better CORS handling
    config.generateScriptTag = (_name: string, _url: string) => ({
      crossorigin: 'anonymous',
    });
  }
  
  if (generateCssLinkTag) {
    config.generateCssLinkTag = generateCssLinkTag;
  } else {
    // Default: add crossorigin="anonymous" for CSS as well
    config.generateCssLinkTag = (_name: string, _url: string) => ({
      crossorigin: 'anonymous',
    });
  }
  
  return config;
}

/**
 * Auto-detect modules from package.json
 */
function autoDetectModulesFromPackageJson(
  root: string,
  depsType: 'dependencies' | 'all' | 'production',
  exclude: string[] = [],
  include: string[] = []
): string[] {
  try {
    const packageJsonPath = path.join(root, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return [];
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const detectedModules: string[] = [];
    
    // Get dependencies based on type
    let allDeps: Record<string, string> = {};
    
    switch (depsType) {
      case 'dependencies':
        allDeps = packageJson.dependencies || {};
        break;
      case 'production':
        allDeps = {
          ...(packageJson.dependencies || {}),
          ...(packageJson.peerDependencies || {}),
        };
        break;
      case 'all':
        allDeps = {
          ...(packageJson.dependencies || {}),
          ...(packageJson.devDependencies || {}),
          ...(packageJson.peerDependencies || {}),
        };
        break;
    }
    
    // Supported modules that can be auto-detected
    const SUPPORTED_MODULES = [
      'vue', 'vue-router', 'vue-demi',
      'react', 'react-dom', 'react-router-dom',
      'lodash', 'axios', 'moment', 'dayjs',
      'element-plus', 'element-ui', 'antd',
      'jquery', 'bootstrap', 'echarts', 'three'
    ];
    
    // Check each dependency against supported modules
    for (const [depName] of Object.entries(allDeps)) {
      // Skip if excluded
      if (exclude.includes(depName)) {
        continue;
      }
      
      // Include if in supported modules list
      if (SUPPORTED_MODULES.includes(depName)) {
        detectedModules.push(depName);
      }
    }
    
    // Add explicitly included modules
    for (const moduleName of include) {
      if (!detectedModules.includes(moduleName)) {
        detectedModules.push(moduleName);
      }
    }
    
    return detectedModules;
    
  } catch (error) {
    console.warn('[vite-enhance:cdn] Failed to auto-detect modules:', error);
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
    const module = require(packageName);
    
    // Handle different export patterns
    // ESM default export: { default: function }
    // CommonJS: function
    return module.default || module;
  } catch (error) {
    // Plugin not installed or not available
    return null;
  }
}

/**
 * Create Compress plugin
 */
function createCompressPlugin(options: any): any[] {
  return [compressPlugin(options === true ? {} : options)];
}
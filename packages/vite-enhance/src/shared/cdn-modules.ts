/**
 * CDN Module configuration interface
 */
export interface CDNModule {
  /** Package name */
  name: string;
  /** Global variable name */
  var: string;
  /** Path to the main JS file (relative to package) */
  path: string | string[];
  /** Aliases for this module */
  alias?: string[];
  /** Path to CSS file(s) */
  css?: string | string[];
  /** Custom production URL */
  prodUrl?: string;
}

/**
 * Built-in CDN module configurations
 * These are commonly used libraries with their CDN paths
 */
export const CDN_MODULE_CONFIGS: Readonly<Record<string, CDNModule>> = {
  // React Ecosystem
  'react': {
    name: 'react',
    var: 'React',
    path: 'umd/react.production.min.js',
  },
  'react-dom': {
    name: 'react-dom',
    var: 'ReactDOM',
    path: 'umd/react-dom.production.min.js',
    alias: ['react-dom/client'],
  },
  'react-router-dom': {
    name: 'react-router-dom',
    var: 'ReactRouterDOM',
    path: 'dist/umd/react-router-dom.production.min.js',
  },
  
  // Vue Ecosystem
  'vue': {
    name: 'vue',
    var: 'Vue',
    path: 'dist/vue.runtime.global.prod.js',
  },
  'vue-router': {
    name: 'vue-router',
    var: 'VueRouter',
    path: 'dist/vue-router.global.prod.js',
  },
  'vue-demi': {
    name: 'vue-demi',
    var: 'VueDemi',
    path: 'lib/index.iife.js',
  },
  'pinia': {
    name: 'pinia',
    var: 'Pinia',
    path: 'dist/pinia.iife.prod.js',
  },
  
  // UI Libraries
  'antd': {
    name: 'antd',
    var: 'antd',
    path: 'dist/antd.min.js',
    css: 'dist/reset.min.css',
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
  '@arco-design/web-vue': {
    name: '@arco-design/web-vue',
    var: 'ArcoVue',
    path: 'dist/arco-vue.min.js',
    css: 'dist/arco.css',
  },
  'naive-ui': {
    name: 'naive-ui',
    var: 'naive',
    path: 'dist/index.prod.js',
  },
  
  // Utility Libraries
  'lodash': {
    name: 'lodash',
    var: '_',
    path: 'lodash.min.js',
  },
  'lodash-es': {
    name: 'lodash-es',
    var: '_',
    path: 'lodash.min.js',
  },
  'axios': {
    name: 'axios',
    var: 'axios',
    path: 'dist/axios.min.js',
  },
  'moment': {
    name: 'moment',
    var: 'moment',
    path: 'min/moment.min.js',
  },
  'dayjs': {
    name: 'dayjs',
    var: 'dayjs',
    path: 'dayjs.min.js',
  },
  'date-fns': {
    name: 'date-fns',
    var: 'dateFns',
    path: 'cdn.min.js',
  },
  
  // Other Common Libraries
  'jquery': {
    name: 'jquery',
    var: '$',
    path: 'dist/jquery.min.js',
  },
  'bootstrap': {
    name: 'bootstrap',
    var: 'bootstrap',
    path: 'dist/js/bootstrap.bundle.min.js',
    css: 'dist/css/bootstrap.min.css',
  },
  'echarts': {
    name: 'echarts',
    var: 'echarts',
    path: 'dist/echarts.min.js',
  },
  'three': {
    name: 'three',
    var: 'THREE',
    path: 'build/three.min.js',
  },
  'd3': {
    name: 'd3',
    var: 'd3',
    path: 'dist/d3.min.js',
  },
} as const;

/**
 * CDN Provider URL templates
 */
export const CDN_PROVIDERS = {
  jsdelivr: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
  unpkg: 'https://unpkg.com/{name}@{version}/{path}',
  cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path}',
  bootcdn: 'https://cdn.bootcdn.net/ajax/libs/{name}/{version}/{path}',
} as const;

export type CDNProvider = keyof typeof CDN_PROVIDERS | 'custom';

const DEFAULT_CDN_URL = CDN_PROVIDERS.jsdelivr;

/**
 * Get CDN URL template for a provider
 */
export function getCDNUrlTemplate(provider: CDNProvider, customUrl?: string): string {
  if (provider === 'custom') {
    return customUrl || DEFAULT_CDN_URL;
  }
  if (provider in CDN_PROVIDERS) {
    return CDN_PROVIDERS[provider as keyof typeof CDN_PROVIDERS];
  }
  return DEFAULT_CDN_URL;
}

/**
 * Detect CDN provider from URL
 */
export function detectCDNProvider(url: string): CDNProvider {
  if (url.includes('unpkg.com')) return 'unpkg';
  if (url.includes('jsdelivr.net')) return 'jsdelivr';
  if (url.includes('cdnjs.cloudflare.com')) return 'cdnjs';
  if (url.includes('bootcdn.net')) return 'bootcdn';
  return 'custom';
}

/**
 * Render URL with template variables
 */
export function renderCDNUrl(
  template: string,
  data: { name: string; version: string; path: string }
): string {
  let url = template
    .replace(/\{name\}/g, data.name)
    .replace(/\{version\}/g, data.version || 'latest')
    .replace(/\{path\}/g, data.path);
  
  return url;
}

/**
 * Get module configuration by name
 */
export function getModuleConfig(name: string): CDNModule | undefined {
  return CDN_MODULE_CONFIGS[name];
}

/**
 * Check if a module is supported
 */
export function isModuleSupported(name: string): boolean {
  return name in CDN_MODULE_CONFIGS;
}

/**
 * Get all supported module names
 */
export function getSupportedModules(): string[] {
  return Object.keys(CDN_MODULE_CONFIGS);
}

/**
 * Auto-detect CDN modules from dependencies
 * @param dependencies - Object of dependencies
 * @param exclude - Module names to exclude
 * @param include - Module names to always include
 * @returns Array of detected module names
 */
export function autoDetectCDNModules(
  dependencies: Record<string, string> | null | undefined,
  exclude: string[] = [],
  include: string[] = []
): string[] {
  const detected: string[] = [];
  
  // Handle null/undefined dependencies
  if (dependencies && typeof dependencies === 'object') {
    for (const depName of Object.keys(dependencies)) {
      if (exclude.includes(depName)) continue;
      if (depName in CDN_MODULE_CONFIGS) {
        detected.push(depName);
      }
    }
  }

  // Add explicitly included modules
  for (const name of include) {
    if (!detected.includes(name)) {
      detected.push(name);
    }
  }

  return detected;
}

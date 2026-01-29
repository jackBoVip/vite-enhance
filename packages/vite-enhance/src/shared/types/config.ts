import type { UserConfig as ViteUserConfig } from 'vite';
import type { EnhancePlugin, ProjectType, FrameworkType } from './plugin';

// 内置功能配置接口
export interface EnhanceFeatureConfig {
  preset?: 'app' | 'lib' | PresetConfig;
  
  // 框架特定配置
  vue?: VuePluginOptions | boolean;
  react?: ReactPluginOptions | boolean;
  svelte?: SveltePluginOptions | boolean;
  solid?: SolidPluginOptions | boolean;
  lit?: LitPluginOptions | boolean;
  preact?: PreactPluginOptions | boolean;
  
  // 功能配置
  cdn?: CDNOptions | boolean;
  cache?: CacheOptions | boolean;
  analyze?: AnalyzeOptions | boolean;
  pwa?: PWAOptions | boolean;
  compress?: CompressOptions | boolean;
}

// 主配置接口 - 支持新的嵌套结构
export interface EnhanceConfig {
  // 新的嵌套结构
  enhance?: EnhanceFeatureConfig;
  
  // Vite 原生配置
  vite?: ViteUserConfig;
  
  // 额外的 Vite 插件 (Vite Plugin type is complex, use unknown)
  plugins?: unknown[];
}

export interface ResolvedEnhanceConfig extends EnhanceConfig {
  root: string;
  mode: string;
  command: 'serve' | 'build';
  projectType: ProjectType;
  framework: FrameworkType;
  plugins: EnhancePlugin[];
}

export interface PresetConfig {
  name: string;
  options?: Record<string, unknown>;
}

// Babel plugin/preset type (complex, use unknown for flexibility)
export type BabelPlugin = string | [string, Record<string, unknown>] | unknown;

// 框架插件选项
export interface VuePluginOptions {
  script?: {
    defineModel?: boolean;
    propsDestructure?: boolean;
    hoistStatic?: boolean;
  };
  template?: {
    compilerOptions?: Record<string, unknown>;
  };
  style?: {
    filename?: string;
  };
  devtools?: {
    enabled?: boolean;
    launchEditor?: string;
    componentInspector?: boolean;
    appendTo?: string | RegExp;
  };
}

export interface ReactPluginOptions {
  fastRefresh?: boolean;
  jsxRuntime?: 'automatic' | 'classic';
  jsxImportSource?: string;
  babel?: {
    plugins?: BabelPlugin[];
    presets?: BabelPlugin[];
  };
  include?: RegExp;
  exclude?: RegExp;
}

export interface SveltePluginOptions {
  compilerOptions?: Record<string, unknown>;
  preprocess?: unknown;
  hot?: boolean;
  ignorePluginPreprocessors?: boolean;
  dynamicCompileOptions?: (filename: string) => Record<string, unknown>;
  experimental?: Record<string, unknown>;
}

export interface SolidPluginOptions {
  babel?: {
    plugins?: BabelPlugin[];
    presets?: BabelPlugin[];
  };
  extensions?: string[];
  template?: {
    tagName?: string;
    attrName?: string;
  };
  hot?: boolean;
  hydratable?: boolean;
  generate?: 'dom' | 'ssr';
  parserOptions?: Record<string, unknown>;
  transformOptions?: Record<string, unknown>;
}

export interface LitPluginOptions {
  compilerOptions?: Record<string, unknown>;
  preprocess?: unknown;
  absoluteImports?: boolean;
  compileDebug?: boolean;
  minify?: boolean;
  polyfillsImport?: string[];
}

export interface PreactPluginOptions {
  devtoolsInProd?: boolean;
  babel?: {
    plugins?: BabelPlugin[];
    presets?: BabelPlugin[];
  };
  include?: RegExp;
  exclude?: RegExp;
}

// 功能插件选项
export interface CDNOptions {
  // 基础配置
  modules?: string[];
  prodUrl?: string;
  enableInDevMode?: boolean;
  
  // 自动检测配置
  autoDetect?: boolean;
  autoDetectDeps?: 'dependencies' | 'all' | 'production';
  autoDetectExclude?: string[];
  autoDetectInclude?: string[];
  
  // CDN 提供商配置
  cdnProvider?: 'unpkg' | 'jsdelivr' | 'cdnjs' | 'custom';
  customProdUrl?: string;
  
  // 自定义标签生成
  generateScriptTag?: (name: string, scriptUrl: string) => Record<string, string | boolean>;
  generateCssLinkTag?: (name: string, cssUrl: string) => Record<string, string | boolean>;
}

export interface CacheOptions {
  cacheDir?: string;
  include?: string[];
  exclude?: string[];
  strategy?: {
    hashAlgorithm?: 'md5' | 'sha1' | 'sha256';
    invalidateOn?: string[];
    maxSize?: number;
    maxAge?: number;
  };
}

export interface AnalyzeOptions {
  enabled?: boolean;
  open?: boolean;
  filename?: string;
  template?: 'treemap' | 'sunburst' | 'network';
  gzipSize?: boolean;
  brotliSize?: boolean;
  sourcemap?: boolean;
  exclude?: (string | RegExp)[];
}

// Workbox runtime caching config
export interface RuntimeCachingConfig {
  urlPattern: string | RegExp;
  handler: 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate';
  options?: Record<string, unknown>;
}

export interface PWAOptions {
  registerType?: 'prompt' | 'autoUpdate';
  workbox?: {
    globPatterns?: string[];
    runtimeCaching?: RuntimeCachingConfig[];
    skipWaiting?: boolean;
    clientsClaim?: boolean;
  };
  manifest?: {
    name?: string;
    short_name?: string;
    description?: string;
    theme_color?: string;
    background_color?: string;
    display?: string;
    orientation?: string;
    scope?: string;
    start_url?: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }>;
    shortcuts?: Array<{
      name: string;
      short_name?: string;
      description?: string;
      url: string;
      icons?: Array<{ src: string; sizes: string }>;
    }>;
  };
  devOptions?: {
    enabled?: boolean;
    type?: string;
  };
}

export interface CompressOptions {
  /**
   * 压缩格式
   * @default 'tar'
   */
  format?: 'tar' | 'tar.gz' | 'zip';
  
  /**
   * 输出目录
   * @default 'dist/lib'
   */
  outputDir?: string;
  
  /**
   * 是否启用压缩插件
   * @default true
   */
  enabled?: boolean;
  
  /**
   * 自定义压缩文件名（不含扩展名）
   * 默认使用包名
   */
  fileName?: string;
}
import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin } from '@vite-enhance/shared';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

// 定义 Module 接口
interface CDNModule {
  name: string;
  var: string;
  path: string | string[];
  alias?: string[];
  css?: string | string[];
  prodUrl?: string;
}

export interface CreateCDNPluginOptions {
  // 基础配置
  modules?: string[];
  prodUrl?: string;
  enableInDevMode?: boolean;
  
  // Auto-detection options (新增功能)
  autoDetect?: boolean;
  autoDetectDeps?: 'dependencies' | 'all' | 'production';
  autoDetectExclude?: string[];
  autoDetectInclude?: string[];
  
  // CDN 配置
  cdnProvider?: 'unpkg' | 'jsdelivr' | 'cdnjs' | 'custom';
  customProdUrl?: string;
  
  // 自定义标签生成
  generateScriptTag?: (name: string, scriptUrl: string) => Record<string, any>;
  generateCssLinkTag?: (name: string, cssUrl: string) => Record<string, any>;
}

// 支持的模块映射 - 基于 vite-plugin-cdn-import 但简化实现
const MODULE_CONFIGS: Record<string, CDNModule> = {
  // React 生态
  'react': {
    name: 'react',
    var: 'React',
    path: 'umd/react.production.min.js'
  },
  'react-dom': {
    name: 'react-dom',
    var: 'ReactDOM',
    path: 'umd/react-dom.production.min.js',
    alias: ['react-dom/client']
  },
  'react-router-dom': {
    name: 'react-router-dom',
    var: 'ReactRouterDOM',
    path: 'dist/umd/react-router-dom.production.min.js'
  },
  
  // Vue 生态  
  'vue': {
    name: 'vue',
    var: 'Vue',
    path: 'dist/vue.global.prod.js'
  },
  'vue-router': {
    name: 'vue-router',
    var: 'VueRouter',
    path: 'dist/vue-router.global.min.js'
  },
  'vue2': {
    name: 'vue',
    var: 'Vue',
    path: 'dist/vue.min.js'
  },
  
  // UI 库
  'antd': {
    name: 'antd',
    var: 'antd',
    path: 'dist/antd.min.js',
    css: 'dist/reset.min.css'
  },
  'element-plus': {
    name: 'element-plus',
    var: 'ElementPlus',
    path: 'dist/index.full.min.js',
    css: 'dist/index.css'
  },
  'element-ui': {
    name: 'element-ui', 
    var: 'ELEMENT',
    path: 'lib/index.js',
    css: 'lib/theme-chalk/index.css'
  },
  
  // 工具库
  'lodash': {
    name: 'lodash',
    var: '_',
    path: 'lodash.min.js'
  },
  'axios': {
    name: 'axios',
    var: 'axios',
    path: 'dist/axios.min.js'
  },
  'moment': {
    name: 'moment',
    var: 'moment',
    path: 'moment.min.js'
  },
  'dayjs': {
    name: 'dayjs',
    var: 'dayjs',
    path: 'dayjs.min.js'
  },
  
  // 其他常用库
  'jquery': {
    name: 'jquery',
    var: '$',
    path: 'dist/jquery.min.js'
  },
  'bootstrap': {
    name: 'bootstrap',
    var: 'bootstrap',
    path: 'dist/js/bootstrap.bundle.min.js',
    css: 'dist/css/bootstrap.min.css'
  },
  'echarts': {
    name: 'echarts',
    var: 'echarts',
    path: 'dist/echarts.min.js'
  },
  'three': {
    name: 'three',
    var: 'THREE',
    path: 'build/three.min.js'
  }
};

/**
 * 获取 CDN URL 模板
 */
function getCDNUrlTemplate(provider: string, customUrl?: string): string {
  if (customUrl) return customUrl;
  
  switch (provider) {
    case 'unpkg':
      return 'https://unpkg.com/{name}@{version}/{path}';
    case 'jsdelivr':
      return 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}';
    case 'cdnjs':
      return 'https://cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path}';
    default:
      return 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}';
  }
}

/**
 * 检测 CDN 提供商
 */
function detectCDNProvider(url: string): string {
  if (url.includes('unpkg.com')) return 'unpkg';
  if (url.includes('jsdelivr.net')) return 'jsdelivr';
  if (url.includes('cdnjs.cloudflare.com')) return 'cdnjs';
  return 'custom';
}

/**
 * 获取模块版本
 */
function getModuleVersion(name: string): string {
  try {
    const packageJsonPath = join(process.cwd(), 'node_modules', name, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.version;
    }
  } catch (error) {
    // 忽略错误，返回空字符串
  }
  return '';
}

/**
 * 渲染 URL
 */
function renderUrl(template: string, data: { name: string; version: string; path: string }): string {
  let url = template
    .replace(/\{name\}/g, data.name)
    .replace(/\{version\}/g, data.version)
    .replace(/\{path\}/g, data.path);
  
  // 如果版本为空，使用 latest
  if (!data.version) {
    url = url.replace('@', '@latest');
  }
  
  return url;
}

/**
 * Enhanced CDN plugin with auto-detection capabilities
 * 增强的 CDN 插件，支持自动检测依赖
 */
export function createCDNPlugin(options: CreateCDNPluginOptions = {}): EnhancePlugin {
  const {
    modules = [],
    enableInDevMode = false,
    generateScriptTag,
    generateCssLinkTag,
    // Auto-detection options
    autoDetect = false,
    autoDetectDeps = 'dependencies',
    autoDetectExclude = [],
    autoDetectInclude = [],
    // CDN provider options
    cdnProvider = 'jsdelivr',
    customProdUrl,
    prodUrl,
  } = options;

  // 确定最终的 prodUrl
  const finalProdUrl = prodUrl || customProdUrl || getCDNUrlTemplate(cdnProvider);
  const detectedProvider = detectCDNProvider(finalProdUrl);
  
  // 存储最终的模块列表和信息
  let finalModules: string[] = [...modules];
  let autoDetectedModules: string[] = [];
  let moduleInfos: Array<{
    name: string;
    config: CDNModule;
    version: string;
    jsUrls: string[];
    cssUrls: string[];
  }> = [];

  return {
    name: 'enhance:cdn',
    version: '0.3.0',
    apply: enableInDevMode ? 'both' : 'build',
    
    vitePlugin(): VitePlugin[] {
      return [
        {
          name: 'vite:enhance-cdn',
          enforce: 'pre',
          
          configResolved(config) {
            // Auto-detect modules from package.json if enabled
            if (autoDetect) {
              autoDetectedModules = autoDetectModulesFromPackageJson(
                config.root,
                autoDetectDeps,
                autoDetectExclude,
                autoDetectInclude
              );
              
              // 合并手动指定的模块和自动检测的模块
              finalModules = [...new Set([...modules, ...autoDetectedModules])];
              
              if (autoDetectedModules.length > 0) {
                console.log(`[vek:cdn] Auto-detected ${autoDetectedModules.length} modules: ${autoDetectedModules.join(', ')}`);
              }
            }
            
            // 准备模块信息
            moduleInfos = finalModules
              .map(name => {
                const config = MODULE_CONFIGS[name];
                if (!config) return null;
                
                const version = getModuleVersion(name);
                
                // 生成 JS URLs
                const paths = Array.isArray(config.path) ? config.path : [config.path];
                const jsUrls = paths.map(path => renderUrl(finalProdUrl, { name, version, path }));
                
                // 生成 CSS URLs
                const cssFiles = config.css ? (Array.isArray(config.css) ? config.css : [config.css]) : [];
                const cssUrls = cssFiles.map(css => renderUrl(finalProdUrl, { name, version, path: css }));
                
                return { name, config, version, jsUrls, cssUrls };
              })
              .filter((info): info is NonNullable<typeof info> => info !== null);
          },
          
          config(config) {
            if (moduleInfos.length === 0) return;
            
            // 配置外部依赖
            config.build ??= {};
            config.build.rollupOptions ??= {};
            config.build.rollupOptions.external ??= [];
            config.build.rollupOptions.output ??= {};
            
            const external = Array.isArray(config.build.rollupOptions.external) 
              ? [...config.build.rollupOptions.external] 
              : config.build.rollupOptions.external 
                ? [config.build.rollupOptions.external as string]
                : [];
            
            const output = config.build.rollupOptions.output as any;
            output.globals ??= {};
            
            // 添加外部依赖和全局变量
            moduleInfos.forEach(({ name, config: moduleConfig }) => {
              external.push(name);
              output.globals[name] = moduleConfig.var;
              
              // 处理别名
              if (moduleConfig.alias) {
                moduleConfig.alias.forEach(alias => {
                  external.push(alias);
                  output.globals[alias] = moduleConfig.var;
                });
              }
            });
            
            config.build.rollupOptions.external = external;
          },
          
          transformIndexHtml(html) {
            if (!enableInDevMode && process.env.NODE_ENV !== 'production') {
              return html;
            }
            
            if (moduleInfos.length === 0) return html;
            
            const tags: string[] = [];
            
            // 生成 CSS 和 JS 标签
            moduleInfos.forEach(({ name, jsUrls, cssUrls }) => {
              // CSS 标签
              cssUrls.forEach(url => {
                if (generateCssLinkTag) {
                  const customAttrs = generateCssLinkTag(name, url);
                  const attrs = Object.entries({ href: url, rel: 'stylesheet', ...customAttrs })
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ');
                  tags.push(`<link ${attrs}>`);
                } else {
                  tags.push(`<link rel="stylesheet" href="${url}">`);
                }
              });
              
              // JS 标签
              jsUrls.forEach(url => {
                if (generateScriptTag) {
                  const customAttrs = generateScriptTag(name, url);
                  const attrs = Object.entries({ src: url, ...customAttrs })
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ');
                  tags.push(`<script ${attrs}></script>`);
                } else {
                  tags.push(`<script src="${url}"></script>`);
                }
              });
            });
            
            // 注入到 HTML
            if (tags.length > 0) {
              const headCloseIndex = html.indexOf('</head>');
              if (headCloseIndex !== -1) {
                const tagsHtml = tags.join('\n  ');
                html = html.slice(0, headCloseIndex) + 
                       `  ${tagsHtml}\n` + 
                       html.slice(headCloseIndex);
              }
            }
            
            return html;
          },
          
          generateBundle() {
            if (moduleInfos.length === 0) return;
            
            // 生成 CDN 清单文件
            const manifest = {
              provider: detectedProvider,
              baseUrl: finalProdUrl,
              autoDetected: autoDetect,
              autoDetectedModules,
              manualModules: modules,
              modules: moduleInfos.map(({ name, config, version, jsUrls, cssUrls }) => ({
                name,
                var: config.var,
                version,
                alias: config.alias,
                jsUrls,
                cssUrls
              })),
              scripts: moduleInfos.flatMap(({ jsUrls }) => jsUrls),
              styles: moduleInfos.flatMap(({ cssUrls }) => cssUrls),
              timestamp: new Date().toISOString()
            };
            
            this.emitFile({
              type: 'asset',
              fileName: 'cdn-manifest.json',
              source: JSON.stringify(manifest, null, 2)
            });
            
            // 输出日志
            console.log('[vek:cdn] CDN resources generated:');
            manifest.scripts.forEach(script => console.log(`  JS: ${script}`));
            manifest.styles.forEach(style => console.log(`  CSS: ${style}`));
          }
        }
      ];
    },
    
    configResolved() {
      if (finalModules.length > 0 || autoDetect) {
        console.log(`[vek:cdn] Enhanced CDN plugin initialized`);
        console.log(`[vek:cdn] Provider: ${detectedProvider}`);
        console.log(`[vek:cdn] Base URL: ${finalProdUrl}`);
        
        if (autoDetect) {
          console.log(`[vek:cdn] Auto-detection enabled (${autoDetectDeps})`);
          if (autoDetectedModules.length > 0) {
            console.log(`[vek:cdn] Auto-detected modules: ${autoDetectedModules.join(', ')}`);
          }
        }
        
        if (modules.length > 0) {
          console.log(`[vek:cdn] Manual modules: ${modules.join(', ')}`);
        }
        
        // 检查不支持的模块
        const unsupportedModules = finalModules.filter(name => !MODULE_CONFIGS[name]);
        if (unsupportedModules.length > 0) {
          console.warn(`[vek:cdn] Unsupported modules (no CDN config): ${unsupportedModules.join(', ')}`);
        }
      }
    }
  };
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
    const packageJsonPath = join(root, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.warn('[vek:cdn] package.json not found, skipping auto-detection');
      return [];
    }
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
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
    
    // Check each dependency against supported modules
    for (const [depName] of Object.entries(allDeps)) {
      // Skip if excluded
      if (exclude.includes(depName)) {
        continue;
      }
      
      // Include if in supported modules list
      if (MODULE_CONFIGS[depName] || include.includes(depName)) {
        detectedModules.push(depName);
      }
    }
    
    // Add explicitly included modules (even if not in dependencies)
    for (const moduleName of include) {
      if (!detectedModules.includes(moduleName)) {
        detectedModules.push(moduleName);
      }
    }
    
    return detectedModules;
    
  } catch (error) {
    console.warn('[vek:cdn] Failed to auto-detect modules from package.json:', error);
    return [];
  }
}

// 导出兼容性接口
export type { CDNModule };

export default createCDNPlugin;
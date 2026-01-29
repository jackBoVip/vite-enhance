import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, CDNOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';
import { getPackageJson } from '../../shared/package-utils.js';
import {
  CDN_MODULE_CONFIGS,
  getCDNUrlTemplate,
  renderCDNUrl,
  autoDetectCDNModules,
  type CDNModule,
  type CDNProvider,
} from '../../shared/cdn-modules.js';
import { getAllDependencies, getProductionDependencies } from '../../shared/package-utils.js';
import { join, normalize } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const logger = createLogger('cdn');

export interface CreateCDNPluginOptions extends CDNOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Validate module name to prevent path traversal
 */
function isValidModuleName(name: string): boolean {
  // Block path traversal
  if (name.includes('..') || name.includes('\\')) {
    return false;
  }
  // Block absolute paths
  if (name.startsWith('/') || /^[a-zA-Z]:/.test(name)) {
    return false;
  }
  // Valid npm package name pattern
  return /^(@[a-zA-Z0-9][\w.-]*\/)?[a-zA-Z0-9][\w.-]*$/.test(name);
}

/**
 * Get module version from node_modules
 */
function getModuleVersion(name: string, root: string = process.cwd()): string {
  // Security: validate module name
  if (!isValidModuleName(name)) {
    logger.warn(`Invalid module name: ${name}`);
    return '';
  }
  
  try {
    // Normalize and validate path
    const normalizedRoot = normalize(root);
    const packageJsonPath = join(normalizedRoot, 'node_modules', name, 'package.json');
    
    // Ensure path is within project
    if (!packageJsonPath.startsWith(normalizedRoot)) {
      logger.warn(`Path traversal detected for module: ${name}`);
      return '';
    }
    
    if (existsSync(packageJsonPath)) {
      const content = readFileSync(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content) as { version?: string };
      return pkg.version || '';
    }
  } catch (error) {
    logger.debug(`Failed to get version for ${name}:`, error);
  }
  return '';
}

interface ModuleInfo {
  name: string;
  config: CDNModule;
  version: string;
  jsUrls: string[];
  cssUrls: string[];
}

/**
 * Enhanced CDN plugin with auto-detection capabilities
 */
export function createCDNPlugin(options: CreateCDNPluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options ?? {};
  const {
    modules = [],
    enableInDevMode = false,
    generateScriptTag,
    generateCssLinkTag,
    autoDetect = false,
    autoDetectDeps = 'dependencies',
    autoDetectExclude = [],
    autoDetectInclude = [],
    cdnProvider = 'jsdelivr',
    customProdUrl,
    prodUrl,
  } = safeOptions;

  const finalProdUrl = prodUrl || customProdUrl || getCDNUrlTemplate(cdnProvider as CDNProvider);
  
  let finalModules: string[] = [...modules];
  let autoDetectedModules: string[] = [];
  let moduleInfos: ModuleInfo[] = [];

  return {
    name: 'enhance:cdn',
    version: '0.4.0',
    apply: enableInDevMode ? 'both' : 'build',
    
    vitePlugin(): VitePlugin[] {
      return [
        {
          name: 'vite:enhance-cdn',
          enforce: 'pre',
          
          config(config) {
            const root = config.root || process.cwd();
            
            // Auto-detect modules if enabled (must be done in config hook, before configResolved)
            if (autoDetect) {
              autoDetectedModules = autoDetectModulesFromPackageJson(
                root,
                autoDetectDeps,
                autoDetectExclude,
                autoDetectInclude
              );
              
              finalModules = [...new Set([...modules, ...autoDetectedModules])];
              
              if (autoDetectedModules.length > 0) {
                logger.info(`Auto-detected modules: ${autoDetectedModules.join(', ')}`);
              }
            }
            
            // Prepare module infos - filter invalid names first
            moduleInfos = finalModules
              .filter(name => typeof name === 'string' && name.trim().length > 0)
              .map(name => {
                const moduleConfig = CDN_MODULE_CONFIGS[name];
                if (!moduleConfig) {
                  logger.warn(`Module "${name}" has no CDN configuration`);
                  return null;
                }
                
                // Ensure moduleConfig has required properties
                if (!moduleConfig.var || !moduleConfig.path) {
                  logger.warn(`Module "${name}" has incomplete CDN configuration`);
                  return null;
                }
                
                const version = getModuleVersion(name, root);
                const paths = Array.isArray(moduleConfig.path) ? moduleConfig.path : [moduleConfig.path];
                const jsUrls = paths.map(p => renderCDNUrl(finalProdUrl, { name, version, path: p }));
                
                const cssFiles = moduleConfig.css 
                  ? (Array.isArray(moduleConfig.css) ? moduleConfig.css : [moduleConfig.css])
                  : [];
                const cssUrls = cssFiles.map(css => renderCDNUrl(finalProdUrl, { name, version, path: css }));
                
                return { name, config: moduleConfig, version, jsUrls, cssUrls };
              })
              .filter((info): info is ModuleInfo => info !== null);
            
            if (moduleInfos.length === 0) return {};
            
            // Handle external - can be array, string, function, or RegExp
            const existingExternal = config.build?.rollupOptions?.external;
            let external: (string | RegExp)[];
            
            if (Array.isArray(existingExternal)) {
              external = [...existingExternal];
            } else if (typeof existingExternal === 'string' || existingExternal instanceof RegExp) {
              external = [existingExternal];
            } else if (typeof existingExternal === 'function') {
              logger.warn('CDN plugin: external is a function, module externalization may not work as expected');
              external = [];
            } else {
              external = [];
            }
            
            const globals: Record<string, string> = {};
            
            for (const { name, config: moduleConfig } of moduleInfos) {
              if (!external.includes(name)) {
                external.push(name);
              }
              globals[name] = moduleConfig.var;
              
              if (moduleConfig.alias) {
                for (const alias of moduleConfig.alias) {
                  if (!external.includes(alias)) {
                    external.push(alias);
                  }
                  globals[alias] = moduleConfig.var;
                }
              }
            }
            
            logger.info(`Externalizing modules: ${external.join(', ')}`);
            
            // Return config modification
            const rollupExternal = typeof existingExternal === 'function'
              ? (id: string, parentId: string | undefined, isResolved: boolean) => {
                  if (external.includes(id)) return true;
                  return (existingExternal as (id: string, parentId: string | undefined, isResolved: boolean) => boolean)(id, parentId, isResolved);
                }
              : external;
            
            return {
              build: {
                rollupOptions: {
                  external: rollupExternal,
                  output: {
                    globals,
                  },
                },
              },
            };
          },
          
          transformIndexHtml(html, ctx) {
            // Skip CDN injection in development unless explicitly enabled
            const isDev = ctx.server !== undefined;
            if (isDev && !enableInDevMode) {
              return html;
            }
            
            if (moduleInfos.length === 0) return html;
            
            const tags: string[] = [];
            
            for (const { name, jsUrls, cssUrls } of moduleInfos) {
              // CSS tags
              for (const url of cssUrls) {
                if (generateCssLinkTag) {
                  const customAttrs = generateCssLinkTag(name, url);
                  const attrs = Object.entries({ href: url, rel: 'stylesheet', ...customAttrs })
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ');
                  tags.push(`<link ${attrs}>`);
                } else {
                  tags.push(`<link rel="stylesheet" href="${url}" crossorigin="anonymous">`);
                }
              }
              
              // JS tags
              for (const url of jsUrls) {
                if (generateScriptTag) {
                  const customAttrs = generateScriptTag(name, url);
                  const attrs = Object.entries({ src: url, ...customAttrs })
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(' ');
                  tags.push(`<script ${attrs}></script>`);
                } else {
                  tags.push(`<script src="${url}" crossorigin="anonymous"></script>`);
                }
              }
            }
            
            if (tags.length > 0) {
              const headCloseIndex = html.indexOf('</head>');
              if (headCloseIndex !== -1) {
                const tagsHtml = tags.join('\n    ');
                html = html.slice(0, headCloseIndex) + `    ${tagsHtml}\n  ` + html.slice(headCloseIndex);
              }
            }
            
            return html;
          },
          
          generateBundle() {
            if (moduleInfos.length === 0) return;
            
            const manifest = {
              provider: cdnProvider,
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
                cssUrls,
              })),
              scripts: moduleInfos.flatMap(({ jsUrls }) => jsUrls),
              styles: moduleInfos.flatMap(({ cssUrls }) => cssUrls),
              timestamp: new Date().toISOString(),
            };
            
            this.emitFile({
              type: 'asset',
              fileName: 'cdn-manifest.json',
              source: JSON.stringify(manifest, null, 2),
            });
            
            logger.success('CDN manifest generated');
          },
        },
      ];
    },
    
    configResolved() {
      if (finalModules.length > 0 || autoDetect) {
        logger.info(`CDN plugin initialized (provider: ${cdnProvider})`);
      }
    },
  };
}

/**
 * Auto-detect modules from package.json
 */
function autoDetectModulesFromPackageJson(
  root: string,
  depsType: 'dependencies' | 'all' | 'production',
  exclude: string[],
  include: string[]
): string[] {
  let deps: Record<string, string>;
  
  switch (depsType) {
    case 'dependencies':
      deps = getPackageJson(root)?.dependencies ?? {};
      break;
    case 'production':
      deps = getProductionDependencies(root);
      break;
    case 'all':
      deps = getAllDependencies(root);
      break;
    default:
      deps = {};
  }

  return autoDetectCDNModules(deps, exclude, include);
}

export type { CDNModule };
export default createCDNPlugin;

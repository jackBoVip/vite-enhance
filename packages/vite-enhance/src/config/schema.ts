import { z } from 'zod';
import type { EnhancePlugin } from '../shared/index.js';

// Plugin schema - custom validator for EnhancePlugin
const EnhancePluginSchema = z.custom<EnhancePlugin>((val) => {
  if (typeof val !== 'object' || val === null) return false;
  const plugin = val as Record<string, unknown>;
  return typeof plugin.name === 'string';
}, {
  message: 'Invalid plugin object: must have a name property',
});

// Preset config schema
const PresetConfigSchema = z.object({
  name: z.string(),
  options: z.record(z.string(), z.unknown()).optional(),
});

// Framework plugin options schemas
const VuePluginOptionsSchema = z.object({
  script: z.object({
    defineModel: z.boolean().optional(),
    propsDestructure: z.boolean().optional(),
    hoistStatic: z.boolean().optional(),
  }).optional(),
  template: z.object({
    compilerOptions: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  style: z.object({
    filename: z.string().optional(),
  }).optional(),
  devtools: z.object({
    enabled: z.boolean().optional(),
    launchEditor: z.string().optional(),
    componentInspector: z.boolean().optional(),
    appendTo: z.union([z.string(), z.instanceof(RegExp)]).optional(),
  }).optional(),
}).strict().optional();

const ReactPluginOptionsSchema = z.object({
  fastRefresh: z.boolean().optional(),
  jsxRuntime: z.enum(['automatic', 'classic']).optional(),
  jsxImportSource: z.string().optional(),
  babel: z.object({
    plugins: z.array(z.unknown()).optional(),
    presets: z.array(z.unknown()).optional(),
  }).optional(),
  include: z.instanceof(RegExp).optional(),
  exclude: z.instanceof(RegExp).optional(),
}).strict().optional();

const SveltePluginOptionsSchema = z.object({
  compilerOptions: z.record(z.string(), z.unknown()).optional(),
  preprocess: z.unknown().optional(),
  hot: z.boolean().optional(),
  ignorePluginPreprocessors: z.boolean().optional(),
  dynamicCompileOptions: z.function().optional(),
  experimental: z.record(z.string(), z.unknown()).optional(),
}).strict().optional();

const SolidPluginOptionsSchema = z.object({
  babel: z.object({
    plugins: z.array(z.unknown()).optional(),
    presets: z.array(z.unknown()).optional(),
  }).optional(),
  extensions: z.array(z.string()).optional(),
  template: z.object({
    tagName: z.string().optional(),
    attrName: z.string().optional(),
  }).optional(),
  hot: z.boolean().optional(),
  hydratable: z.boolean().optional(),
  generate: z.enum(['dom', 'ssr']).optional(),
  parserOptions: z.record(z.string(), z.unknown()).optional(),
  transformOptions: z.record(z.string(), z.unknown()).optional(),
}).strict().optional();

const LitPluginOptionsSchema = z.object({
  compilerOptions: z.record(z.string(), z.unknown()).optional(),
  preprocess: z.unknown().optional(),
  absoluteImports: z.boolean().optional(),
  compileDebug: z.boolean().optional(),
  minify: z.boolean().optional(),
  polyfillsImport: z.array(z.string()).optional(),
}).strict().optional();

const PreactPluginOptionsSchema = z.object({
  devtoolsInProd: z.boolean().optional(),
  babel: z.object({
    plugins: z.array(z.unknown()).optional(),
    presets: z.array(z.unknown()).optional(),
  }).optional(),
  include: z.instanceof(RegExp).optional(),
  exclude: z.instanceof(RegExp).optional(),
}).strict().optional();

// Feature plugin options schemas
const CDNOptionsSchema = z.object({
  modules: z.array(z.string()).optional(),
  prodUrl: z.string().optional(),
  enableInDevMode: z.boolean().optional(),
  autoDetect: z.boolean().optional(),
  autoDetectDeps: z.enum(['dependencies', 'all', 'production']).optional(),
  autoDetectExclude: z.array(z.string()).optional(),
  autoDetectInclude: z.array(z.string()).optional(),
  cdnProvider: z.enum(['unpkg', 'jsdelivr', 'cdnjs', 'custom']).optional(),
  customProdUrl: z.string().optional(),
  generateScriptTag: z.function().optional(),
  generateCssLinkTag: z.function().optional(),
}).strict();

const CacheOptionsSchema = z.object({
  cacheDir: z.string().optional(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  strategy: z.object({
    hashAlgorithm: z.enum(['md5', 'sha1', 'sha256']).optional(),
    invalidateOn: z.array(z.string()).optional(),
    maxSize: z.number().optional(),
    maxAge: z.number().optional(),
  }).optional(),
}).strict();

const AnalyzeOptionsSchema = z.object({
  enabled: z.boolean().optional(),
  open: z.boolean().optional(),
  filename: z.string().optional(),
  template: z.enum(['treemap', 'sunburst', 'network']).optional(),
  gzipSize: z.boolean().optional(),
  brotliSize: z.boolean().optional(),
  sourcemap: z.boolean().optional(),
  exclude: z.array(z.union([z.string(), z.instanceof(RegExp)])).optional(),
}).strict();

const PWAOptionsSchema = z.object({
  registerType: z.enum(['prompt', 'autoUpdate']).optional(),
  workbox: z.object({
    globPatterns: z.array(z.string()).optional(),
    runtimeCaching: z.array(z.unknown()).optional(),
    skipWaiting: z.boolean().optional(),
    clientsClaim: z.boolean().optional(),
  }).optional(),
  manifest: z.object({
    name: z.string().optional(),
    short_name: z.string().optional(),
    description: z.string().optional(),
    theme_color: z.string().optional(),
    background_color: z.string().optional(),
    display: z.string().optional(),
    orientation: z.string().optional(),
    scope: z.string().optional(),
    start_url: z.string().optional(),
    icons: z.array(z.object({
      src: z.string(),
      sizes: z.string(),
      type: z.string(),
      purpose: z.string().optional(),
    })).optional(),
    shortcuts: z.array(z.object({
      name: z.string(),
      short_name: z.string().optional(),
      description: z.string().optional(),
      url: z.string(),
      icons: z.array(z.object({
        src: z.string(),
        sizes: z.string(),
      })).optional(),
    })).optional(),
  }).optional(),
  devOptions: z.object({
    enabled: z.boolean().optional(),
    type: z.string().optional(),
  }).optional(),
}).strict();

const CompressOptionsSchema = z.object({
  format: z.enum(['tar', 'tar.gz', 'zip']).optional(),
  outputDir: z.string().optional(),
  enabled: z.boolean().optional(),
  fileName: z.string().optional(),
}).strict();

// EnhanceFeatureConfig schema (nested within EnhanceConfig)
const EnhanceFeatureConfigSchema = z.object({
  preset: z.union([
    z.literal('app'),
    z.literal('lib'),
    PresetConfigSchema,
  ]).optional(),
  
  // Framework configurations
  vue: z.union([z.boolean(), VuePluginOptionsSchema]).optional(),
  react: z.union([z.boolean(), ReactPluginOptionsSchema]).optional(),
  svelte: z.union([z.boolean(), SveltePluginOptionsSchema]).optional(),
  solid: z.union([z.boolean(), SolidPluginOptionsSchema]).optional(),
  lit: z.union([z.boolean(), LitPluginOptionsSchema]).optional(),
  preact: z.union([z.boolean(), PreactPluginOptionsSchema]).optional(),
  
  // Feature configurations
  cdn: z.union([z.boolean(), CDNOptionsSchema]).optional(),
  cache: z.union([z.boolean(), CacheOptionsSchema]).optional(),
  analyze: z.union([z.boolean(), AnalyzeOptionsSchema]).optional(),
  pwa: z.union([z.boolean(), PWAOptionsSchema]).optional(),
  compress: z.union([z.boolean(), CompressOptionsSchema]).optional(),
}).strict();

// Main EnhanceConfig schema - matches the interface structure
export const EnhanceConfigSchema = z.object({
  // New nested structure
  enhance: EnhanceFeatureConfigSchema.optional(),
  
  // Vite native config
  vite: z.record(z.string(), z.unknown()).optional(),
  
  // Additional Vite plugins
  plugins: z.array(
    z.union([z.string(), EnhancePluginSchema, z.unknown()])
  ).optional(),
});

// Export sub-schemas for reuse
export {
  EnhanceFeatureConfigSchema,
  PresetConfigSchema,
  VuePluginOptionsSchema,
  ReactPluginOptionsSchema,
  SveltePluginOptionsSchema,
  SolidPluginOptionsSchema,
  LitPluginOptionsSchema,
  PreactPluginOptionsSchema,
  CDNOptionsSchema,
  CacheOptionsSchema,
  AnalyzeOptionsSchema,
  PWAOptionsSchema,
  CompressOptionsSchema,
};

import { z } from 'zod';
// Plugin schema - we'll use a custom validator since EnhancePlugin is complex
const EnhancePluginSchema = z.custom((val) => {
    if (typeof val !== 'object' || val === null)
        return false;
    const plugin = val;
    return typeof plugin.name === 'string';
}, {
    message: 'Invalid plugin object'
});
// Preset config schema
const PresetConfigSchema = z.object({
    name: z.string(),
    options: z.record(z.string(), z.unknown()).optional().nullable(),
});
// Framework plugin options schemas
const VuePluginOptionsSchema = z.object({
    script: z.object({
        defineModel: z.boolean().optional().nullable(),
    }).optional().nullable(),
}).optional().nullable();
const ReactPluginOptionsSchema = z.object({
    fastRefresh: z.boolean().optional().nullable(),
}).optional().nullable();
// Feature plugin options schemas
const CDNOptionsSchema = z.object({
    modules: z.array(z.string()).optional().nullable(),
    prodUrl: z.string().optional().nullable(),
});
const CacheOptionsSchema = z.object({
    cacheDir: z.string().optional().nullable(),
    include: z.array(z.string()).optional().nullable(),
    exclude: z.array(z.string()).optional().nullable(),
});
const AnalyzeOptionsSchema = z.object({
    open: z.boolean().optional().nullable(),
    filename: z.string().optional().nullable(),
});
const PWAOptionsSchema = z.object({
    manifest: z.record(z.string(), z.unknown()).optional().nullable(),
    workbox: z.record(z.string(), z.unknown()).optional().nullable(),
});
// Main EnhanceConfig schema
export const EnhanceConfigSchema = z.object({
    preset: z.union([
        z.literal('app'),
        z.literal('lib'),
        PresetConfigSchema,
    ]).optional().nullable(),
    plugins: z.array(z.union([z.string(), EnhancePluginSchema])).optional().nullable(),
    vite: z.record(z.string(), z.unknown()).optional().nullable(),
    // Framework specific configurations
    vue: VuePluginOptionsSchema,
    react: ReactPluginOptionsSchema,
    // Feature configurations
    cdn: z.union([z.boolean(), CDNOptionsSchema]).optional().nullable(),
    cache: z.union([z.boolean(), CacheOptionsSchema]).optional().nullable(),
    analyze: z.union([z.boolean(), AnalyzeOptionsSchema]).optional().nullable(),
    pwa: z.union([z.boolean(), PWAOptionsSchema]).optional().nullable(),
});
//# sourceMappingURL=schema.js.map
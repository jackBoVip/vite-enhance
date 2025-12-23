import { z } from 'zod';
import type { EnhancePlugin } from '@vite-enhance/shared';
export declare const EnhanceConfigSchema: z.ZodObject<{
    preset: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"app">, z.ZodLiteral<"lib">, z.ZodObject<{
        name: z.ZodString;
        options: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>]>>>;
    plugins: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodCustom<EnhancePlugin, EnhancePlugin>]>>>>;
    vite: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    vue: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        script: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            defineModel: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    react: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        fastRefresh: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    cdn: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        modules: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        prodUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>]>>>;
    cache: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        cacheDir: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        include: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        exclude: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>]>>>;
    analyze: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        open: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        filename: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>]>>>;
    pwa: z.ZodNullable<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
        manifest: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        workbox: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>]>>>;
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map
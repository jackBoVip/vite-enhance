import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { applyDefaults } from './defaults.js';
import type { EnhanceConfig } from '@vite-enhance/shared/types/config';

describe('Default Value Injection Properties', () => {
  /**
   * Property 7: Default Value Injection Idempotence
   * For any partial configuration, applying default values twice SHALL produce 
   * the same result as applying them once: 
   * applyDefaults(applyDefaults(config)) === applyDefaults(config).
   * Validates: Requirements 3.3
   */
  it('Property 7: Default Value Injection Idempotence', () => {
    // Generator for partial EnhanceConfig objects
    const partialConfigArb = fc.record({
      preset: fc.option(fc.oneof(
        fc.constant('app'),
        fc.constant('lib'),
        fc.record({
          name: fc.string(),
          options: fc.option(fc.dictionary(fc.string(), fc.anything()))
        })
      )),
      plugins: fc.option(fc.array(fc.string())),
      vite: fc.option(fc.dictionary(fc.string(), fc.anything())),
      vue: fc.option(fc.record({
        script: fc.option(fc.record({
          defineModel: fc.option(fc.boolean())
        }))
      })),
      react: fc.option(fc.record({
        fastRefresh: fc.option(fc.boolean())
      })),
      cdn: fc.option(fc.oneof(
        fc.boolean(),
        fc.record({
          modules: fc.option(fc.array(fc.string())),
          prodUrl: fc.option(fc.string())
        })
      )),
      cache: fc.option(fc.oneof(
        fc.boolean(),
        fc.record({
          cacheDir: fc.option(fc.string()),
          include: fc.option(fc.array(fc.string())),
          exclude: fc.option(fc.array(fc.string()))
        })
      )),
      analyze: fc.option(fc.oneof(
        fc.boolean(),
        fc.record({
          open: fc.option(fc.boolean()),
          filename: fc.option(fc.string())
        })
      )),
      pwa: fc.option(fc.oneof(
        fc.boolean(),
        fc.record({
          manifest: fc.option(fc.dictionary(fc.string(), fc.anything())),
          workbox: fc.option(fc.dictionary(fc.string(), fc.anything()))
        })
      ))
    }, { requiredKeys: [] });

    fc.assert(
      fc.property(partialConfigArb, (config) => {
        const onceApplied = applyDefaults(config);
        const twiceApplied = applyDefaults(onceApplied);
        
        // Applying defaults should be idempotent
        expect(twiceApplied).toEqual(onceApplied);
        
        // The result should always have default values for undefined fields
        expect(onceApplied.preset).toBeDefined();
        expect(onceApplied.plugins).toBeDefined();
        expect(onceApplied.cdn).toBeDefined();
        expect(onceApplied.cache).toBeDefined();
        expect(onceApplied.analyze).toBeDefined();
        expect(onceApplied.pwa).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});
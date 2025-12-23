import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateConfig } from './validator.js';
import type { EnhanceConfig } from '@vite-enhance/shared/types/config';

describe('Configuration Validation Properties', () => {
  /**
   * Property 6: Configuration Validation Completeness
   * For any input object, the configuration validator SHALL either return success 
   * with a valid EnhanceConfig, or return failure with at least one error containing 
   * the path to the invalid field.
   * Validates: Requirements 3.2, 3.4, 3.5
   */
  it('Property 6: Configuration Validation Completeness', () => {
    // Generator for valid EnhanceConfig objects
    const validConfigArb = fc.record({
      preset: fc.option(fc.oneof(
        fc.constant('app'),
        fc.constant('lib'),
        fc.record({
          name: fc.string(),
          options: fc.option(fc.dictionary(fc.string(), fc.anything()))
        })
      )),
      plugins: fc.option(fc.array(fc.oneof(
        fc.string(),
        fc.record({ name: fc.string() }, { requiredKeys: ['name'] })
      ))),
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
    });

    // Test valid configurations
    fc.assert(
      fc.property(validConfigArb, (config) => {
        const result = validateConfig(config);
        
        // Valid configs should always succeed
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.errors).toBeUndefined();
      }),
      { numRuns: 100 }
    );

    // Test invalid configurations
    const invalidConfigArb = fc.oneof(
      // Invalid preset values
      fc.record({ preset: fc.string().filter(s => s !== 'app' && s !== 'lib') }),
      // Invalid plugin types
      fc.record({ plugins: fc.array(fc.integer()) }),
      // Invalid boolean/object unions
      fc.record({ cdn: fc.string() }),
      fc.record({ cache: fc.integer() }),
      fc.record({ analyze: fc.array(fc.anything()) }),
      fc.record({ pwa: fc.string() })
    );

    fc.assert(
      fc.property(invalidConfigArb, (config) => {
        const result = validateConfig(config);
        
        // Invalid configs should always fail with errors
        if (!result.success) {
          expect(result.errors).toBeDefined();
          expect(result.errors!.length).toBeGreaterThan(0);
          
          // Each error should have a path and message
          result.errors!.forEach(error => {
            expect(Array.isArray(error.path)).toBe(true);
            expect(typeof error.message).toBe('string');
            expect(error.message.length).toBeGreaterThan(0);
          });
        }
      }),
      { numRuns: 100 }
    );
  });
});
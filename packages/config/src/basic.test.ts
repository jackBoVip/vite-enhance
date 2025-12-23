import { describe, it, expect } from 'vitest';
import { defineEnhanceConfig, validateConfig, applyDefaults, serializeConfig, deserializeConfig } from './index.js';

describe('Basic Config Package Functionality', () => {
  it('should define config with type safety', () => {
    const config = defineEnhanceConfig({
      preset: 'app',
      cdn: true,
      cache: false
    });
    
    expect(config.preset).toBe('app');
    expect(config.cdn).toBe(true);
    expect(config.cache).toBe(false);
  });

  it('should validate valid config', () => {
    const config = {
      preset: 'app',
      plugins: ['test-plugin'],
      cdn: true
    };
    
    const result = validateConfig(config);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(config);
  });

  it('should validate invalid config', () => {
    const config = {
      preset: 'invalid-preset'
    };
    
    const result = validateConfig(config);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it('should apply defaults correctly', () => {
    const config = applyDefaults({ preset: 'lib' });
    
    expect(config.preset).toBe('lib');
    expect(config.plugins).toEqual([]);
    expect(config.cdn).toBe(false);
    expect(config.cache).toBe(true);
    expect(config.analyze).toBe(false);
    expect(config.pwa).toBe(false);
  });

  it('should serialize and deserialize config', () => {
    const config = {
      preset: 'app' as const,
      cdn: true,
      cache: false,
      plugins: ['test-plugin']
    };
    
    const serialized = serializeConfig(config);
    expect(typeof serialized).toBe('string');
    
    const deserialized = deserializeConfig(serialized);
    expect(deserialized).toEqual(config);
  });

  it('should handle serialization errors', () => {
    expect(() => deserializeConfig('invalid json')).toThrow('Invalid JSON');
    expect(() => deserializeConfig('{"preset": "invalid"}')).toThrow('Invalid config');
  });
});
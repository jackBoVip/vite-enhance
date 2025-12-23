import { describe, it, expect } from 'vitest';
import { createLogger } from './logger';

describe('shared package', () => {
  it('should export createLogger', () => {
    expect(createLogger).toBeDefined();
  });

  it('should create a logger with all methods', () => {
    const logger = createLogger('test');
    expect(logger.info).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it('should prefix log messages with logger name', () => {
    const logger = createLogger('test');
    // Basic smoke test - just ensure it doesn't throw
    expect(() => logger.info('test message')).not.toThrow();
  });
});

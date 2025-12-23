import { describe, it, expect } from 'vitest';
import { createCDNPlugin } from './index.js';

describe('CDN Plugin', () => {
  it('should create plugin with default options', () => {
    const plugin = createCDNPlugin();
    
    expect(plugin.name).toBe('enhance:cdn');
    expect(plugin.version).toBe('0.2.0');
    expect(plugin.apply).toBe('build');
  });

  it('should create plugin with custom options', () => {
    const plugin = createCDNPlugin({
      modules: ['vue', 'react'],
      prodUrl: 'https://cdn.jsdelivr.net',
      enableInDevMode: true,
    });
    
    expect(plugin.name).toBe('enhance:cdn');
    expect(plugin.apply).toBe('both');
  });

  it('should handle null options gracefully', () => {
    const plugin = createCDNPlugin(null);
    
    expect(plugin.name).toBe('enhance:cdn');
    expect(plugin.apply).toBe('build');
  });

  it('should generate vite plugins', () => {
    const plugin = createCDNPlugin({
      modules: ['vue', 'react'],
    });
    
    const vitePlugins = plugin.vitePlugin?.();
    expect(Array.isArray(vitePlugins)).toBe(true);
    expect(vitePlugins).toHaveLength(1);
    expect(vitePlugins?.[0]?.name).toBe('vite:enhance-cdn');
  });
});
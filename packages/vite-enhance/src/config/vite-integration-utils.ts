import type { EnhanceFeatureConfig } from '../shared/index.js';
import { detectPreset, createPresetPlugins } from './vite-integration-helpers.js';

/**
 * Normalize config to handle both new nested and legacy flat structures
 */
export function normalizeConfig(config: any): EnhanceFeatureConfig {
  // If using new nested structure, use it directly
  if (config.enhance) {
    let normalized: any = { ...config.enhance };
    
    // Auto-detect preset if not explicitly provided
    if (normalized.preset === undefined) {
      normalized.preset = detectPreset();
    }
    
    return normalized;
  }
  
  // Otherwise, convert legacy flat structure to nested structure
  const normalized: any = {};
  
  if (config.preset !== undefined) normalized.preset = config.preset;
  if (config.vue !== undefined) normalized.vue = config.vue;
  if (config.react !== undefined) normalized.react = config.react;
  if (config.cdn !== undefined) normalized.cdn = config.cdn;
  if (config.cache !== undefined) normalized.cache = config.cache;
  if (config.analyze !== undefined) normalized.analyze = config.analyze;
  if (config.pwa !== undefined) normalized.pwa = config.pwa;
  
  // Auto-detect preset if not explicitly provided
  if (normalized.preset === undefined) {
    normalized.preset = detectPreset();
  }
  
  return normalized;
}

/**
 * Create Vite plugins from normalized EnhanceConfig
 */
export function createEnhancePlugins(config: EnhanceFeatureConfig): any[] {
  const plugins: any[] = [];

  // Add preset plugins
  if (config.preset) {
    plugins.push(...createPresetPlugins(config.preset, config));
  }

  return plugins;
}
import type { ResolvedEnhanceConfig } from './config.js';

export interface BuildContext {
  config: ResolvedEnhanceConfig;
  startTime: number;
  endTime?: number;
}
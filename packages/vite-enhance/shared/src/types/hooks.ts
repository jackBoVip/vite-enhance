import type { ResolvedEnhanceConfig } from './config';

export interface BuildContext {
  config: ResolvedEnhanceConfig;
  startTime: number;
  endTime?: number;
}
import { EnhanceConfigSchema } from './schema.js';
import type { EnhanceConfig } from '@vite-enhance/shared';

export interface ValidationResult {
  success: boolean;
  data?: EnhanceConfig;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string[];
  message: string;
}

/**
 * Validate an enhance configuration against the schema
 * @param config - The configuration to validate
 * @returns Validation result with success status and data or errors
 */
export function validateConfig(config: unknown): ValidationResult {
  const result = EnhanceConfigSchema.safeParse(config);
  
  if (result.success) {
    return { 
      success: true, 
      data: result.data as EnhanceConfig 
    };
  }
  
  return {
    success: false,
    errors: result.error.issues.map(issue => ({
      path: issue.path.map(String),
      message: issue.message,
    })),
  };
}
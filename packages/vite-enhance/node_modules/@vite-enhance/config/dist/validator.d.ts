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
export declare function validateConfig(config: unknown): ValidationResult;
//# sourceMappingURL=validator.d.ts.map
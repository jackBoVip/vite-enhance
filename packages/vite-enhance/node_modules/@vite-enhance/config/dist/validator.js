import { EnhanceConfigSchema } from './schema.js';
/**
 * Validate an enhance configuration against the schema
 * @param config - The configuration to validate
 * @returns Validation result with success status and data or errors
 */
export function validateConfig(config) {
    const result = EnhanceConfigSchema.safeParse(config);
    if (result.success) {
        return {
            success: true,
            data: result.data
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
//# sourceMappingURL=validator.js.map
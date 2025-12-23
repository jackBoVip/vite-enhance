import { validateConfig } from './validator.js';
/**
 * Serialize an enhance configuration to JSON format
 * @param config - The configuration to serialize
 * @returns JSON string representation of the configuration
 */
export function serializeConfig(config) {
    return JSON.stringify(config, null, 2);
}
/**
 * Deserialize a JSON string back to an enhance configuration
 * @param json - The JSON string to deserialize
 * @returns The deserialized configuration object
 * @throws Error if the JSON is invalid or the configuration doesn't pass validation
 */
export function deserializeConfig(json) {
    let parsed;
    try {
        parsed = JSON.parse(json);
    }
    catch (error) {
        throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    const result = validateConfig(parsed);
    if (!result.success) {
        const errorMessages = result.errors?.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(`Invalid config: ${errorMessages}`);
    }
    return result.data;
}
//# sourceMappingURL=serializer.js.map
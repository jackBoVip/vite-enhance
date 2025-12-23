import type { EnhanceConfig } from '@vite-enhance/shared';
/**
 * Serialize an enhance configuration to JSON format
 * @param config - The configuration to serialize
 * @returns JSON string representation of the configuration
 */
export declare function serializeConfig(config: EnhanceConfig): string;
/**
 * Deserialize a JSON string back to an enhance configuration
 * @param json - The JSON string to deserialize
 * @returns The deserialized configuration object
 * @throws Error if the JSON is invalid or the configuration doesn't pass validation
 */
export declare function deserializeConfig(json: string): EnhanceConfig;
//# sourceMappingURL=serializer.d.ts.map
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Cached package.json data
 */
interface PackageJsonCache {
  data: PackageJson | null;
  root: string;
  timestamp: number;
}

export interface PackageJson {
  name?: string;
  version?: string;
  main?: string;
  module?: string;
  types?: string;
  typings?: string;
  exports?: Record<string, unknown> | string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  browser?: string | Record<string, string | false>;
  [key: string]: unknown;
}

// Cache with 5 second TTL to handle watch mode
const CACHE_TTL = 5000;
let packageJsonCache: PackageJsonCache = {
  data: null,
  root: '',
  timestamp: 0,
};

/**
 * Get package.json with caching
 * @param root - Project root directory
 * @returns Parsed package.json or null if not found
 */
export function getPackageJson(root: string = process.cwd()): PackageJson | null {
  const now = Date.now();
  
  // Return cached if valid
  if (
    packageJsonCache.root === root &&
    packageJsonCache.data !== null &&
    now - packageJsonCache.timestamp < CACHE_TTL
  ) {
    return packageJsonCache.data;
  }
  
  try {
    const packageJsonPath = path.join(root, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      packageJsonCache = { data: null, root, timestamp: now };
      return null;
    }
    
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const parsed = JSON.parse(content);
    
    // Validate parsed result is an object (not null, array, or primitive)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      if (process.env.DEBUG) {
        console.debug('[vite-enhance] Invalid package.json format: not an object');
      }
      packageJsonCache = { data: null, root, timestamp: now };
      return null;
    }
    
    const data = parsed as PackageJson;
    packageJsonCache = { data, root, timestamp: now };
    return data;
  } catch (error) {
    if (process.env.DEBUG) {
      console.debug('[vite-enhance] Failed to read package.json:', error);
    }
    packageJsonCache = { data: null, root, timestamp: now };
    return null;
  }
}

/**
 * Clear the package.json cache
 */
export function clearPackageCache(): void {
  packageJsonCache = { data: null, root: '', timestamp: 0 };
}

/**
 * Get all dependencies from package.json
 */
export function getAllDependencies(root?: string): Record<string, string> {
  const pkg = getPackageJson(root);
  if (!pkg) return {};
  
  return {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };
}

/**
 * Get production dependencies only
 */
export function getProductionDependencies(root?: string): Record<string, string> {
  const pkg = getPackageJson(root);
  if (!pkg) return {};
  
  return {
    ...(pkg.dependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };
}

/**
 * Sanitize package name for use in file names
 */
export function sanitizePackageName(name: string): string {
  return name.replace(/[@\/]/g, '-').replace(/[^a-zA-Z0-9\-_.]/g, '');
}

/**
 * Get sanitized package name from package.json
 */
export function getPackageName(root?: string): string {
  const pkg = getPackageJson(root);
  return sanitizePackageName(pkg?.name || 'package');
}

/**
 * Check if a dependency exists
 */
export function hasDependency(name: string, root?: string): boolean {
  const deps = getAllDependencies(root);
  return name in deps;
}

/**
 * Check if any of the dependencies exist
 */
export function hasAnyDependency(names: string[], root?: string): boolean {
  const deps = getAllDependencies(root);
  return names.some(name => name in deps);
}

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, CacheOptions } from '../../shared';

export interface CreateCachePluginOptions extends CacheOptions {
  // Additional options specific to the enhance plugin
}

interface CacheManifest {
  version: string;
  files: Map<string, FileInfo>;
  metadata: {
    created: number;
    lastModified: number;
    nodeVersion: string;
  };
}

interface FileInfo {
  hash: string;
  size: number;
  mtime: number;
}

/**
 * High-performance cache plugin with intelligent invalidation
 */
export function createCachePlugin(options: CreateCachePluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options ?? {};
  const {
    cacheDir = 'node_modules/.vite-enhance/cache',
    include = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue', '**/*.css', '**/*.scss'],
    exclude = ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/coverage/**'],
  } = safeOptions;

  let cacheManifest: CacheManifest = {
    version: '2.0.0',
    files: new Map(),
    metadata: {
      created: Date.now(),
      lastModified: Date.now(),
      nodeVersion: process.version,
    },
  };
  
  let manifestPath: string;
  let hasChanges = false;
  
  // Performance optimizations
  const fileHashCache = new Map<string, string>();

  return {
    name: 'enhance:cache',
    version: '0.2.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      return [
        {
          name: 'vite:enhance-cache',
          apply: 'build',
          
          configResolved(config) {
            manifestPath = join(config.root, cacheDir, 'manifest.json');
            
            // Ensure cache directory exists
            const cacheDirPath = join(config.root, cacheDir);
            if (!existsSync(cacheDirPath)) {
              mkdirSync(cacheDirPath, { recursive: true });
            }
            
            // Load existing cache manifest with validation
            loadCacheManifest();
          },
          
          buildStart() {
            console.log(`[vek:cache] Cache initialized with ${cacheManifest.files.size} cached files`);
          },
          
          load(id) {
            // Skip virtual modules and node_modules
            if (id.startsWith('\0') || id.includes('node_modules')) {
              return null;
            }
            
            // Check if file should be cached
            if (shouldCache(id, include, exclude)) {
              const cacheResult = checkFileCache(id);
              
              if (cacheResult.hit) {
                console.log(`[vek:cache] Cache hit: ${relative(process.cwd(), id)}`);
              } else {
                console.log(`[vek:cache] Cache miss: ${relative(process.cwd(), id)}`);
                hasChanges = true;
              }
            }
            
            return null; // Let Vite handle the actual loading
          },
          
          buildEnd() {
            // Save updated cache manifest with metadata
            if (hasChanges) {
              saveCacheManifest();
            }
          },
          
          closeBundle() {
            // Clean up old cache entries
            cleanupOldEntries();
          },
        },
      ];
    },
    
    configResolved(_config) {
      console.log('[vek:cache] Enhanced build cache plugin initialized');
      console.log(`[vek:cache] Cache directory: ${cacheDir}`);
      console.log(`[vek:cache] Include patterns: ${include.join(', ')}`);
      console.log(`[vek:cache] Exclude patterns: ${exclude.join(', ')}`);
    },
  };

  /**
   * Load cache manifest with error handling and migration
   */
  function loadCacheManifest(): void {
    if (!existsSync(manifestPath)) {
      return;
    }
    
    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const parsed = JSON.parse(content);
      
      // Handle legacy format migration
      if (parsed.version === '1.0.0') {
        migrateLegacyManifest(parsed);
      } else {
        // Convert plain object back to Map
        cacheManifest = {
          ...parsed,
          files: new Map(Object.entries(parsed.files || {})),
        };
      }
      
      console.log('[vek:cache] Loaded cache manifest');
    } catch (error) {
      console.warn('[vek:cache] Failed to load cache manifest, starting fresh:', error);
      cacheManifest.files.clear();
    }
  }

  /**
   * Save cache manifest with optimized serialization
   */
  function saveCacheManifest(): void {
    try {
      cacheManifest.metadata.lastModified = Date.now();
      
      // Convert Map to plain object for JSON serialization
      const serializable = {
        ...cacheManifest,
        files: Object.fromEntries(cacheManifest.files),
      };
      
      writeFileSync(manifestPath, JSON.stringify(serializable, null, 2));
      console.log(`[vek:cache] Cache manifest updated with ${cacheManifest.files.size} entries`);
    } catch (error) {
      console.warn('[vek:cache] Failed to save cache manifest:', error);
    }
  }

  /**
   * Migrate legacy manifest format
   */
  function migrateLegacyManifest(legacy: any): void {
    console.log('[vek:cache] Migrating legacy cache manifest');
    cacheManifest.files.clear();
    
    if (legacy.files && typeof legacy.files === 'object') {
      for (const [filePath, hash] of Object.entries(legacy.files)) {
        if (typeof hash === 'string') {
          try {
            const stats = statSync(filePath);
            cacheManifest.files.set(filePath, {
              hash,
              size: stats.size,
              mtime: stats.mtimeMs,
            });
          } catch {
            // File no longer exists, skip
          }
        }
      }
    }
  }

  /**
   * Check file cache with intelligent invalidation
   */
  function checkFileCache(filePath: string): { hit: boolean; info?: FileInfo } {
    try {
      const stats = statSync(filePath);
      const cachedInfo = cacheManifest.files.get(filePath);
      
      if (!cachedInfo) {
        // New file, compute hash and cache
        const hash = computeFileHash(filePath);
        const info: FileInfo = {
          hash,
          size: stats.size,
          mtime: stats.mtimeMs,
        };
        cacheManifest.files.set(filePath, info);
        return { hit: false, info };
      }
      
      // Check if file has changed using multiple heuristics
      if (stats.mtimeMs !== cachedInfo.mtime || stats.size !== cachedInfo.size) {
        // File modified, recompute hash
        const hash = computeFileHash(filePath);
        const info: FileInfo = {
          hash,
          size: stats.size,
          mtime: stats.mtimeMs,
        };
        cacheManifest.files.set(filePath, info);
        return { hit: hash === cachedInfo.hash, info };
      }
      
      // File unchanged based on mtime and size
      return { hit: true, info: cachedInfo };
    } catch (error) {
      // File doesn't exist or can't be accessed
      cacheManifest.files.delete(filePath);
      return { hit: false };
    }
  }

  /**
   * Compute file hash with caching
   */
  function computeFileHash(filePath: string): string {
    // Check in-memory cache first
    const cached = fileHashCache.get(filePath);
    if (cached) {
      return cached;
    }
    
    try {
      const content = readFileSync(filePath);
      const hash = createHash('sha256').update(content).digest('hex').slice(0, 16);
      
      // Cache the hash (with size limit to prevent memory leaks)
      if (fileHashCache.size < 10000) {
        fileHashCache.set(filePath, hash);
      }
      
      return hash;
    } catch (error) {
      console.warn(`[vek:cache] Failed to hash file ${filePath}:`, error);
      return '';
    }
  }

  /**
   * Clean up old cache entries for files that no longer exist
   */
  function cleanupOldEntries(): void {
    const filesToRemove: string[] = [];
    
    for (const filePath of cacheManifest.files.keys()) {
      if (!existsSync(filePath)) {
        filesToRemove.push(filePath);
      }
    }
    
    if (filesToRemove.length > 0) {
      for (const filePath of filesToRemove) {
        cacheManifest.files.delete(filePath);
      }
      console.log(`[vek:cache] Cleaned up ${filesToRemove.length} stale cache entries`);
      hasChanges = true;
    }
  }
}

/**
 * Optimized pattern matching with caching
 */
function shouldCache(filePath: string, include: readonly string[], exclude: readonly string[]): boolean {
  // Check exclude patterns first (more likely to match)
  for (const pattern of exclude) {
    if (matchesPattern(pattern, filePath)) {
      return false;
    }
  }
  
  // Check include patterns
  for (const pattern of include) {
    if (matchesPattern(pattern, filePath)) {
      return true;
    }
  }
  
  return false;
}

// Module-level pattern cache for better performance
const patternCache = new Map<string, RegExp>();

/**
 * Pattern matching with regex caching for performance
 */
function matchesPattern(pattern: string, filePath: string): boolean {
  let regex = patternCache.get(pattern);
  if (!regex) {
    // Convert glob pattern to regex with proper escaping
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
      .replace(/\*\*/g, '.*') // ** matches any path
      .replace(/\*/g, '[^/]*'); // * matches any filename chars
    
    regex = new RegExp(`^${regexPattern}$`);
    
    // Cache with size limit
    if (patternCache.size < 100) {
      patternCache.set(pattern, regex);
    }
  }
  
  return regex.test(filePath);
}

export default createCachePlugin;
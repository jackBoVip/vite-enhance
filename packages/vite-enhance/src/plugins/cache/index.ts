import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin as VitePlugin } from 'vite';
import type { EnhancePlugin, CacheOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';

const logger = createLogger('cache');

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

// Module-level pattern cache with size limit
const MAX_PATTERN_CACHE_SIZE = 100;
const patternCache = new Map<string, RegExp>();

/**
 * Clear pattern cache (useful for testing or memory management)
 */
export function clearPatternCache(): void {
  patternCache.clear();
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
    strategy = {},
  } = safeOptions;

  const maxCacheSize = strategy.maxSize ?? 50000; // Max 50k files
  
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
  
  // Per-build hash cache (cleared after each build)
  const fileHashCache = new Map<string, string>();
  const MAX_HASH_CACHE_SIZE = 10000;

  return {
    name: 'enhance:cache',
    version: '0.4.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      return [
        {
          name: 'vite:enhance-cache',
          apply: 'build',
          
          configResolved(config) {
            manifestPath = join(config.root, cacheDir, 'manifest.json');
            
            const cacheDirPath = join(config.root, cacheDir);
            if (!existsSync(cacheDirPath)) {
              mkdirSync(cacheDirPath, { recursive: true });
            }
            
            loadCacheManifest();
          },
          
          buildStart() {
            // Clear per-build caches
            fileHashCache.clear();
            hasChanges = false;
            logger.info(`Cache initialized (${cacheManifest.files.size} entries)`);
          },
          
          load(id) {
            if (id.startsWith('\0') || id.includes('node_modules')) {
              return null;
            }
            
            if (shouldCache(id, include, exclude)) {
              const cacheResult = checkFileCache(id);
              
              if (cacheResult.hit) {
                logger.debug(`Cache hit: ${relative(process.cwd(), id)}`);
              } else {
                logger.debug(`Cache miss: ${relative(process.cwd(), id)}`);
                hasChanges = true;
              }
            }
            
            return null;
          },
          
          buildEnd() {
            // Clear per-build hash cache
            fileHashCache.clear();
            
            if (hasChanges) {
              saveCacheManifest();
            }
          },
          
          closeBundle() {
            cleanupOldEntries();
            enforceSizeLimit();
          },
        },
      ];
    },
    
    configResolved() {
      logger.info(`Cache directory: ${cacheDir}`);
    },
  };

  function loadCacheManifest(): void {
    if (!existsSync(manifestPath)) return;
    
    try {
      const content = readFileSync(manifestPath, 'utf-8');
      const parsed = JSON.parse(content) as Record<string, unknown>;
      
      // Validate parsed data
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid manifest format');
      }
      
      if (parsed.version === '1.0.0') {
        migrateLegacyManifest(parsed);
      } else {
        const files = parsed.files;
        cacheManifest = {
          version: String(parsed.version ?? '2.0.0'),
          files: new Map(
            files && typeof files === 'object' 
              ? Object.entries(files as Record<string, FileInfo>)
              : []
          ),
          metadata: {
            created: Number(parsed.metadata && (parsed.metadata as Record<string, unknown>).created) || Date.now(),
            lastModified: Number(parsed.metadata && (parsed.metadata as Record<string, unknown>).lastModified) || Date.now(),
            nodeVersion: String(parsed.metadata && (parsed.metadata as Record<string, unknown>).nodeVersion) || process.version,
          },
        };
      }
      
      logger.debug(`Loaded cache manifest (${cacheManifest.files.size} entries)`);
    } catch (error) {
      logger.warn('Failed to load cache manifest, starting fresh:', error instanceof Error ? error.message : 'Unknown error');
      cacheManifest.files.clear();
    }
  }

  function saveCacheManifest(): void {
    try {
      cacheManifest.metadata.lastModified = Date.now();
      
      const serializable = {
        version: cacheManifest.version,
        metadata: cacheManifest.metadata,
        files: Object.fromEntries(cacheManifest.files),
      };
      
      writeFileSync(manifestPath, JSON.stringify(serializable, null, 2));
      logger.success(`Cache manifest saved (${cacheManifest.files.size} entries)`);
    } catch (error) {
      logger.error('Failed to save cache manifest:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  function migrateLegacyManifest(legacy: Record<string, unknown>): void {
    logger.info('Migrating legacy cache manifest');
    cacheManifest.files.clear();
    
    const files = legacy.files as Record<string, string> | undefined;
    if (files && typeof files === 'object') {
      for (const [filePath, hash] of Object.entries(files)) {
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
            logger.debug(`Skipping missing file during migration: ${filePath}`);
          }
        }
      }
    }
    
    hasChanges = true;
  }

  function checkFileCache(filePath: string): { hit: boolean; info?: FileInfo } {
    try {
      const stats = statSync(filePath);
      const cachedInfo = cacheManifest.files.get(filePath);
      
      // New file - cache miss
      if (!cachedInfo) {
        const hash = computeFileHash(filePath);
        const info: FileInfo = { hash, size: stats.size, mtime: stats.mtimeMs };
        cacheManifest.files.set(filePath, info);
        return { hit: false, info };
      }
      
      // File metadata changed - need to verify hash
      if (stats.mtimeMs !== cachedInfo.mtime || stats.size !== cachedInfo.size) {
        const newHash = computeFileHash(filePath);
        const info: FileInfo = { hash: newHash, size: stats.size, mtime: stats.mtimeMs };
        cacheManifest.files.set(filePath, info);
        
        // Content unchanged (same hash) - cache hit
        // Content changed (different hash) - cache miss
        return { hit: newHash === cachedInfo.hash, info };
      }
      
      // File metadata unchanged - cache hit
      return { hit: true, info: cachedInfo };
    } catch (error) {
      // File read error - remove from cache
      cacheManifest.files.delete(filePath);
      logger.debug(`File access error, removed from cache: ${filePath}`);
      return { hit: false };
    }
  }

  function computeFileHash(filePath: string): string {
    // Check per-build cache first
    const cached = fileHashCache.get(filePath);
    if (cached) return cached;
    
    try {
      const content = readFileSync(filePath);
      const hash = createHash('sha256').update(content).digest('hex').slice(0, 16);
      
      // LRU-like behavior: clear oldest entries when limit reached
      if (fileHashCache.size >= MAX_HASH_CACHE_SIZE) {
        const firstKey = fileHashCache.keys().next().value;
        if (firstKey) fileHashCache.delete(firstKey);
      }
      
      fileHashCache.set(filePath, hash);
      return hash;
    } catch (error) {
      logger.debug(`Failed to compute hash for: ${filePath}`);
      return '';
    }
  }

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
      logger.info(`Cleaned up ${filesToRemove.length} stale cache entries`);
      hasChanges = true;
    }
  }

  function enforceSizeLimit(): void {
    if (cacheManifest.files.size <= maxCacheSize) return;
    
    // Remove oldest entries (FIFO)
    const entriesToRemove = cacheManifest.files.size - maxCacheSize;
    const keys = Array.from(cacheManifest.files.keys()).slice(0, entriesToRemove);
    
    for (const key of keys) {
      cacheManifest.files.delete(key);
    }
    
    logger.info(`Enforced cache size limit, removed ${entriesToRemove} oldest entries`);
    hasChanges = true;
  }
}

function shouldCache(filePath: string, include: readonly string[], exclude: readonly string[]): boolean {
  // Check exclusions first (more specific)
  for (const pattern of exclude) {
    if (matchesPattern(pattern, filePath)) return false;
  }
  
  // Check inclusions
  for (const pattern of include) {
    if (matchesPattern(pattern, filePath)) return true;
  }
  
  return false;
}

function matchesPattern(pattern: string, filePath: string): boolean {
  let regex = patternCache.get(pattern);
  
  if (!regex) {
    // Escape special regex characters except * and **
    const regexPattern = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '<<<GLOBSTAR>>>')
      .replace(/\*/g, '[^/\\\\]*')
      .replace(/<<<GLOBSTAR>>>/g, '.*');
    
    regex = new RegExp(`^${regexPattern}$`);
    
    // LRU-like behavior for pattern cache
    if (patternCache.size >= MAX_PATTERN_CACHE_SIZE) {
      const firstKey = patternCache.keys().next().value;
      if (firstKey) patternCache.delete(firstKey);
    }
    
    patternCache.set(pattern, regex);
  }
  
  return regex.test(filePath);
}

export default createCachePlugin;

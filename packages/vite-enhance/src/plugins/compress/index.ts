import type { Plugin as VitePlugin } from 'vite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as tar from 'tar';
import archiver from 'archiver';
import type { EnhancePlugin, CompressOptions } from '../../shared/index.js';
import { createLogger } from '../../shared/logger.js';
import { getPackageName } from '../../shared/package-utils.js';

const logger = createLogger('compress');

export interface CreateCompressPluginOptions extends CompressOptions {
  // Additional options specific to the enhance plugin
}

/**
 * Create tar archive (uncompressed)
 */
async function createTarArchive(sourceDir: string, outputFile: string): Promise<void> {
  try {
    await tar.create(
      {
        gzip: false,
        file: outputFile,
        cwd: path.dirname(sourceDir),
      },
      [path.basename(sourceDir)]
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create tar archive: ${message}`);
  }
}

/**
 * Create tar.gz archive (gzip compressed)
 */
async function createTarGzArchive(sourceDir: string, outputFile: string): Promise<void> {
  try {
    await tar.create(
      {
        gzip: true,
        file: outputFile,
        cwd: path.dirname(sourceDir),
      },
      [path.basename(sourceDir)]
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create tar.gz archive: ${message}`);
  }
}

/**
 * Create zip archive
 */
async function createZipArchive(sourceDir: string, outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    let resolved = false;
    
    // Event handlers
    const onClose = () => {
      if (!resolved) {
        resolved = true;
        removeListeners();
        resolve();
      }
    };
    
    const onError = (err: Error) => {
      if (!resolved) {
        resolved = true;
        removeListeners();
        archive.abort();
        output.destroy();
        reject(new Error(`Failed to create zip archive: ${err.message}`));
      }
    };
    
    const onWarning = (err: Error & { code?: string }) => {
      if (err.code !== 'ENOENT') {
        logger.warn('Archive warning:', err.message);
      }
    };
    
    // Remove all listeners to prevent memory leaks
    const removeListeners = () => {
      output.removeListener('close', onClose);
      output.removeListener('error', onError);
      archive.removeListener('error', onError);
      archive.removeListener('warning', onWarning);
    };

    // Register event listeners
    output.on('close', onClose);
    output.on('error', onError);
    archive.on('error', onError);
    archive.on('warning', onWarning);

    archive.pipe(output);
    archive.directory(sourceDir, path.basename(sourceDir));
    archive.finalize();
  });
}

/**
 * Creates a compress plugin for Vite Enhance Kit
 * Compresses build artifacts into tar, tar.gz, or zip format
 */
export function createCompressPlugin(options: CreateCompressPluginOptions | null = {}): EnhancePlugin {
  const safeOptions = options ?? {};
  const {
    format = 'tar',
    outputDir = 'dist/lib',
    enabled = true,
    fileName,
  } = safeOptions;

  let outDir: string | undefined;
  let packageName: string;

  return {
    name: 'enhance:compress',
    version: '0.4.0',
    apply: 'build',
    
    vitePlugin(): VitePlugin[] {
      return [
        {
          name: 'vite:enhance-compress',
          apply: 'build',

          configResolved(config) {
            outDir = config.build.outDir;
            packageName = fileName || getPackageName();
          },

          async closeBundle() {
            if (!enabled) {
              logger.debug('Compression disabled');
              return;
            }

            try {
              // Ensure output directory exists
              const libDir = path.resolve(process.cwd(), outputDir);
              if (!fs.existsSync(libDir)) {
                fs.mkdirSync(libDir, { recursive: true });
              }

              // Source directory - ensure outDir is defined
              if (!outDir) {
                logger.warn('Build output directory not configured');
                return;
              }
              
              const sourceDir = path.resolve(process.cwd(), outDir);
              
              if (!fs.existsSync(sourceDir)) {
                logger.warn(`Source directory not found: ${sourceDir}`);
                return;
              }

              // Output file
              const ext = format === 'tar.gz' ? 'tar.gz' : format;
              const outputFile = path.join(libDir, `${packageName}.${ext}`);

              logger.info(`Compressing to ${format} format...`);
              
              switch (format) {
                case 'tar':
                  await createTarArchive(sourceDir, outputFile);
                  break;
                case 'tar.gz':
                  await createTarGzArchive(sourceDir, outputFile);
                  break;
                case 'zip':
                  await createZipArchive(sourceDir, outputFile);
                  break;
              }

              // Verify output file exists before getting stats
              if (!fs.existsSync(outputFile)) {
                logger.error('Compression completed but output file not found');
                return;
              }
              
              const stats = fs.statSync(outputFile);
              const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
              
              logger.success(`Compressed: ${outputFile} (${sizeMB} MB)`);
            } catch (error) {
              logger.error('Compression failed:', error);
            }
          },
        },
      ];
    },
    
    configResolved() {
      if (enabled) {
        logger.info(`Compress plugin initialized (format: ${format})`);
      }
    },
  };
}

// Legacy export for backward compatibility
export const compressPlugin = (options: CompressOptions = {}): VitePlugin => {
  const plugin = createCompressPlugin(options);
  const vitePlugins = plugin.vitePlugin?.();
  if (Array.isArray(vitePlugins) && vitePlugins.length > 0) {
    return vitePlugins[0];
  }
  if (vitePlugins && !Array.isArray(vitePlugins)) {
    return vitePlugins;
  }
  return { name: 'vite:enhance-compress-noop' };
};

export default createCompressPlugin;

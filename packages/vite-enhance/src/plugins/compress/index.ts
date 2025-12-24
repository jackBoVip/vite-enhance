import type { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import * as tar from 'tar';
import archiver from 'archiver';

export interface CompressOptions {
  /**
   * 压缩格式
   * @default 'tar'
   */
  format?: 'tar' | 'tar.gz' | 'zip';
  
  /**
   * 输出目录
   * @default 'dist/lib'
   */
  outputDir?: string;
  
  /**
   * 是否启用压缩插件
   * @default true
   */
  enabled?: boolean;
  
  /**
   * 自定义压缩文件名（不含扩展名）
   * 默认使用包名
   */
  fileName?: string;
}

/**
 * 从包名中移除特殊字符
 */
function sanitizePackageName(name: string): string {
  return name.replace(/[@\/]/g, '-').replace(/[^a-zA-Z0-9\-_.]/g, '');
}

/**
 * 获取包名
 */
function getPackageName(): string {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return sanitizePackageName(packageJson.name || 'package');
    }
  } catch (error) {
    console.warn('[vite-enhance] Failed to read package.json:', error);
  }
  return 'package';
}

/**
 * 创建 tar 压缩包（不压缩）
 */
async function createTarArchive(sourceDir: string, outputFile: string): Promise<void> {
  await tar.create(
    {
      gzip: false,
      file: outputFile,
      cwd: path.dirname(sourceDir),
    },
    [path.basename(sourceDir)]
  );
}

/**
 * 创建 tar.gz 压缩包（gzip 压缩）
 */
async function createTarGzArchive(sourceDir: string, outputFile: string): Promise<void> {
  await tar.create(
    {
      gzip: true,
      file: outputFile,
      cwd: path.dirname(sourceDir),
    },
    [path.basename(sourceDir)]
  );
}

/**
 * 创建 zip 压缩包
 */
async function createZipArchive(sourceDir: string, outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      resolve();
    });

    archive.on('error', (err: any) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, path.basename(sourceDir));
    archive.finalize();
  });
}

/**
 * 压缩插件
 */
export function compressPlugin(options: CompressOptions = {}): Plugin {
  const {
    format = 'tar',
    outputDir = 'dist/lib',
    enabled = true,
    fileName,
  } = options;

  let outDir: string;
  let packageName: string;

  return {
    name: 'vite-enhance:compress',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir;
      packageName = fileName || getPackageName();
    },

    async closeBundle() {
      if (!enabled) {
        return;
      }

      try {
        // 确保输出目录存在
        const libDir = path.resolve(process.cwd(), outputDir);
        if (!fs.existsSync(libDir)) {
          fs.mkdirSync(libDir, { recursive: true });
        }

        // 源目录（dist/包名）
        const sourceDir = path.resolve(process.cwd(), outDir);
        
        // 检查源目录是否存在
        if (!fs.existsSync(sourceDir)) {
          console.warn(`[vite-enhance] Source directory not found: ${sourceDir}`);
          return;
        }

        // 压缩文件路径
        const ext = format === 'tar.gz' ? 'tar.gz' : format === 'zip' ? 'zip' : 'tar';
        const outputFile = path.join(libDir, `${packageName}.${ext}`);

        console.log(`[vite-enhance] Compressing to ${format} format...`);
        
        if (format === 'tar') {
          await createTarArchive(sourceDir, outputFile);
        } else if (format === 'tar.gz') {
          await createTarGzArchive(sourceDir, outputFile);
        } else {
          await createZipArchive(sourceDir, outputFile);
        }

        const stats = fs.statSync(outputFile);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        
        console.log(`[vite-enhance] ✓ Compressed successfully: ${outputFile} (${sizeMB} MB)`);
      } catch (error: any) {
        console.error('[vite-enhance] Compression failed:', error?.message || error);
      }
    },
  };
}

export default compressPlugin;

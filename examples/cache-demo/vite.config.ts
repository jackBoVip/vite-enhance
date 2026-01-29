import { defineEnhanceConfig } from 'vite-enhance'

// 缓存功能示例 - 测试构建缓存加速
export default defineEnhanceConfig({
  enhance: {
    // 缓存配置
    cache: {
      // 缓存目录
      cacheDir: 'node_modules/.vite-cache',
      
      // 包含的文件模式（默认所有）
      include: ['src/**/*', 'public/**/*'],
      
      // 排除的文件模式
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
      
      // 缓存策略
      strategy: {
        // 哈希算法
        hashAlgorithm: 'md5', // 'md5' | 'sha1' | 'sha256'
        
        // 触发缓存失效的文件
        invalidateOn: [
          'package.json',
          'vite.config.ts',
          'tsconfig.json',
        ],
        
        // 最大缓存大小（条目数）
        maxSize: 1000,
        
        // 最大缓存时间（毫秒）
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
      },
    },
    
    // 同时启用分析以观察缓存效果
    analyze: {
      enabled: false, // 按需开启
      open: false,
    },
  },
})

import { defineEnhanceConfig } from 'vite-enhance'

// 完整功能示例 - 同时启用多个功能
export default defineEnhanceConfig({
  enhance: {
    // 预设（自动检测）
    preset: 'app',
    
    // Vue 配置
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
    
    // CDN 外部化
    cdn: {
      autoDetect: true,
      autoDetectDeps: 'dependencies',
      cdnProvider: 'jsdelivr',
    },
    
    // 构建缓存
    cache: {
      cacheDir: 'node_modules/.vite-cache',
      strategy: {
        hashAlgorithm: 'md5',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    },
    
    // 构建分析
    analyze: {
      enabled: true,
      open: false,
      filename: 'dist/stats.html',
      template: 'treemap',
      gzipSize: true,
    },
    
    // PWA 配置
    pwa: {
      registerType: 'autoUpdate',
      manifest: {
        name: 'Full Features Demo',
        short_name: 'Features Demo',
        theme_color: '#4DBA87',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    },
  },
})

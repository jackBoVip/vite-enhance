import { defineEnhanceConfig } from '../../../../packages/config/src/index.js';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // Vue 应用配置
    vue: true, // 自动检测
    
    // 共享配置
    cdn: {
      autoDetect: true,
      provider: 'jsdelivr'
    },
    
    cache: {
      cacheDir: '../../../../node_modules/.vite-enhance-cache', // 共享缓存
    },
    
    // 关闭不需要的功能
    react: false,
    pwa: false,
  },
  
  vite: {
    server: {
      port: 3002
    },
    
    // Monorepo 特定配置
    resolve: {
      alias: {
        '@shared': '../../../packages/shared/src',
        '@ui-lib': '../../../packages/ui-lib/src'
      }
    }
  }
});
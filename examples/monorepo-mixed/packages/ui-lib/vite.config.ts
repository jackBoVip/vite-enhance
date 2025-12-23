import { defineEnhanceConfig } from '../../../../packages/config/src/index.js';

export default defineEnhanceConfig({
  enhance: {
    preset: 'lib',
    
    // Vue 库配置
    vue: true,
    
    // 库项目不需要的功能
    cdn: false, // 库不需要 CDN
    pwa: false, // 库不需要 PWA
    cache: true, // 缓存有助于开发
  },
  
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'UILib',
        fileName: 'index'
      },
      rollupOptions: {
        external: ['vue', '@monorepo-mixed/shared'],
        output: {
          globals: {
            vue: 'Vue',
            '@monorepo-mixed/shared': 'Shared'
          }
        }
      }
    }
  }
});
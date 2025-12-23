import { defineEnhanceConfig } from '../../packages/config/src/index.js';

export default defineEnhanceConfig({
  enhance: {
    preset: 'lib',
    
    // 库项目不需要框架插件
    vue: false,
    react: false,
    
    // 库项目不需要的功能
    cdn: false, // 库不需要 CDN
    pwa: false, // 库不需要 PWA
    cache: false, // 暂时禁用缓存
  },
  
  // 库构建配置
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'LibBasic',
        fileName: 'index'
      },
      rollupOptions: {
        external: ['vue', 'react'],
        output: {
          globals: {
            vue: 'Vue',
            react: 'React'
          }
        }
      }
    }
  }
});
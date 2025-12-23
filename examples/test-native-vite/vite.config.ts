import { defineEnhanceConfig } from '../../packages/config/src/index.js';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 自动检测框架
    vue: true, // 自动检测
    react: true, // 自动检测
    
    // 简单配置 - 自动检测框架和依赖
    cdn: {
      autoDetect: true,
      autoDetectDeps: 'all'
    },
    
    // 其他功能
    cache: true,
    pwa: false,
  },
  
  vite: {
    server: {
      port: 3002
    }
  }
});
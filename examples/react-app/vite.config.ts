import { defineEnhanceConfig } from '../../packages/config/src/index.js';
import react from '@vitejs/plugin-react';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 暂时禁用内置 React 插件，使用手动添加的
    react: false,
    
    // CDN 插件配置（暂时禁用）
    cdn: false,
    
    // 关闭不需要的功能
    vue: false,
    pwa: false,
  },
  
  // 手动添加 React 插件
  plugins: [
    react()
  ],
  
  vite: {
    server: {
      port: 3001
    }
  }
});
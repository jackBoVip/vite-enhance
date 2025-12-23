import { defineEnhanceConfig } from '../../packages/config/src/index.js';
import vue from '@vitejs/plugin-vue';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 暂时禁用内置 Vue 插件，使用手动添加的
    vue: false,
    
    // CDN 插件配置（暂时禁用）
    cdn: false,
    
    // 关闭不需要的功能
    react: false,
    pwa: false,
  },
  
  // 手动添加 Vue 插件
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    })
  ],
  
  vite: {
    server: {
      port: 3000
    }
  }
});
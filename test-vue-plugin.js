// 测试 Vue 插件加载
import { defineEnhanceConfig } from './packages/config/dist/index.js';

console.log('🧪 测试 Vue 插件加载...\n');

// 模拟 Vue 应用的配置
const config = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    vue: true,
    react: false,
    cdn: false,
    pwa: false
  },
  vite: {
    server: {
      port: 3000
    }
  }
});

console.log('配置对象:', JSON.stringify(config, null, 2));
console.log('插件数量:', config.plugins?.length || 0);
console.log('插件列表:', config.plugins?.map(p => p?.name || 'unnamed') || []);
// 测试 Vue 应用构建
import { defineEnhanceConfig } from '../../packages/config/dist/index.js';
import vue from '@vitejs/plugin-vue';

console.log('🧪 测试 Vue 应用构建配置...\n');

// 创建一个使用真实 Vue 插件的配置
const config = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    vue: false, // 禁用自动 Vue 插件，我们手动添加
    react: false,
    cdn: false,
    pwa: false
  },
  plugins: [
    vue() // 手动添加 Vue 插件
  ],
  vite: {
    server: {
      port: 3000
    }
  }
});

console.log('✅ Vue 构建配置创建成功');
console.log('插件数量:', config.plugins?.length || 0);
console.log('插件列表:', config.plugins?.map(p => p?.name || 'unnamed') || []);

export default config;
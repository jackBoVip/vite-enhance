import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  preset: 'app',
  
  vue: {
    script: {
      defineModel: true
    }
  },
  
  cache: true,
  analyze: true, // Enable bundle analysis for admin app
  
  vite: {
    plugins: [
      // 临时添加实际的 Vue 插件用于测试
      (await import('@vitejs/plugin-vue')).default()
    ],
    server: {
      port: 3001
    },
    resolve: {
      alias: {
        '@shared': new URL('../../packages/shared/src', import.meta.url).pathname,
        '@ui-lib': new URL('../../packages/ui-lib/src', import.meta.url).pathname
      }
    }
  }
});
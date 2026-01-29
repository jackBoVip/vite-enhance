import { defineEnhanceConfig } from 'vite-enhance'

// defineEnhanceConfig 已返回完整的 Vite 配置，无需 defineConfig 包装
export default defineEnhanceConfig({
  enhance: {
    preset: 'lib'
  },
  vite: {
    build: {
      lib: {
        // 用户自定义配置，应该优先使用
        entry: 'src/main.ts',  // 自定义入口
        name: 'MyCustomLib',   // 自定义名称
        formats: ['es', 'umd'], // 自定义格式
        fileName: 'custom'      // 自定义文件名
      }
    }
  }
})
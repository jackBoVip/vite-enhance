import { defineEnhanceConfig } from 'vite-enhance'

// defineEnhanceConfig 已返回完整的 Vite 配置，无需 defineConfig 包装
export default defineEnhanceConfig({
  enhance: {
    // preset: 'app'
  }
})
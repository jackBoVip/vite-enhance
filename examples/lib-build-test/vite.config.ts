import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    preset:'lib',
    compress: false
  }
  // 无需配置 vite.build.lib，会自动使用默认配置：
  // - entry: 'src/index.ts'
  // - name: 包名
  // - formats: ['es', 'cjs']
  // - fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
})
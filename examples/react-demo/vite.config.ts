import { defineEnhanceConfig } from 'vite-enhance'

// React 应用示例 - 测试 React 框架自动检测和配置
export default defineEnhanceConfig({
  enhance: {
    // preset 会自动检测为 'app'
    // react 会自动检测（通过 package.json 依赖）
    
    // 可选：显式配置 React 选项
    react: {
      fastRefresh: true,
      jsxRuntime: 'automatic',
    },
    
    // 启用构建分析
    analyze: {
      enabled: true,
      open: false,
      template: 'treemap',
    },
  },
})

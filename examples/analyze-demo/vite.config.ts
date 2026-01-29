import { defineEnhanceConfig } from 'vite-enhance'

// 构建分析示例 - 测试 Bundle Analyzer 配置
export default defineEnhanceConfig({
  enhance: {
    // 构建分析配置
    analyze: {
      // 是否启用
      enabled: true,
      
      // 构建完成后自动打开分析报告
      open: true,
      
      // 报告文件名
      filename: 'dist/stats.html',
      
      // 可视化模板
      // 'treemap' - 矩形树图（默认，最直观）
      // 'sunburst' - 旭日图（适合层级分析）
      // 'network' - 网络图（显示模块依赖）
      template: 'treemap',
      
      // 显示 gzip 压缩后大小
      gzipSize: true,
      
      // 显示 brotli 压缩后大小
      brotliSize: true,
      
      // 使用 sourcemap 进行更精确的分析
      sourcemap: false,
      
      // 排除特定模块
      // exclude: [/node_modules/],
    },
    
    // 可同时启用缓存以加速构建
    cache: true,
  },
})

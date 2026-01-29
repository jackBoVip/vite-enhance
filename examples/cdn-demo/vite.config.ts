import { defineEnhanceConfig } from 'vite-enhance'

// CDN 功能示例 - 测试各种 CDN 配置
export default defineEnhanceConfig({
  enhance: {
    // 自动检测框架
    
    // CDN 配置示例
    cdn: {
      // === 方式 1: 手动指定模块 ===
      // modules: ['vue', 'lodash-es', 'axios'],
      
      // === 方式 2: 自动检测（推荐）===
      autoDetect: true,
      autoDetectDeps: 'dependencies', // 只检测 dependencies
      
      // 排除不需要 CDN 的模块
      // autoDetectExclude: ['some-internal-module'],
      
      // 强制包含额外模块
      // autoDetectInclude: ['vue-router'],
      
      // === CDN 提供商配置 ===
      cdnProvider: 'jsdelivr', // 'unpkg' | 'jsdelivr' | 'cdnjs' | 'custom'
      
      // 自定义 CDN URL（仅 custom 时使用）
      // customProdUrl: 'https://my-cdn.com/{name}@{version}/{path}',
      
      // === 高级配置 ===
      // 开发模式也启用 CDN（默认关闭）
      enableInDevMode: false,
      
      // 自定义 script 标签属性
      generateScriptTag: (name, url) => ({
        src: url,
        crossorigin: 'anonymous',
        // 可添加 SRI hash
        // integrity: 'sha384-xxx',
      }),
      
      // 自定义 CSS link 标签属性
      generateCssLinkTag: (name, url) => ({
        href: url,
        rel: 'stylesheet',
        crossorigin: 'anonymous',
      }),
    },
  },
})

import { defineEnhanceConfig } from 'vite-enhance'

// https://vite.dev/config/
// 测试 vite-enhance 的所有功能
export default defineEnhanceConfig({
  enhance: {
    // ========== 自动检测测试 ==========
    // preset 和 vue 都会自动检测，无需手动配置
    
    // ========== CDN 功能测试 ==========
    // 场景 1: 手动指定模块 + jsdelivr（默认） ✅ 测试通过
    // cdn: {
    //   modules: ['vue'],
    //   cdnProvider: 'jsdelivr',
    // },
    
    // 场景 2: 手动指定模块 + unpkg ✅ 可用
    // cdn: {
    //   modules: ['vue'],
    //   cdnProvider: 'unpkg',
    // },
    
    // 场景 3: 自动检测模块 ✅ 测试通过
    cdn: {
      autoDetect: true,
      autoDetectDeps: 'dependencies', // 只检测 dependencies
    },
    
    // 场景 4: 自动检测 + 排除/包含
    // cdn: {
    //   autoDetect: true,
    //   autoDetectDeps: 'all',
    //   autoDetectExclude: [],
    //   autoDetectInclude: [],
    // },
    
    // 场景 5: 开发模式也启用 CDN
    // cdn: {
    //   modules: ['vue'],
    //   enableInDevMode: true,
    // },
    
    // 场景 6: 自定义标签生成
    // cdn: {
    //   modules: ['vue'],
    //   generateScriptTag: (name, url) => ({
    //     src: url,
    //     crossorigin: 'anonymous',
    //     integrity: 'sha384-...',
    //   }),
    // },
    
    // 测试缓存功能
    cache: {
      cacheDir: 'node_modules/.vite-enhance-cache',
      strategy: {
        hashAlgorithm: 'md5',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7天
      }
    },
    
    // 测试构建分析功能
    analyze: {
      enabled: true,
      open: false,
      filename: 'dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true
    },
    
  
  },
  
  // Vite 原生配置
  vite: {
    // 不设置 build.lib，让它按 app 模式构建
  }
})

/**
 * Vite Enhance Kit - 完整配置示例
 * 
 * 这个文件展示了 Vite Enhance Kit 项目中所有支持的功能和插件配置选项。
 * 它作为用户的参考指南，帮助了解和使用项目的全部功能。
 * 
 * 配置结构：
 * - enhance: 内置功能配置对象
 *   - preset: 预设类型
 *   - vue/react: 框架配置
 *   - cdn/cache/analyze/pwa: 功能插件配置
 * - vite: Vite 原生配置
 * - plugins: 额外的 Vite 插件（可选）
 * 
 * 使用方式：
 * 1. 复制需要的配置部分到你的 vite.config.ts
 * 2. 根据项目需求调整配置选项
 * 3. 确保安装了相应的依赖包
 * 
 * 文档链接：
 * - Vite Enhance Kit: https://github.com/your-org/vite-enhance-kit
 * - Vite 官方文档: https://vitejs.dev/config/
 * - 插件文档: 查看各插件的 README 文件
 * 
 * @author Vite Enhance Kit Team
 * @version 1.0.0
 * @since 2024-12-23
 */

// ============================================================================
// 类型导入 - Type Imports
// ============================================================================

import type { UserConfig as ViteUserConfig } from 'vite';
import { defineEnhanceConfig } from './packages/config/src/index.js';

// 配置验证导入 - Validation Imports (可选)
// import { validateConfig } from '@vite-enhance/config';

// ============================================================================
// 配置示例开始 - Configuration Examples Start
// ============================================================================

// ============================================================================
// 1. 基础配置示例 - Basic Configuration Examples
// ============================================================================

/**
 * 基础配置 - 最简单的预设配置方式
 * 
 * 这是最简单的配置方式，只需要指定预设类型即可。
 * Vite Enhance Kit 会自动检测项目依赖并应用相应的插件。
 * 
 * 适用场景：
 * - 快速开始新项目
 * - 不需要复杂配置的简单项目
 * - 想要使用默认设置的项目
 */
const basicAppConfig = defineEnhanceConfig({
  // 内置功能配置对象
  enhance: {
    // 预设类型：'app' 用于应用项目，'lib' 用于库项目
    preset: 'app',
    
    // 内置插件开关配置 - 使用 true 启用默认配置
    vue: true,                          // 启用 Vue 插件（自动检测）
    react: true,                        // 启用 React 插件（自动检测）
    cdn: true,                          // 启用 CDN 插件（默认配置）
  },
  
  // Vite 原生配置
  vite: {
    server: {
      port: 3000
    }
  }
});

/**
 * 基础库配置 - 用于开发 npm 包或库
 * 
 * 库预设会自动配置适合库开发的选项：
 * - 不包含开发服务器相关配置
 * - 优化构建输出格式
 * - 配置外部依赖处理
 */
const basicLibConfig = defineEnhanceConfig({
  enhance: {
    preset: 'lib',
    
    // 库项目通常只需要框架插件，不需要 CDN、PWA 等
    vue: true,                          // 如果是 Vue 库
    react: false,                       // 关闭 React 插件
    cdn: false,                         // 库项目不需要 CDN
    pwa: false,                         // 库项目不需要 PWA
  },
  
  // 库项目通常需要指定构建配置
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'MyLibrary',
        fileName: 'index'
      }
    }
  }
});

// ============================================================================
// 2. 框架配置示例 - Framework Configuration Examples  
// ============================================================================

/**
 * Vue 3 应用完整配置
 * 
 * 展示了 Vue 3 应用的所有可用配置选项，包括：
 * - SFC (Single File Component) 编译配置
 * - Vue DevTools 集成配置
 * - 组件检查器配置
 * - 性能优化配置
 */
const vueAppConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // Vue 插件配置 - 使用配置对象进行详细配置
    vue: {
      // SFC 脚本配置
      script: {
        defineModel: true,              // 启用 defineModel 宏
        propsDestructure: true,         // 启用 props 解构
        hoistStatic: true,              // 静态提升优化
      },
      
      // 模板编译选项
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('my-'),
        }
      },
      
      // Vue DevTools 配置
      devtools: {
        enabled: true,                  // 启用 Vue DevTools
        componentInspector: true,       // 启用组件检查器
        launchEditor: 'code',           // 设置编辑器为 VS Code
        appendTo: /\.vue$/,             // 只在 .vue 文件中启用
      }
    },
    
    // 其他插件配置
    cdn: {
      autoDetect: true,                 // 自动检测 Vue 相关依赖
      modules: ['vue', 'vue-router']    // 手动指定模块
    },
    
    // 关闭不需要的功能
    react: false,
    pwa: false,
  },
  
  // Vite 配置优化
  vite: {
    // Vue 特定的优化配置
    optimizeDeps: {
      include: ['vue', '@vue/shared'],
      exclude: ['@vue/devtools-api']
    },
    
    // 定义全局常量
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }
  }
});

/**
 * React 应用完整配置
 * 
 * 展示了 React 应用的所有可用配置选项，包括：
 * - JSX 编译配置
 * - Fast Refresh 热更新配置
 * - React 特定的优化配置
 * - 开发工具集成
 */
const reactAppConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // React 插件配置 - 使用配置对象进行详细配置
    react: {
      fastRefresh: true,                // 启用 Fast Refresh
      jsxRuntime: 'automatic',          // 使用自动 JSX 运行时
      jsxImportSource: 'react',         // JSX 导入源
      
      // Babel 配置
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
        ],
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      },
      
      // 文件包含/排除配置
      include: /\.(jsx?|tsx?)$/,
      exclude: /node_modules/,
    },
    
    // 关闭 Vue 插件（React 项目不需要）
    vue: false,
    
    // CDN 配置
    cdn: {
      autoDetect: true,
      modules: ['react', 'react-dom', 'react-router-dom']
    },
    
    pwa: false,
  },
  
  // Vite 配置优化
  vite: {
    // React 特定的优化配置
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['react-devtools']
    },
    
    // ESBuild 配置
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    }
  }
});

// ============================================================================
// 3. 功能配置示例 - Feature Configuration Examples
// ============================================================================

/**
 * CDN 插件完整配置示例
 * 
 * CDN 插件可以将项目依赖替换为 CDN 资源，减少打包体积。
 * 支持自动检测和手动配置两种方式，以及多个 CDN 提供商。
 */
const cdnConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // CDN 插件详细配置
    cdn: {
      // 基础配置
      autoDetect: true,                 // 启用自动检测
      autoDetectDeps: 'all',           // 检测所有依赖类型
      modules: ['dayjs', 'lodash'],     // 手动指定模块
      
      // CDN 提供商配置
      provider: 'jsdelivr',            // 'unpkg' | 'jsdelivr' | 'cdnjs'
      prodUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
      
      // 排除配置
      autoDetectExclude: [
        '@types/*',                     // 排除类型定义
        'vite',                        // 排除构建工具
        'typescript'                   // 排除开发依赖
      ],
      
      // 开发模式配置
      enableInDevMode: false,           // 开发模式下不启用
      
      // 自定义标签生成
      generateScriptTag: (name, scriptUrl) => ({
        src: scriptUrl,
        crossorigin: 'anonymous',
        defer: true
      }),
      
      generateCssLinkTag: (name, cssUrl) => ({
        href: cssUrl,
        rel: 'stylesheet',
        crossorigin: 'anonymous'
      })
    },
    
    vue: true,
    react: false,
  }
});

/**
 * 打包分析插件配置示例
 */
const analyzeConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 分析插件配置
    analyze: {
      enabled: process.env.ANALYZE === 'true', // 通过环境变量控制
      open: true,                       // 自动打开报告
      filename: 'dist/bundle-analysis.html',
      template: 'treemap',             // 'treemap' | 'sunburst' | 'network'
      gzipSize: true,                  // 显示 Gzip 大小
      brotliSize: true,                // 显示 Brotli 大小
    },
    
    vue: true,
    cdn: false,
  }
});

/**
 * PWA 插件配置示例
 */
const pwaConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // PWA 插件配置
    pwa: {
      registerType: 'autoUpdate',       // 'prompt' | 'autoUpdate'
      
      // Workbox 配置
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        skipWaiting: true,
        clientsClaim: true
      },
      
      // Web App Manifest 配置
      manifest: {
        name: 'Vite Enhance Kit App',
        short_name: 'ViteEnhance',
        description: 'A powerful Vite enhanced application',
        theme_color: '#4DBA87',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    },
    
    vue: true,
    cdn: false,
  }
});

/**
 * 缓存插件配置示例
 */
const cacheConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 缓存插件配置
    cache: {
      cacheDir: 'node_modules/.vite-enhance-cache',
      
      // 包含规则
      include: [
        '**/*.{js,ts,jsx,tsx,vue}',
        '**/*.{css,scss,less}',
        'package.json'
      ],
      
      // 排除规则
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.test.*'
      ],
      
      // 缓存策略
      strategy: {
        hashAlgorithm: 'md5',
        maxSize: 500,                   // MB
        maxAge: 30                      // 天
      }
    },
    
    vue: true,
    cdn: false,
  }
});

// ============================================================================
// 4. 分层配置结构示例 - Layered Configuration Examples
// ============================================================================

/**
 * 中级配置示例 - 功能级别的简化配置
 * 
 * 中级配置结合了多个功能，使用简化的配置语法。
 * 适合大多数项目的需求，在简单性和功能性之间取得平衡。
 */
const intermediateConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 框架配置 - 使用开关或简化配置
    vue: {
      devtools: {
        enabled: true,
        componentInspector: true,
        launchEditor: 'code'
      }
    },
    
    // 功能插件配置 - 使用开关或简化配置
    cdn: {
      autoDetect: true,                 // 自动检测依赖
      provider: 'jsdelivr',            // CDN 提供商
      autoDetectExclude: ['@types/*', 'vite']    // 排除不需要的包
    },
    
    analyze: process.env.ANALYZE === 'true', // 通过环境变量控制
    
    cache: true,                        // 启用默认缓存配置
    
    // 关闭不需要的功能
    pwa: false,                         // 不需要 PWA 功能
    react: false,                       // Vue 项目不需要 React
  },
  
  // Vite 原生配置
  vite: {
    server: {
      port: 3000,
      open: true,
      host: true
    },
    
    build: {
      sourcemap: true,
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            utils: ['lodash', 'dayjs']
          }
        }
      }
    },
    
    optimizeDeps: {
      include: ['vue', '@vue/shared']
    }
  }
});

/**
 * 高级配置示例 - 完整的功能配置
 * 
 * 高级配置展示了所有插件的详细配置选项。
 * 提供最大的灵活性和控制力，适合复杂项目和高级用户。
 */
const advancedConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // Vue 插件 - 详细配置
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
        hoistStatic: true
      },
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('my-')
        }
      },
      devtools: {
        enabled: process.env.NODE_ENV === 'development',
        componentInspector: true,
        launchEditor: 'code'
      }
    },
    
    // CDN 插件 - 详细配置
    cdn: {
      autoDetect: true,
      autoDetectDeps: 'all',
      autoDetectExclude: ['@types/*', 'vite', 'typescript'],
      modules: ['vue', 'vue-router', 'element-plus'],
      provider: 'jsdelivr',
      generateScriptTag: (name, scriptUrl) => ({
        src: scriptUrl,
        crossorigin: 'anonymous',
        defer: true
      }),
      generateCssLinkTag: (name, cssUrl) => ({
        href: cssUrl,
        rel: 'stylesheet',
        crossorigin: 'anonymous'
      })
    },
    
    // 分析插件 - 详细配置
    analyze: {
      enabled: process.env.NODE_ENV === 'production',
      open: true,
      filename: 'dist/bundle-analysis.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true
    },
    
    // PWA 插件 - 详细配置
    pwa: {
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Advanced Vite App',
        short_name: 'ViteApp',
        theme_color: '#4DBA87',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    },
    
    // 缓存插件 - 详细配置
    cache: {
      cacheDir: 'node_modules/.vite-enhance-cache',
      include: ['**/*.{js,ts,jsx,tsx,vue}', '**/*.{css,scss,less}'],
      exclude: ['node_modules/**', 'dist/**', '**/*.test.*'],
      strategy: {
        hashAlgorithm: 'md5',
        maxSize: 500,
        maxAge: 30
      }
    },
    
    // 关闭不需要的功能
    react: false,
  },
  
  // Vite 高级配置
  vite: {
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      hmr: {
        overlay: true,
        port: 24678
      }
    },
    
    build: {
      target: 'es2015',
      sourcemap: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            'vue-router': ['vue-router'],
            'element-plus': ['element-plus'],
            utils: ['lodash', 'dayjs', 'axios']
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    
    optimizeDeps: {
      include: ['vue', '@vue/shared', 'element-plus/es'],
      exclude: ['@vue/devtools-api']
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@utils': '/src/utils'
      }
    }
  }
});

// ============================================================================
// 5. 项目特定配置示例 - Project-Specific Configuration Examples
// ============================================================================

/**
 * Vue 应用项目配置
 * 
 * 针对 Vue 单页应用的完整配置示例
 */
const vueProjectConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 启用 Vue 相关功能
    vue: {
      devtools: {                       // 启用开发工具
        enabled: true,
        componentInspector: true,
        launchEditor: 'code'
      },
      script: {
        defineModel: true,
        propsDestructure: true
      }
    },
    
    // CDN 配置 - 针对 Vue 生态
    cdn: {
      autoDetect: true,
      modules: ['vue', 'vue-router', 'element-plus', 'dayjs']
    },
    
    // 启用分析和缓存
    analyze: process.env.ANALYZE === 'true',
    cache: true,
    
    // 关闭不需要的功能
    react: false,
    pwa: false,                         // 根据需要启用
  },
  
  vite: {
    optimizeDeps: {
      include: ['vue', '@vue/shared', 'element-plus/es']
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }
  }
});

/**
 * React 应用项目配置
 * 
 * 针对 React 单页应用的完整配置示例
 */
const reactProjectConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 启用 React 相关功能
    react: {
      fastRefresh: true,
      jsxRuntime: 'automatic'
    },
    
    // CDN 配置 - 针对 React 生态
    cdn: {
      autoDetect: true,
      modules: ['react', 'react-dom', 'react-router-dom', 'antd']
    },
    
    // 启用分析和缓存
    analyze: process.env.ANALYZE === 'true',
    cache: true,
    
    // 关闭不需要的功能
    vue: false,
    pwa: false,                         // 根据需要启用
  },
  
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    esbuild: {
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment'
    }
  }
});

/**
 * 库项目配置示例
 * 
 * 针对 npm 包或库开发的配置示例
 */
const libraryConfig = defineEnhanceConfig({
  enhance: {
    preset: 'lib',
    
    // 库项目通常只需要框架插件
    vue: true,                          // 如果是 Vue 库
    // react: true,                     // 如果是 React 库
    
    // 库项目不需要的功能
    cdn: false,                         // 库不需要 CDN
    pwa: false,                         // 库不需要 PWA
    analyze: process.env.ANALYZE === 'true', // 可选的分析功能
    cache: true,                        // 缓存有助于开发
  },
  
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'MyLibrary',
        fileName: (format) => `index.${format}.js`,
        formats: ['es', 'cjs', 'umd']
      },
      rollupOptions: {
        external: ['vue', 'react'],      // 外部依赖
        output: {
          globals: {
            vue: 'Vue',
            react: 'React'
          }
        }
      },
      sourcemap: true,
      minify: false                      // 库通常不压缩
    }
  }
});

/**
 * Monorepo 配置示例
 * 
 * 针对 Monorepo 工作空间的配置示例
 */
const monorepoConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 根据子项目需求配置
    vue: true,
    react: false,                       // 根据实际情况调整
    
    // 共享配置
    cdn: {
      autoDetect: true,
      provider: 'jsdelivr'
    },
    
    cache: {
      cacheDir: '../../node_modules/.vite-enhance-cache', // 共享缓存
      include: ['**/*.{js,ts,jsx,tsx,vue}'],
      exclude: ['**/node_modules/**', '**/dist/**']
    },
    
    analyze: process.env.ANALYZE === 'true',
    pwa: false,
  },
  
  vite: {
    // Monorepo 特定配置
    resolve: {
      alias: {
        '@shared': '../../packages/shared/src',
        '@utils': '../../packages/utils/src'
      }
    },
    
    optimizeDeps: {
      // 包含工作空间依赖
      include: ['vue', '@vue/shared'],
      // 排除本地包
      exclude: ['@workspace/*']
    },
    
    build: {
      rollupOptions: {
        external: ['@workspace/shared', '@workspace/utils']
      }
    }
  }
});

// ============================================================================
// 6. 配置验证和错误处理示例 - Configuration Validation Examples
// ============================================================================

/**
 * 配置验证示例
 * 
 * 展示如何使用配置验证功能来确保配置的正确性
 */
const validatedConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 基础插件配置
    vue: true,
    cdn: {
      autoDetect: true,
      provider: 'jsdelivr'
    },
    cache: true,
    
    // 关闭不需要的功能
    react: false,
    pwa: false,
  },
  
  vite: {
    // 调试配置 - 启用详细日志
    logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
    
    // 性能优化配置
    build: {
      // 启用构建分析
      reportCompressedSize: true,
      
      // 代码分割优化
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('vue')) return 'vue-vendor';
              if (id.includes('element-plus')) return 'ui-vendor';
              return 'vendor';
            }
          }
        }
      }
    },
    
    // 开发服务器优化
    server: {
      // 代理配置示例
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
});

// ============================================================================
// 7. 使用示例和指南 - Usage Examples and Guidelines
// ============================================================================

/**
 * 快速开始配置 - 最小化配置
 * 
 * 适合快速开始新项目的最简配置
 */
const quickStartConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 只启用必要的功能
    vue: true,                          // 或 react: true
    cdn: true,                          // 使用默认 CDN 配置
    cache: true,                        // 启用缓存优化
    
    // 其他功能按需启用
    analyze: false,
    pwa: false
  }
});

/**
 * 生产环境配置 - 优化的生产配置
 * 
 * 针对生产环境优化的配置示例
 */
const productionConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 框架配置
    vue: {
      devtools: {
        enabled: false                  // 生产环境关闭 DevTools
      }
    },
    
    // CDN 配置 - 生产环境启用
    cdn: {
      autoDetect: true,
      provider: 'jsdelivr',
      enableInDevMode: false            // 只在生产环境启用
    },
    
    // 分析配置 - 按需启用
    analyze: process.env.ANALYZE === 'true',
    
    // PWA 配置 - 生产环境功能
    pwa: {
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Production App',
        short_name: 'ProdApp',
        theme_color: '#4DBA87'
      }
    },
    
    // 缓存配置
    cache: true,
    
    // 关闭开发功能
    react: false,
  },
  
  vite: {
    build: {
      minify: 'esbuild',                // 使用 esbuild 压缩
      sourcemap: false,                 // 生产环境不生成 sourcemap
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            ui: ['element-plus']
          }
        }
      }
    },
    
    define: {
      __VUE_PROD_DEVTOOLS__: false,
      'process.env.NODE_ENV': '"production"'
    }
  }
});

/**
 * 开发环境配置 - 开发优化配置
 * 
 * 针对开发环境优化的配置示例
 */
const developmentConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 框架配置 - 开发环境启用所有开发工具
    vue: {
      devtools: {
        enabled: true,
        componentInspector: true,
        launchEditor: 'code'
      }
    },
    
    // CDN 配置 - 开发环境通常不启用
    cdn: false,
    
    // 分析配置 - 开发环境按需启用
    analyze: false,
    
    // PWA 配置 - 开发环境测试
    pwa: {
      devOptions: {
        enabled: true,
        type: 'module'
      }
    },
    
    // 缓存配置 - 加速开发构建
    cache: true,
    
    // 关闭不需要的功能
    react: false,
  },
  
  vite: {
    server: {
      port: 3000,
      open: true,
      host: true,
      hmr: {
        overlay: true                   // 显示错误覆盖层
      }
    },
    
    build: {
      sourcemap: true,                  // 开发环境生成 sourcemap
      minify: false                     // 开发环境不压缩
    },
    
    optimizeDeps: {
      force: true                       // 强制重新优化依赖
    }
  }
});

// ============================================================================
// 8. 迁移指南配置示例 - Migration Guide Examples
// ============================================================================

/**
 * 从原生 Vite 迁移的配置示例
 * 
 * 展示如何将现有的 Vite 配置迁移到 Vite Enhance Kit
 */

// 原生 Vite 配置示例：
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// 
// export default defineConfig({
//   plugins: [vue()],
//   server: { port: 3000 },
//   build: { sourcemap: true }
// })

// 迁移后的 Vite Enhance Kit 配置：
const migratedConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 原来的 @vitejs/plugin-vue 现在用 vue: true 替代
    vue: true,
    
    // 可以添加增强功能
    cdn: true,
    cache: true,
  },
  
  // 原来的 Vite 配置保持不变
  vite: {
    server: { port: 3000 },
    build: { sourcemap: true }
  }
});

/**
 * 环境变量配置示例
 * 
 * 展示如何根据环境变量动态配置
 */
const environmentConfig = defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 根据环境变量配置框架
    vue: process.env.FRAMEWORK === 'vue',
    react: process.env.FRAMEWORK === 'react',
    
    // 根据环境配置功能
    cdn: process.env.NODE_ENV === 'production',
    analyze: process.env.ANALYZE === 'true',
    pwa: process.env.PWA === 'true',
    cache: process.env.CACHE !== 'false',
  },
  
  vite: {
    server: {
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST || 'localhost'
    },
    
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }
});

// ============================================================================
// 默认导出配置 - Default Export Configuration
// ============================================================================

/**
 * 默认导出的配置示例
 * 
 * 这是一个平衡的配置，适合大多数项目使用。
 * 结合了简单性和功能性，提供了良好的开发体验。
 * 
 * 特点：
 * - 使用简化的开关配置
 * - 自动检测项目类型和依赖
 * - 合理的默认值和优化
 * - 易于理解和修改
 */
export default defineEnhanceConfig({
  // 内置功能配置对象
  enhance: {
    // 基础预设配置
    preset: 'app',
    
    // 框架配置 - 自动检测或手动指定
    vue: true,                          // 如果是 Vue 项目
    // react: true,                     // 如果是 React 项目
    
    // 功能配置 - 使用开关和简化配置
    cdn: {
      autoDetect: true,                 // 自动检测依赖
      provider: 'jsdelivr',            // 使用 jsdelivr CDN
      enableInDevMode: false            // 开发模式不启用 CDN
    },
    
    analyze: process.env.ANALYZE === 'true', // 通过环境变量控制分析
    
    cache: true,                        // 启用缓存优化构建速度
    
    // 可选功能 - 根据项目需求启用
    pwa: false,                         // PWA 功能（按需启用）
    
    // 关闭不需要的功能
    react: false,                       // Vue 项目不需要 React
  },
  
  // Vite 原生配置
  vite: {
    // 开发服务器配置
    server: {
      port: 3000,                       // 开发服务器端口
      open: true,                       // 自动打开浏览器
      host: true,                       // 允许外部访问
    },
    
    // 构建配置
    build: {
      sourcemap: true,                  // 生成 source map
      target: 'es2015',                 // 目标 ES 版本
      rollupOptions: {
        output: {
          // 代码分割优化
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            utils: ['lodash', 'dayjs']
          }
        }
      }
    },
    
    // 依赖优化
    optimizeDeps: {
      include: ['vue', '@vue/shared']
    },
    
    // 路径别名
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});
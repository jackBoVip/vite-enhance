# 🚀 Vite Enhance Kit - 原生 Vite 使用指南

现在你可以直接使用原生的 `vite` 命令，而不需要使用 `vek` 命令！只需要在 `vite.config.ts` 中导入 `defineEnhanceConfig` 即可。

## ✨ 新的使用方式

### 1. 安装依赖

```bash
npm install @vite-enhance --save-dev
# 或
pnpm add @vite-enhance -D
# 或
yarn add @vite-enhance -D
```

### 2. 配置 vite.config.ts

```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 自动检测框架和依赖
    vue: true, // 自动检测
    react: true, // 自动检测
    cdn: {
      autoDetect: true
    },
    
    // 关闭不需要的功能
    pwa: false,
  },
  
  vite: {
    server: {
      port: 3000
    }
  }
});
  cdn: {
    autoDetect: true,
    autoDetectDeps: 'all'
  },
  
  vite: {
    server: {
      port: 3000
    }
  }
});
```

### 3. 使用原生 Vite 命令

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## 🎯 支持的配置选项

### 基础配置

```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  enhance: {
    // 预设配置
    preset: 'app', // 或 'lib'
    
    // 内置插件配置
    vue: true, // 自动检测
    react: true, // 自动检测
    cdn: { autoDetect: true },
    
    // 关闭不需要的功能
    pwa: false,
  },
  
  // 额外的 Vite 插件
  plugins: [
    // 可以混合使用原生 Vite 插件
  ],
  
  // 原生 Vite 配置
  vite: {
    // 所有 Vite 配置选项
    server: { port: 3000 },
    build: { /* ... */ }
  }
});
```

### 框架配置

```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  // Vue 配置
  vue: {
    script: {
      defineModel: true
    },
    devtools: {
      enabled: true,
      componentInspector: true,
      launchEditor: 'code'
    }
  },
  
  // React 配置
  react: {
    fastRefresh: true
  }
});
```

### CDN 配置

```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  cdn: {
    // 自动检测依赖
    autoDetect: true,
    autoDetectDeps: 'all', // 'dependencies' | 'all' | 'production'
    autoDetectExclude: ['some-package'],
    autoDetectInclude: ['extra-package'],
    
    // 手动指定模块
    modules: ['lodash', 'axios'],
    
    // CDN 提供商
    cdnProvider: 'jsdelivr', // 'unpkg' | 'jsdelivr' | 'cdnjs'
    
    // 仅在生产环境启用
    enableInDevMode: false
  }
});
```

### 功能插件配置

```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  // 缓存插件
  cache: {
    cacheDir: '.vite-cache',
    include: ['**/*.vue', '**/*.ts'],
    exclude: ['node_modules/**']
  },
  
  // 分析插件
  analyze: {
    open: true,
    filename: 'bundle-analysis.html'
  },
  
  // PWA 插件
  pwa: {
    manifest: {
      name: 'My App',
      short_name: 'App'
    }
  }
});
```

## 🔧 高级用法

### 新的嵌套配置结构（推荐）

```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';
import someVitePlugin from 'some-vite-plugin';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // 内置插件配置
    vue: {
      devtools: { enabled: true }
    },
    cdn: {
      autoDetect: true
    },
    
    // 关闭不需要的功能
    react: false,
    pwa: false,
  },
  
  // 额外的 Vite 插件
  plugins: [
    someVitePlugin()
  ],
  
  vite: {
    server: {
      port: 3000
    }
  }
});
```

### 混合使用 Enhance 和原生插件（旧方式，仍支持）

```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';
import { createVuePlugin } from '@vite-enhance/plugin-framework-vue';
import { createCDNPlugin } from '@vite-enhance/plugin-cdn';
import someVitePlugin from 'some-vite-plugin';

export default defineEnhanceConfig({
  preset: 'app',
  
  plugins: [
    // Enhance 插件
    createVuePlugin({
      devtools: { enabled: true }
    }),
    createCDNPlugin({
      autoDetect: true
    }),
    
    // 原生 Vite 插件
    someVitePlugin()
  ],
  
  vite: {
    // 原生 Vite 配置
    plugins: [
      // 这里也可以添加原生插件
    ]
  }
});
```

### 库项目配置

```typescript
export default defineEnhanceConfig({
  preset: 'lib',
  
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'MyLib',
        fileName: 'index'
      },
      rollupOptions: {
        external: ['vue', 'react'],
        output: {
          globals: {
            vue: 'Vue',
            react: 'React'
          }
        }
      }
    }
  }
});
```

## 🚀 迁移指南

### 从 vek 命令迁移

**之前 (使用 vek):**

```typescript
// enhance.config.ts
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  preset: 'app',
  // ...
});
```

```json
{
  "scripts": {
    "dev": "vek dev",
    "build": "vek build"
  }
}
```

**现在 (使用原生 vite):**

```typescript
// vite.config.ts
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  preset: 'app',
  // ... 相同的配置
});
```

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

## 🎉 优势

### ✅ 完全兼容
- 与原生 Vite 生态系统完全兼容
- 可以混合使用任何 Vite 插件
- 支持所有 Vite 配置选项

### ✅ 简化依赖
- 只需要安装 `@vite-enhance`
- 不需要额外的 CLI 工具
- 减少项目依赖复杂度

### ✅ 更好的 IDE 支持
- 原生 Vite 配置文件支持
- 完整的 TypeScript 类型提示
- 更好的调试体验

### ✅ 渐进式采用
- 可以逐步迁移现有项目
- 保持与 `vek` 命令的兼容性
- 灵活的配置方式

## 📝 示例项目

查看 `examples/vue-app/vite.config.ts` 获取完整的示例配置。

## 🔗 相关链接

- [Vite 官方文档](https://vitejs.dev/)
- [Vue DevTools 文档](packages/plugins/framework-vue/VUE_DEVTOOLS.md)
- [CDN 插件迁移指南](packages/plugins/cdn/MIGRATION.md)

---

现在你可以享受原生 Vite 的强大功能，同时获得 Vite Enhance Kit 的所有增强特性！🎉
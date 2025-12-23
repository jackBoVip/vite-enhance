# Vite Enhance Kit - 使用指南

## 快速开始

### 安装
```bash
npm install @vite-enhance --save-dev
# 或
pnpm add @vite-enhance -D
```

### 基础配置
创建 `vite.config.ts` 文件：

```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  preset: 'app', // 或 'lib'
});
```

### 运行命令
```bash
# 开发服务器
npm run dev    # 或 vite

# 生产构建
npm run build  # 或 vite build

# 预览构建
npm run preview # 或 vite preview
```

## 功能配置

### CDN 自动检测
```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  cdn: {
    autoDetect: true,              // 启用自动检测
    autoDetectDeps: 'all',         // 检测所有依赖类型
    autoDetectExclude: ['lodash'], // 排除特定包
    autoDetectInclude: ['dayjs'],  // 强制包含特定包
  }
});
```

### Vue 应用配置
```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  // 自动检测 Vue 并启用 DevTools
  vite: {
    server: {
      port: 3000
    }
  }
});
```

### React 应用配置
```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  // 自动检测 React 并启用 Fast Refresh
  cdn: {
    autoDetect: true,
    autoDetectDeps: 'dependencies'
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

## 高级配置

### 新的嵌套配置结构
```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  enhance: {
    preset: 'app',
    
    // Vue 插件配置
    vue: {
      devtools: {
        enabled: true,
        componentInspector: true,
        launchEditor: 'code'
      }
    },
    
    // CDN 插件配置
    cdn: {
      autoDetect: true,
      autoDetectDeps: 'all',
      modules: ['dayjs'],
      prodUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}'
    },
    
    // 关闭不需要的功能
    react: false,
    pwa: false,
  },
  
  vite: {
    server: {
      port: 3000
    }
  }
});
```

### 旧的手动插件配置（已废弃，但仍支持）
```typescript
import { defineEnhanceConfig } from '@vite-enhance/config';
import { createVuePlugin } from '@vite-enhance/plugin-framework-vue';
import { createCDNPlugin } from '@vite-enhance/plugin-cdn';

export default defineEnhanceConfig({
  preset: 'app',
  
  plugins: [
    createVuePlugin({
      devtools: {
        enabled: true,
        componentInspector: true,
        launchEditor: 'code'
      }
    }),
    createCDNPlugin({
      autoDetect: true,
      autoDetectDeps: 'all',
      modules: ['dayjs'],
      prodUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}'
    })
  ]
});
```

### 混合配置
```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  // 简化的功能配置
  cdn: {
    autoDetect: true,
    autoDetectDeps: 'all'
  },
  
  // 原生 Vite 配置
  vite: {
    server: {
      port: 3000,
      open: true
    },
    build: {
      sourcemap: true
    }
  }
});
```

## 支持的功能

### 框架支持
- ✅ **Vue 3** - 自动检测，SFC 编译，DevTools
- ✅ **React** - 自动检测，JSX 编译，Fast Refresh
- ✅ **Vanilla** - 原生 JavaScript/TypeScript

### CDN 功能
- ✅ **自动检测** - 从 package.json 自动检测依赖
- ✅ **版本解析** - 自动获取安装的包版本
- ✅ **多 CDN 支持** - jsdelivr, unpkg, cdnjs
- ✅ **CSS 注入** - 自动注入 CSS 文件
- ✅ **清单生成** - 生成 CDN 资源清单

### 支持的库
- React, React-DOM
- Vue, Vue-Router
- Element Plus, Ant Design
- Lodash, Axios, Moment, Day.js
- jQuery, Bootstrap, ECharts, Three.js

## 迁移指南

### 从 vek CLI 迁移
1. 将 `enhance.config.ts` 重命名为 `vite.config.ts`
2. 更新导入：`@vite-enhance/config` → `@vite-enhance`
3. 更新 package.json 脚本：`vek` → `vite`
4. 移除 `@vite-enhance/cli` 依赖

### 从原生 Vite 迁移
1. 安装 `@vite-enhance`
2. 将 `defineConfig` 替换为 `defineEnhanceConfig`
3. 添加 `preset` 配置
4. 可选：添加 CDN 等增强功能

## 示例项目

查看 `examples/` 目录中的示例项目：
- `vue-app/` - Vue 3 应用示例
- `react-app/` - React 应用示例
- `lib-basic/` - 库项目示例
- `monorepo-mixed/` - Monorepo 示例

## 故障排除

### 常见问题
1. **插件未找到** - 确保安装了相应的插件包
2. **CDN 资源未注入** - 检查 `autoDetect` 配置和依赖
3. **DevTools 未启用** - 确保在开发模式下运行

### 调试
启用详细日志：
```typescript
export default defineEnhanceConfig({
  preset: 'app',
  
  vite: {
    logLevel: 'info' // 或 'verbose'
  }
});
```
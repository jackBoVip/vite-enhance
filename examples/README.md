# vite-enhance 示例

本目录包含各种功能的示例项目，帮助你了解如何使用 vite-enhance。

## 示例列表

### 基础示例

| 示例 | 描述 | 测试功能 |
|------|------|----------|
| [app-build-test](./app-build-test) | 基础 App 模式 | preset: 'app' |
| [lib-build-test](./lib-build-test) | 基础 Lib 模式 | preset: 'lib' |
| [lib-custom-config](./lib-custom-config) | 自定义库配置 | vite.build.lib |

### 框架示例

| 示例 | 描述 | 测试功能 |
|------|------|----------|
| [vue-ts-demo](./vue-ts-demo) | Vue 3 + TypeScript | Vue 自动检测, CDN, Cache, Analyze |
| [react-demo](./react-demo) | React + TypeScript | React 自动检测, Analyze |

### 功能示例

| 示例 | 描述 | 测试功能 |
|------|------|----------|
| [cdn-demo](./cdn-demo) | CDN 外部化 | autoDetect, cdnProvider, 自定义标签 |
| [cache-demo](./cache-demo) | 构建缓存 | cacheDir, strategy, include/exclude |
| [analyze-demo](./analyze-demo) | 构建分析 | template, gzipSize, brotliSize |
| [pwa-demo](./pwa-demo) | PWA 支持 | workbox, manifest, registerType |
| [compress-demo](./compress-demo) | 构建压缩 | format, outputDir, fileName |

### 综合示例

| 示例 | 描述 | 测试功能 |
|------|------|----------|
| [full-features-demo](./full-features-demo) | 完整功能组合 | 所有功能同时启用 |

## 快速开始

```bash
# 进入示例目录
cd examples/vue-ts-demo

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 功能配置参考

### CDN 配置

```typescript
defineEnhanceConfig({
  enhance: {
    cdn: {
      // 自动检测依赖
      autoDetect: true,
      autoDetectDeps: 'dependencies',
      
      // 或手动指定
      modules: ['vue', 'axios', 'lodash-es'],
      
      // CDN 提供商
      cdnProvider: 'jsdelivr', // 'unpkg' | 'cdnjs' | 'custom'
    },
  },
})
```

### Cache 配置

```typescript
defineEnhanceConfig({
  enhance: {
    cache: {
      cacheDir: 'node_modules/.vite-cache',
      strategy: {
        hashAlgorithm: 'md5',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 天
      },
    },
  },
})
```

### Analyze 配置

```typescript
defineEnhanceConfig({
  enhance: {
    analyze: {
      enabled: true,
      open: true,           // 自动打开报告
      template: 'treemap',  // 'sunburst' | 'network'
      gzipSize: true,
      brotliSize: true,
    },
  },
})
```

### PWA 配置

```typescript
defineEnhanceConfig({
  enhance: {
    pwa: {
      registerType: 'autoUpdate',
      manifest: {
        name: 'My App',
        short_name: 'App',
        theme_color: '#4DBA87',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    },
  },
})
```

### Compress 配置

```typescript
defineEnhanceConfig({
  enhance: {
    preset: 'lib',
    compress: {
      format: 'tar.gz',  // 'tar' | 'zip'
      outputDir: 'dist',
      fileName: 'my-lib',
    },
  },
})
```

## 注意事项

1. **依赖安装**: 每个示例需要单独安装依赖
2. **可选依赖**: 某些功能需要安装对应的可选依赖（如 PWA 需要 `vite-plugin-pwa`）
3. **workspace**: 示例使用 `workspace:*` 引用本地 vite-enhance

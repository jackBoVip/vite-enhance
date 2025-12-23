# CDN Plugin Migration Guide

## 概述

新的CDN插件基于成熟的 `vite-plugin-cdn-import` 重新设计，提供更好的稳定性和扩展性，同时保持了原有的自动检测功能。

## 主要改进

### 1. 基于成熟插件
- **之前**: 完全自定义实现
- **现在**: 基于 `vite-plugin-cdn-import` 的成熟实现
- **优势**: 更稳定、更少的bug、更好的兼容性

### 2. 简化的配置
- **之前**: 复杂的模块映射配置
- **现在**: 内置常用库的配置，开箱即用
- **优势**: 更简单的配置，更快的上手

### 3. 增强的自动检测
- **保留功能**: 所有原有的自动检测功能
- **新增**: 更多内置库支持
- **改进**: 更准确的依赖检测

## 功能对比

| 功能 | 原版本 | 新版本 | 说明 |
|------|--------|--------|------|
| 自动检测依赖 | ✅ | ✅ | 保持不变 |
| 依赖类型选择 | ✅ | ✅ | dependencies/all/production |
| 排除/包含配置 | ✅ | ✅ | 保持不变 |
| CDN提供商支持 | ✅ | ✅ | unpkg/jsdelivr/cdnjs |
| CSS资源支持 | ✅ | ✅ | 自动处理CSS文件 |
| 别名支持 | ✅ | ✅ | react-dom/client等 |
| 自定义标签生成 | ✅ | ✅ | 保持API兼容 |
| 内置库数量 | 10+ | 15+ | 新增更多常用库 |
| 稳定性 | 中等 | 高 | 基于成熟插件 |
| 包大小 | 大 | 小 | 移除重复依赖 |

## 支持的库

### React 生态
- `react` - React 核心库
- `react-dom` - React DOM 渲染器
- `react-router-dom` - React 路由

### Vue 生态
- `vue` - Vue 3 核心库
- `vue-router` - Vue 路由
- `vue2` - Vue 2 支持

### UI 库
- `antd` - Ant Design
- `element-plus` - Element Plus (Vue 3)
- `element-ui` - Element UI (Vue 2)

### 工具库
- `lodash` - 实用工具库
- `axios` - HTTP 客户端
- `moment` - 日期处理
- `dayjs` - 轻量级日期库

### 其他
- `jquery` - jQuery
- `bootstrap` - Bootstrap
- `echarts` - 图表库
- `three` - 3D 库

## 配置示例

### 基础配置
```typescript
createCDNPlugin({
  // 启用自动检测
  autoDetect: true,
  
  // 检测依赖类型
  autoDetectDeps: 'dependencies', // 'dependencies' | 'all' | 'production'
  
  // 排除特定包
  autoDetectExclude: ['moment'],
  
  // 强制包含包
  autoDetectInclude: ['dayjs'],
  
  // CDN 提供商
  cdnProvider: 'jsdelivr', // 'unpkg' | 'jsdelivr' | 'cdnjs' | 'custom'
  
  // 自定义 CDN URL 模板
  prodUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}'
})
```

### 高级配置
```typescript
createCDNPlugin({
  autoDetect: true,
  autoDetectDeps: 'all',
  
  // 手动指定额外模块
  modules: ['custom-lib'],
  
  // 开发模式启用
  enableInDevMode: false,
  
  // 自定义标签生成
  generateScriptTag: (name, url) => ({
    defer: true,
    crossorigin: 'anonymous'
  }),
  
  generateCssLinkTag: (name, url) => ({
    crossorigin: 'anonymous'
  })
})
```

## 迁移步骤

### 1. 更新配置
原有配置基本兼容，只需要确保 `prodUrl` 使用正确的模板格式：

```typescript
// ❌ 错误 - 不是模板
prodUrl: 'https://cdn.jsdelivr.net'

// ✅ 正确 - 使用模板
prodUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}'

// ✅ 或者使用 cdnProvider
cdnProvider: 'jsdelivr' // 自动使用正确的模板
```

### 2. 检查支持的库
确认你使用的库在支持列表中，如果不在，可以：
- 提交 Issue 请求添加
- 使用 `modules` 手动配置
- 使用 `autoDetectInclude` 强制包含

### 3. 测试构建
运行构建命令，检查：
- CDN 链接是否正确生成
- 所有依赖是否正确外部化
- 应用是否正常运行

## 故障排除

### 1. CDN 链接不正确
检查 `prodUrl` 是否使用了正确的模板格式，包含 `{name}`、`{version}` 和 `{path}` 占位符。

### 2. 模块未被检测
- 检查模块是否在支持列表中
- 使用 `autoDetectInclude` 强制包含
- 检查 `autoDetectExclude` 是否意外排除

### 3. 版本不匹配
插件会自动读取 `node_modules` 中的版本，确保依赖已正确安装。

## 性能优化

### 1. 选择合适的 CDN
- **jsDelivr**: 全球 CDN，速度快
- **unpkg**: npm 官方 CDN
- **cdnjs**: Cloudflare CDN

### 2. 依赖类型选择
- `dependencies`: 只检测生产依赖（推荐）
- `production`: 包含 peerDependencies
- `all`: 包含所有依赖（谨慎使用）

### 3. 合理排除
排除不需要 CDN 化的包，减少 HTTP 请求数量。

## 反馈和支持

如果遇到问题或有功能建议，请：
1. 检查本文档的故障排除部分
2. 查看 GitHub Issues
3. 提交新的 Issue 或 PR
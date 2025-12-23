# Plugin System Documentation

## 插件系统概述

Vite Enhance Kit 的插件系统基于生命周期钩子设计，提供了灵活的扩展机制。

## 插件接口

```typescript
interface EnhancePlugin {
  name: string;
  version?: string;
  enforce?: 'pre' | 'post';
  apply?: 'serve' | 'build' | 'both';
  
  // 生命周期钩子
  configResolved?: (config: ResolvedEnhanceConfig) => void | Promise<void>;
  buildStart?: (context: BuildContext) => void | Promise<void>;
  buildEnd?: (context: BuildContext) => void | Promise<void>;
  configureServer?: (server: ViteDevServer) => void | Promise<void>;
  
  // 返回 Vite 插件
  vitePlugin?: () => VitePlugin | VitePlugin[];
}
```

## 生命周期钩子

### configResolved
在配置解析完成后调用，可以访问最终的配置对象。

### buildStart
在构建开始前调用，可以进行构建前的准备工作。

### buildEnd
在构建结束后调用，可以进行清理工作或生成报告。

### configureServer
在开发服务器配置时调用，可以添加中间件或修改服务器配置。

## 插件开发指南

### 1. 创建插件

```typescript
import { EnhancePlugin } from '@vite-enhance/shared';

export function createMyPlugin(options = {}): EnhancePlugin {
  return {
    name: 'my-plugin',
    version: '1.0.0',
    
    configResolved(config) {
      // 配置解析后的逻辑
    },
    
    vitePlugin() {
      return {
        name: 'vite:my-plugin',
        // Vite 插件逻辑
      };
    },
  };
}
```

### 2. 插件注册

插件可以通过以下方式注册：

1. **预设自动注册**: 通过 app/lib 预设自动加载
2. **用户手动注册**: 在配置文件中显式添加
3. **字符串引用**: 通过包名字符串引用

### 3. 插件配置

```typescript
// enhance.config.ts
export default defineEnhanceConfig({
  plugins: [
    createMyPlugin({
      option1: 'value1',
      option2: true,
    }),
    '@vite-enhance/plugin-cdn', // 字符串引用
  ],
});
```

## 官方插件

### 框架插件
- `@vite-enhance/plugin-framework-vue`: Vue 3 支持
- `@vite-enhance/plugin-framework-react`: React 支持

### 功能插件
- `@vite-enhance/plugin-cdn`: CDN 外链支持
- `@vite-enhance/plugin-cache`: 构建缓存
- `@vite-enhance/plugin-analyze`: 包分析
- `@vite-enhance/plugin-pwa`: PWA 支持

## 插件命名规范

- 官方插件: `@vite-enhance/plugin-<name>`
- 第三方插件: `vite-enhance-plugin-<name>`

## 插件发布

插件可以独立发布到 npm，用户可以按需安装和使用。

## 最佳实践

1. **单一职责**: 每个插件只负责一个特定功能
2. **配置验证**: 使用 schema 验证插件配置
3. **错误处理**: 提供清晰的错误信息
4. **文档完善**: 提供详细的使用文档和示例
5. **测试覆盖**: 编写单元测试和集成测试
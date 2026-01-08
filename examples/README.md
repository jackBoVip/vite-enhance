# Vite Enhance Examples

本目录包含 vite-enhance 的各种使用示例。

## 📁 目录结构

### 核心示例

- **lib-build-test** - 库构建基础示例（使用默认配置）
- **lib-custom-config** - 库构建自定义配置示例
- **app-build-test** - 应用构建示例
- **design** - 设计系统示例
- **vue-ts-demo** - Vue + TypeScript 示例

### 共享配置

- **tsconfig** - 共享的 TypeScript 配置

## 🚀 快速开始

### 库构建示例

```bash
# 使用默认配置的库构建
cd lib-build-test
pnpm install
pnpm build

# 使用自定义配置的库构建
cd lib-custom-config
pnpm install
pnpm build
```

### 应用构建示例

```bash
cd app-build-test
pnpm install
pnpm build
```

## 📖 示例说明

### lib-build-test

展示库构建的最简配置，使用 vite-enhance 的所有默认值：

```typescript
export default defineConfig(
  defineEnhanceConfig({
    enhance: {
      preset: 'lib'
    }
  })
)
```

**特点**:
- 无需配置 `build.lib`
- 自动输出到 `dist` 目录
- 自动生成 `index.mjs` 和 `index.cjs`
- 禁用压缩以便调试

### lib-custom-config

展示如何自定义库构建配置：

```typescript
export default defineConfig(
  defineEnhanceConfig({
    enhance: {
      preset: 'lib'
    },
    vite: {
      build: {
        lib: {
          entry: 'src/main.ts',      // 自定义入口
          name: 'MyCustomLib',       // 自定义名称
          formats: ['es', 'umd'],    // 自定义格式
          fileName: 'custom'         // 自定义文件名
        }
      }
    }
  })
)
```

**特点**:
- 用户配置优先
- 灵活的自定义选项
- 支持多种输出格式

### app-build-test

展示应用构建的基本配置：

```typescript
export default defineConfig(
  defineEnhanceConfig({
    enhance: {
      preset: 'app'
    }
  })
)
```

**特点**:
- 自动输出到 `dist/包名` 目录
- 支持 CDN、缓存等功能插件
- 自动压缩构建产物

### design

设计系统示例，展示如何构建一个设计系统库。

### vue-ts-demo

Vue 3 + TypeScript 应用示例，展示框架自动检测和集成。

## 🔧 配置说明

### 默认库构建配置

当 `preset: 'lib'` 时，vite-enhance 提供以下默认配置：

```typescript
{
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: packageName,  // 从 package.json 读取
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    }
  }
}
```

### 输出目录规则

- **库构建 (lib)**: 直接输出到 `dist/`
- **应用构建 (app)**: 输出到 `dist/包名/`

## 📚 更多信息

查看主 README 和文档目录获取更多详细信息：

- [主 README](../README.md)
- [完整分析文档](../docs/vite-enhance-analysis.md)
- [发布指南](../PUBLISHING.md)

## 🤝 贡献

欢迎提交新的示例！请确保：

1. 示例简洁明了
2. 包含必要的注释
3. 更新本 README
4. 测试构建成功

---

**更新时间**: 2026-01-08
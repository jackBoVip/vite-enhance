# vite-enhance v0.3.1 发布总结

## 📦 发布信息

- **版本号**: 0.3.1
- **发布时间**: 2026-01-08
- **npm 包**: https://www.npmjs.com/package/vite-enhance/v/0.3.1
- **GitHub 标签**: https://github.com/jackBoVip/vite-enhance/releases/tag/vite-enhance@0.3.1

## 🎯 主要改进

### 修复 Rollup 混合导出警告

**问题描述**：
在库构建时，如果源文件同时使用命名导出和默认导出，Rollup 会发出警告：

```
Entry module "src/index.ts" is using named and default exports together.
Consumers of your bundle will have to use `lib-build-test.default` to access 
the default export, which may not be what you want.
Use `output.exports: "named"` to disable this warning.
```

**解决方案**：
- 自动为库构建添加 `rollupOptions.output.exports: "named"` 配置
- 智能合并用户自定义的 rollupOptions 配置（用户配置优先）
- 完全消除混合导出警告

**代码变更**：

```typescript
// packages/vite-enhance/src/config/vite-integration.ts

/**
 * 获取默认的 Rollup 输出配置
 */
function getDefaultRollupOptions() {
  return {
    output: {
      exports: 'named' as const, // 使用命名导出，避免混合导出警告
    }
  };
}

// 在 createViteConfig 中自动应用
if (isLibBuild) {
  // 添加默认的 Rollup 配置
  if (!config.vite?.build?.rollupOptions) {
    buildConfig.rollupOptions = getDefaultRollupOptions();
  } else {
    // 合并用户的 rollupOptions（用户配置优先）
    const defaultRollup = getDefaultRollupOptions();
    buildConfig.rollupOptions = {
      ...defaultRollup,
      ...config.vite.build.rollupOptions,
      output: {
        ...defaultRollup.output,
        ...(config.vite.build.rollupOptions.output || {}),
      }
    };
  }
}
```

## 📊 构建输出对比

### 之前（v0.3.0）
```
vite v7.3.0 building client environment for production...
✓ 1 modules transformed.
dist/index.mjs  0.15 kB │ gzip: 0.14 kB
⚠️ Entry module "src/index.ts" is using named and default exports together.
   Consumers of your bundle will have to use `lib-build-test.default` to 
   access the default export, which may not be what you want.
   Use `output.exports: "named"` to disable this warning.
dist/index.cjs  0.23 kB │ gzip: 0.20 kB
✓ built in 80ms
```

### 现在（v0.3.1）
```
vite v7.3.0 building client environment for production...
✓ 1 modules transformed.
dist/index.mjs  0.15 kB │ gzip: 0.14 kB
dist/index.cjs  0.23 kB │ gzip: 0.20 kB
✓ built in 95ms
```

## 🧪 测试验证

### 测试项目
- ✅ `examples/lib-build-test` - 基础库构建（无警告）
- ✅ `examples/lib-custom-config` - 自定义配置库构建（无警告）
- ✅ `examples/app-build-test` - 应用构建（正常）
- ✅ ESM 导入测试通过

### 导入测试
```javascript
// 测试 ESM 导入
import { hello, VERSION } from 'vite-enhance-test'

console.log(hello('World'))  // "Hello, World!"
console.log(VERSION)         // "1.0.0"
```

## 📚 文档更新

- ✅ 更新 `TROUBLESHOOTING.md`，添加混合导出警告的排查指南
- ✅ 说明 vite-enhance 0.3.1+ 已自动处理此问题
- ✅ 提供手动配置和源码修改的替代方案

## 🔄 向后兼容性

- ✅ 完全向后兼容
- ✅ 用户自定义的 `rollupOptions` 配置优先
- ✅ 不影响现有项目的构建行为
- ✅ 不需要修改现有配置文件

## 📦 包信息

```
vite-enhance@0.3.1 | MIT | deps: 13
Main entry point for Vite Enhance Kit

Package size: 66.8 kB
Unpacked size: 324.2 kB
Total files: 83

Published: 2026-01-08
Maintainer: jackbo_vip <jackbovip@163.com>
```

## 🚀 升级指南

### 从 v0.3.0 升级

```bash
# 使用 pnpm
pnpm update vite-enhance

# 使用 npm
npm update vite-enhance

# 使用 yarn
yarn upgrade vite-enhance
```

### 验证升级

```bash
# 查看版本
npm list vite-enhance

# 重新构建项目
pnpm build
```

升级后，库构建将不再显示混合导出警告。

## 🎉 总结

vite-enhance v0.3.1 成功解决了库构建时的 Rollup 混合导出警告问题，提供了更清晰的构建输出体验。这是一个小而重要的改进，让开发者可以专注于代码本身，而不是被警告信息干扰。

感谢使用 vite-enhance！

---

**相关链接**：
- npm: https://www.npmjs.com/package/vite-enhance
- GitHub: https://github.com/jackBoVip/vite-enhance
- 问题反馈: https://github.com/jackBoVip/vite-enhance/issues

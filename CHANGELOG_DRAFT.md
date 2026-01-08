# vite-enhance 0.3.1 更新日志

## 🎯 改进

### 库构建优化

#### 自动禁用混合导出警告

**问题**：
在库构建时，如果源文件同时使用命名导出和默认导出，Rollup 会发出警告：

```
Entry module "src/index.ts" is using named and default exports together. 
Consumers of your bundle will have to use `lib-build-test.default` to access 
the default export, which may not be what you want. 
Use `output.exports: "named"` to disable this warning.
```

**解决方案**：
vite-enhance 现在会自动为库构建添加 `rollupOptions.output.exports: "named"` 配置，完全消除此警告。

**影响**：
- ✅ 构建输出更清晰，没有警告信息
- ✅ 用户无需手动配置 `rollupOptions`
- ✅ 保持向后兼容，用户配置优先

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
  // ... lib 配置
  
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

**使用示例**：

```typescript
// vite.config.ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    preset: 'lib'
  }
  // 无需配置 rollupOptions，自动处理
})
```

**构建输出对比**：

**之前**：
```
vite v7.3.0 building client environment for production...
✓ 1 modules transformed.
dist/index.mjs  0.15 kB │ gzip: 0.14 kB
Entry module "src/index.ts" is using named and default exports together. ⚠️
Consumers of your bundle will have to use `lib-build-test.default` to 
access the default export, which may not be what you want. 
Use `output.exports: "named"` to disable this warning.
dist/index.cjs  0.23 kB │ gzip: 0.20 kB
✓ built in 80ms
```

**现在**：
```
vite v7.3.0 building client environment for production...
✓ 1 modules transformed.
dist/index.mjs  0.15 kB │ gzip: 0.14 kB
dist/index.cjs  0.23 kB │ gzip: 0.20 kB
✓ built in 95ms
```

## 📚 文档更新

- 更新 `TROUBLESHOOTING.md`，添加混合导出警告的排查指南
- 说明 vite-enhance 0.3.1+ 已自动处理此问题
- 提供手动配置和源码修改的替代方案

## 🧪 测试

所有示例项目构建成功，无警告：
- ✅ `examples/lib-build-test` - 基础库构建
- ✅ `examples/lib-custom-config` - 自定义配置库构建
- ✅ `examples/app-build-test` - 应用构建

## 🔄 向后兼容

- ✅ 完全向后兼容
- ✅ 用户自定义的 `rollupOptions` 配置优先
- ✅ 不影响现有项目的构建行为

## 📦 发布清单

- [ ] 更新 `package.json` 版本号为 `0.3.1`
- [ ] 运行 `pnpm build` 构建包
- [ ] 运行所有示例项目测试
- [ ] 更新 `CHANGELOG.md`
- [ ] 提交代码并打标签
- [ ] 发布到 npm

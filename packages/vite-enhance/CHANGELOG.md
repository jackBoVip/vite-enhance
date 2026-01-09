# vite-enhance

## 0.3.3

### Patch Changes

- Relax Vite peer dependency to support Vite 5.x, 6.x, and 7.x
  - Changed peer dependency from `^7.3.0` to `^5.0.0 || ^6.0.0 || ^7.0.0`
  - Improves compatibility with projects using older Vite versions
  - Fixes peer dependency warnings for Vite 5.x and 6.x users

## 0.3.2

### Patch Changes

- Fix library preset auto-detection for projects with standard package.json fields
  - Improved `detectPreset()` function to correctly identify library projects
  - Added early return when strong library indicators (main/module/exports/types) are found
  - Removed unnecessary checks for lib-specific scripts/dependencies
  - Fixed ESM compatibility issues with require() calls
  - Enhanced error handling with proper logging
  - Library projects with main/module/types/exports fields now auto-detect correctly without explicit preset configuration

## 0.3.1

### Patch Changes

- 修复库构建时的 Rollup 混合导出警告
  - 自动为库构建添加 `rollupOptions.output.exports: "named"` 配置
  - 消除 "Entry module is using named and default exports together" 警告
  - 智能合并用户自定义的 rollupOptions 配置
  - 更新 TROUBLESHOOTING.md 文档

## 0.3.0

### Minor Changes

- 6da066e: 优化库构建功能和项目类型检测
  - 修复项目类型检测逻辑，优先检测 main/module 字段指向 dist/ 的情况
  - 库构建直接输出到 dist/ 目录，不创建包名子目录
  - 为库构建提供默认配置（entry、formats、fileName）
  - 添加库构建压缩控制选项（disableForLib、appOnly）
  - 优化构建输出目录结构

### Patch Changes

- bd065a4: fix: resolve catalog: protocol issue for external package installation

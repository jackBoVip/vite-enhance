---
"vite-enhance": minor
---

优化库构建功能和项目类型检测

- 修复项目类型检测逻辑，优先检测 main/module 字段指向 dist/ 的情况
- 库构建直接输出到 dist/ 目录，不创建包名子目录  
- 为库构建提供默认配置（entry、formats、fileName）
- 添加库构建压缩控制选项（disableForLib、appOnly）
- 优化构建输出目录结构

# Architecture Documentation

## Overview

Vite Enhance Kit 采用分层架构设计，通过清晰的职责边界实现可扩展性和可维护性。

## 架构层次

### 用户层 (User Layer)
- **@vite-enhance/cli**: 命令行工具，提供 `vek` 命令入口
- **@vite-enhance/config**: 配置 API，提供 `defineEnhanceConfig` 等用户接口

### 核心层 (Core Layer)
- **@vite-enhance/core**: 引擎内核，负责项目检测、插件调度、配置合并

### 插件层 (Plugin Layer)
- **@vite-enhance/presets**: 预设系统，定义 app/lib 工程模型
- **Plugin Ecosystem**: 官方插件生态，提供具体增强能力

### 共享层 (Shared Layer)
- **@vite-enhance/shared**: 共享工具、类型定义、日志系统

## 数据流

1. CLI 加载用户配置文件
2. Core 检测项目类型和框架
3. 根据预设加载对应插件
4. 插件注册和生命周期调度
5. 生成最终 Vite 配置
6. 执行构建或开发服务器

## 设计原则

- **API 稳定**: config 包作为独立的稳定层
- **易扩展**: 插件完全解耦，可独立安装和发布
- **可维护**: core 极度克制，不包含具体插件能力
- **企业友好**: 支持 Monorepo 和复杂工程场景

## 包依赖关系

```
cli → config → core → shared
cli → core → presets → shared
core → plugins → shared
```

## 插件系统

插件系统基于生命周期钩子设计：

- `configResolved`: 配置解析完成后
- `buildStart`: 构建开始前
- `buildEnd`: 构建结束后
- `configureServer`: 开发服务器配置

每个插件可以返回 Vite 插件实例，由 Core 统一管理和调度。
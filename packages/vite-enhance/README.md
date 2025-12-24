# Vite Enhance Kit

> 🚀 **一个位于 Vite 之上的工程化增强层，用最少的配置交付大厂级前端工程体验**

---

## ✨ 它是什么？

**Vite Enhance Kit** 是一个基于 Vite 的工程化增强工具包，提供：

* 智能项目类型与框架识别（Vue / React / Svelte / Solid / Lit / Preact）
* 应用构建（App）与库构建（Lib）的统一抽象
* 官方维护的工程化插件生态
* 企业级能力（CDN、缓存、PWA、构建分析等）

它 **不替代 Vite**，而是作为一层 *Enhance Layer*，让 Vite 在真实项目中更好用、更统一、更可治理。

---

## 🤔 为什么需要它？

在真实的中大型项目中，前端工程往往面临以下问题：

* 项目形态多样：Web（Vue / React / Svelte / Solid / Lit / Preact）、组件库、Electron、React Native
* 仓库形态复杂：Monorepo + 多应用 + 多包
* 构建诉求不一致：开发要快、CI 要稳、产物要小
* 工程能力分散：CDN、缓存、PWA、Mock、规范各自为战

**Vite Enhance Kit 关注的不是“怎么打包”，而是“怎么把工程这件事长期做好”。**

它尝试把：

> 大厂里被反复验证的工程经验，变成普通项目也能用的工具能力

---

### 使用原生 Vite 时，你可能遇到过这些问题：

* 每个项目都要重新选插件、抄配置
* Vue / React / Lib 项目配置风格不一致
* CDN、压缩、PWA、Mock 等能力零散
* 工程最佳实践无法沉淀

**Vite Enhance Kit 解决的是“工程化问题”，而不是“构建问题”。**

---

## 🎯 核心定位

| 维度 | 说明                   |
| -- | -------------------- |
| 定位 | Vite 工程化增强层          |
| 适用 | Vue / React / Svelte / Solid / Lit / Preact 应用 & 组件库 |
| 风格 | 约定优于配置、渐进增强          |
| 用户 | 中大型项目、技术负责人、库作者      |
| 特性 | 类型安全、插件化、可扩展      |

对比同类方案：

| 方案                   | 做什么      | 不做什么     |
| -------------------- | -------- | -------- |
| Vite                 | 构建工具     | 工程治理     |
| Nuxt / Next          | 应用框架     | 渐进引入     |
| Rsbuild              | 构建封装     | 插件生态     |
| **Vite Enhance Kit** | **工程增强** | **框架接管** |

---

## ⚡ 5 分钟上手

### 1️⃣ 安装

```bash
# 使用 npm
npm install vite-enhance

# 使用 yarn  
yarn add vite-enhance

# 使用 pnpm (推荐)
pnpm add vite-enhance
```

### 2️⃣ 创建配置

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { defineEnhanceConfig } from 'vite-enhance'

export default defineConfig(
  defineEnhanceConfig({
    // preset 会自动检测（app/lib），也可显式设置
    // 框架会根据 package.json 中的依赖自动检测，无需配置
    plugins: {
      // 功能插件可按需启用
      cdn: {
        autoDetect: true, // 自动检测依赖
        provider: 'jsdelivr'
      },               // CDN 外部化
      cache: true,      // 构建缓存
      analyze: true,    // 包分析
      pwa: true         // PWA 支持
    }
  })
)
```

### 3️⃣ 启动开发

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build
```

---

## 🧠 核心能力一览

### 🧩 多项目 / 多形态支持

* Web 应用（Vue / React / Svelte / Solid / Lit / Preact）
* 组件库 / SDK（Lib 模式）
* Electron（Main / Preload / Renderer）
* React Native（工程配置与共享包层面）

### 📦 包架构设计

* `vite-enhance` - 统一主包（整合了所有功能）

---

### 🧠 智能工程识别

* 自动识别 Vue / React
* 自动识别 App / Lib (通过 package.json 配置检测)
* 自动识别 Monorepo / Workspace
* 自动加载匹配的官方插件
* 框架自动检测功能（从项目依赖中检测使用的框架）

---

### ⚙️ 统一构建与工程模型

* 应用构建（App Preset）
* 库构建（Lib Preset）
* Web / 桌面 / 移动工程模型统一

---

### ⚡ 性能与构建体验

* 构建缓存（本地 / 预留远程）
* 增量构建
* 构建分析与耗时统计

---

### 🧩 官方插件生态

* 框架插件（Vue / React / Svelte / Solid / Lit / Preact）
* CDN 插件（支持公网 & 内网 IP，包含自动检测功能）
* 构建缓存插件（高性能缓存与智能失效机制）
* 构建分析插件（包含构建时长统计功能）
* PWA 插件

---

### ✅ 智能识别

* 自动识别 Vue / React / Svelte / Solid / Lit / Preact 项目
* 自动判断 App / Lib 构建模式
* 按需加载官方插件

### ✅ 统一构建模型

* `preset: app` —— 应用构建
* `preset: lib` —— 组件库 / SDK 构建

### ✅ 官方插件生态

* Vue / React / Svelte / Solid / Lit / Preact 支持（包含框架 DevTools 集成）
* CDN（支持公网 & 内网 IP，支持自动检测依赖）
* 构建缓存（基于文件哈希的智能缓存）
* 构建分析（包含构建耗时统计）
* PWA 支持

---

## 🌐 CDN 插件示例（支持自动检测）

```ts
cdn({
  autoDetect: true, // 自动检测 package.json 中的依赖
  autoDetectDeps: 'dependencies', // 仅检测 dependencies
  autoDetectExclude: ['@types/*'], // 排除某些依赖
  modules: ['react', 'react-dom'], // 手动指定模块
  provider: 'jsdelivr', // 支持 jsdelivr, unpkg, cdnjs
  enableInDevMode: false // 生产环境才启用
})
```

适用于：

* 内网环境
* 私有制品仓库
* 离线部署场景
* 自动外部化依赖

---

## 🧩 插件分级体系

* **Core**：核心功能（配置治理、类型定义）
* **Official**：官方维护（Vue / React / Svelte / Solid / Lit / Preact / CDN / Cache / Analyze / PWA 等）
* **Community**：社区扩展

> 插件有生命周期、有顺序、可治理。

### 插件生命周期

* `configResolved` - 配置解析完成
* `buildStart` - 构建开始
* `buildEnd` - 构建结束
* `configureServer` - 服务器配置
* `vitePlugin` - 返回 Vite 插件

---

## 🛣️ 适合哪些场景？

* 企业级中后台系统
* 多项目统一工程规范
* Monorepo 架构仓库
* Design System / 组件库
* Electron 桌面应用
* Web + React Native 共享工程

---

* 企业中后台项目
* 多项目工程规范统一
* Vue / React 混合技术栈
* 组件库 / SDK 构建

---

## 🚀 进阶能力与企业级支持

### 🧱 Monorepo 支持

内置对主流 Monorepo 方案的工程化支持，用于大型项目与多包协作场景。

* 支持 **pnpm / yarn / npm workspaces**
* 自动识别 packages 目录结构
* 子包独立构建 / 联合构建
* 依赖提升（hoist）与 external 自动处理
* 支持「应用 + 组件库」混合仓库

适用场景：

* 企业级多应用仓库
* Design System + 业务项目

---

### 📱 React Native / Electron 适配

#### React Native（工程支持层面）

* 作为 **构建与工程配置管理工具**（非打包 RN 运行时）
* 统一 TS / ESLint / 环境变量 / 版本号管理
* 支持 Web / RN 共享包（shared packages）

#### Electron

* 支持 Electron 主进程 / 渲染进程构建配置拆分
* 基于 Vite 的 Renderer 构建增强
* 自动区分 `main / preload / renderer`
* 支持桌面端专属插件（如 native 模块 external）

---

### ⚡ 构建缓存与加速

为中大型项目提供可感知的构建性能优化能力。

* 本地构建缓存（基于文件哈希，支持智能失效）
* 模式匹配（支持自定义包含/排除规则）
* 缓存清单（记录缓存元数据）
* 性能优化（文件哈希缓存、模式匹配缓存）

目标：

* 减少重复构建时间
* 提升 CI 稳定性
* 智能缓存管理

---

### 🛡️ 实际已实现功能

#### 🛠️ 配置管理

* 类型安全的配置 API
* 配置验证与默认值
* 向后兼容的配置结构

#### 📊 构建分析

* 构建性能指标输出
* 构建报告（HTML / JSON）
* 插件耗时分析

#### 🔐 企业级支持

* 内网 CDN 支持
* 依赖自动外部化
* 构建缓存优化

---

## 🗺️ Roadmap（规划路线）

### Phase 1 · 核心能力（当前）

* App / Lib 双构建模型
* Vue / React / Svelte / Solid / Lit / Preact 自动识别
* 官方插件体系
* CDN（含内网）

### Phase 2 · 工程规模化

* Monorepo 深度支持
* 构建缓存与加速
* 构建可观测性

### Phase 3 · 跨平台工程

* Electron 工程增强
* React Native 工程协同
* Web / Desktop / Mobile 工程统一

---

## 📦 依赖管理

本项目使用 pnpm 的 workspace catalog 功能来集中管理所有依赖版本。

### 添加新依赖

1. 在 `pnpm-workspace.yaml` 的 catalog 中添加依赖版本：
   ```yaml
   catalog:
     new-dependency: ^1.0.0
   ```

2. 在 package.json 中使用 catalog 语法引用：
   ```json
   {
     "dependencies": {
       "new-dependency": "catalog:"
     }
   }
   ```

### 更新依赖版本

1. 在 `pnpm-workspace.yaml` catalog 中更新版本
2. 运行 `pnpm install` 更新所有包
3. 运行 `pnpm version:check` 验证一致性

### 验证

运行 `pnpm version:check` 来验证：
- 所有外部依赖使用 catalog 引用
- 所有 catalog 条目存在
- 工作区依赖使用正确语法

### 构建产物管理

项目已配置 `.gitignore` 确保所有包的 `dist/` 目录不会被提交到 git：
- 构建产物仅存在于本地
- 每次构建都会重新生成
- 保持仓库清洁，避免不必要的文件冲突

详细信息请参考 [依赖管理指南](./DEPENDENCY_MANAGEMENT.md)。

---

## 📦 未来规划

* Monorepo 支持
* React Native / Electron 适配
* 构建缓存与加速

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/jackBoVip/vite-enhance)
- [npm 包](https://www.npmjs.com/package/vite-enhance)
- [发布指南](PUBLISHING.md) - 了解如何发布新版本
- [更新日志](CHANGELOG.md) - 查看版本更新记录

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### 本地开发

```bash
# 克隆项目
git clone https://github.com/jackBoVip/vite-enhance.git
cd vite-enhance

# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 开发模式 (监听文件变化)
pnpm dev

# 类型检查
pnpm typecheck

# 版本检查
pnpm version:check

# 同步依赖版本
pnpm version:sync
```

---

## 📄 License

MIT

---

## 🏗️ 项目架构

Vite Enhance Kit 采用 Monorepo 架构，包含多个功能包：

### 包结构

* **`packages/vite-enhance`** - 统一主包
  * `defineEnhanceConfig` - 主配置函数
  * 配置验证与默认值处理
  * Vite 配置转换
  * 类型定义（配置、插件等）
  * 工具函数与日志工具
  * 官方插件（analyze、cache、cdn、framework-*、pwa等）

### 插件架构

每个插件都实现 `EnhancePlugin` 接口，包含：

* `name` - 插件名称
* `version` - 插件版本
* `apply` - 应用环境（serve/build/both）
* `vitePlugin()` - 返回 Vite 插件
* 生命周期钩子函数

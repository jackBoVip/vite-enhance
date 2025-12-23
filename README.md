# Vite Enhance Kit

> 🚀 **一个位于 Vite 之上的工程化增强层，用最少的配置交付大厂级前端工程体验**

---

## ✨ 它是什么？

**Vite Enhance Kit** 是一个基于 Vite 的工程化增强工具包，提供：

* 智能项目类型与框架识别（Vue / React）
* 应用构建（App）与库构建（Lib）的统一抽象
* 官方维护的工程化插件生态
* 企业级能力（CDN、内网支持、PWA、构建优化等）

它 **不替代 Vite**，而是作为一层 *Enhance Layer*，让 Vite 在真实项目中更好用、更统一、更可治理。

---

## 🤔 为什么需要它？

在真实的中大型项目中，前端工程往往面临以下问题：

* 项目形态多样：Web（Vue / React）、组件库、Electron、React Native
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
| 适用 | Vue / React 应用 & 组件库 |
| 风格 | 约定优于配置、渐进增强          |
| 用户 | 中大型项目、技术负责人、库作者      |

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
    framework: 'auto', // 自动检测 Vue/React
    plugins: {
      cdn: true,        // CDN 外部化
      pwa: true,        // PWA 支持
      analyze: true,    // 包分析
      cache: true       // 构建缓存
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

* Web 应用（Vue / React）
* 组件库 / SDK（Lib 模式）
* Electron（Main / Preload / Renderer）
* React Native（工程配置与共享包层面）

---

### 🧠 智能工程识别

* 自动识别 Vue / React
* 自动识别 App / Lib
* 自动识别 Monorepo / Workspace
* 自动加载匹配的官方插件

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

* 框架插件（Vue / React）
* CDN 插件（支持公网 & 内网 IP）
* 构建压缩（gzip / brotli）
* 构建分析（bundle / plugin）
* PWA / Mock Server

---

### ✅ 智能识别

* 自动识别 Vue / React 项目
* 自动判断 App / Lib 构建模式
* 按需加载官方插件

### ✅ 统一构建模型

* `preset: app` —— 应用构建
* `preset: lib` —— 组件库 / SDK 构建

### ✅ 官方插件生态

* Vue / React 支持
* CDN（支持公网 & 内网 IP）
* 压缩（gzip / brotli）
* 构建分析
* PWA
* Mock Server

---

## 🌐 CDN 插件示例（支持内网）

```ts
cdn({
  enabled: true,
  provider: 'custom',
  baseUrl: 'http://10.0.0.1:8080/cdn',
  modules: {
    react: {
      var: 'React',
      path: 'react.production.min.js'
    }
  }
})
```

适用于：

* 内网环境
* 私有制品仓库
* 离线部署场景

---

## 🧩 插件分级体系

* **Core**：不可移除（项目识别、配置治理）
* **Official**：官方维护（Vue / React / CDN / PWA 等）
* **Community**：社区扩展

> 插件有生命周期、有顺序、可治理。

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

* 本地构建缓存（基于文件 Hash）
* 增量构建（未变更模块跳过）
* 可选远程缓存接口（预留）
* 构建结果复用（CI / 本地）

目标：

* 减少重复构建时间
* 提升 CI 稳定性

---

### 🛡️ 其他推荐增强能力（规划中）

#### 🔍 工程质量与规范

* ESLint / Prettier 预设集成
* 构建前质量校验（Fail Fast）
* 依赖安全扫描（可选）

#### 📊 可观测性

* 构建性能指标输出
* 构建报告（HTML / JSON）
* 插件耗时分析

#### 🔐 企业与私有化支持

* 私有插件仓库
* 企业内网模式（完全离线）
* 构建产物合规检查

---

## 🗺️ Roadmap（规划路线）

### Phase 1 · 核心能力（当前）

* App / Lib 双构建模型
* Vue / React 自动识别
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

# 运行测试
pnpm test

# 类型检查
pnpm typecheck
```

---

## 📄 License

MIT

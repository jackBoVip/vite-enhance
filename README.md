# Vite Enhance Kit

[English](./README.en.md) | 简体中文

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

## ⚡ 快速开始

### 1️⃣ 安装

```bash
# 使用 pnpm (推荐)
pnpm add -D vite-enhance

# 使用 npm
npm install -D vite-enhance

# 使用 yarn  
yarn add -D vite-enhance
```

> **注意**：`vite-enhance` 应作为开发依赖安装，因为它是构建工具。

### 2️⃣ 配置项目

```ts
// vite.config.ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // ========== 自动检测（推荐） ==========
    // preset 会自动检测项目类型（app/lib），无需配置
    // 框架会根据 package.json 依赖自动检测（Vue/React/Svelte 等）
    
    // ========== CDN 优化 ==========
    cdn: {
      autoDetect: true,              // 自动检测依赖并外部化
      autoDetectDeps: 'dependencies', // 检测范围：dependencies | all | production
      cdnProvider: 'jsdelivr',        // CDN 提供商：jsdelivr | unpkg | cdnjs
    },
    
    // ========== 构建优化 ==========
    compress: {
      format: 'tar.gz',  // 压缩格式：tar | tar.gz | zip
      enabled: true,
    },
    
    // ========== 开发体验 ==========
    analyze: {
      enabled: true,     // 构建分析
      open: false,       // 构建后自动打开
      template: 'treemap', // 可视化模板
    },
  },
  
  // 原生 Vite 配置（可选）
  vite: {
    // 你的 Vite 配置...
  }
})
```

### 最小化配置

如果你只需要基础功能，可以使用最简配置：

```ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // 自动检测项目类型与框架
    // 使用默认能力（cache/compress 默认开启）
  }
})
```

### 3️⃣ 开始使用

```bash
# 开发模式（自动检测框架）
npm run dev

# 构建生产版本（按配置启用 CDN / 分析 / PWA / 压缩等）
npm run build

# 预览构建结果
npm run preview
```

### 构建产物

**应用构建（App）：**
```bash
dist/
├── your-package-name/    # 按包名组织
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
└── lib/
    └── your-package-name.tar.gz  # 压缩包
```

**库构建（Lib）：**
```bash
dist/
├── index.mjs             # ES 模块格式
├── index.cjs             # CommonJS 格式
└── lib/
    └── your-package-name.tar.gz  # 压缩包（可选）
```

---

## 🧠 核心能力一览

### 🎯 智能检测（零配置）

**项目类型自动检测**
* ✅ 检测 `index.html` → App 模式
* ✅ 检测 `package.json` 的 `main`/`module` 字段 → Lib 模式
* ✅ 自动配置构建输出路径
  * App 模式：`dist/包名/`
  * Lib 模式：直接输出到 `dist/`

**框架自动检测**
* ✅ Vue / React / Svelte / Solid / Lit / Preact
* ✅ 从 `package.json` 依赖自动识别
* ✅ 自动加载对应框架插件
* ✅ Vue 项目自动使用 runtime 版本（体积更小）

**依赖自动检测**
* ✅ CDN 自动外部化常用库
* ✅ 自动添加 CSS 资源（Element Plus、Antd 等）
* ✅ 自动配置 crossorigin 属性

### 📦 包架构设计

* `vite-enhance` - 主入口包（单包设计）
* 内置所有核心功能插件
* 零额外依赖（通过 optionalDependencies）

### 🧩 多项目 / 多形态支持

* ✅ Web 应用（Vue / React / Svelte / Solid / Lit / Preact）
* ✅ 组件库 / SDK（Lib 模式）
* 🚧 Electron（规划中）
* 🚧 React Native（规划中）

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

### ✅ 核心功能

**1. 智能检测**
* 项目类型：App / Lib 自动识别
* 框架类型：Vue / React / Svelte / Solid / Lit / Preact
* 依赖外部化：常用库自动 CDN 化

**2. 构建优化**
* 压缩：支持 tar / tar.gz / zip 格式
  * App 模式：默认启用压缩
  * Lib 模式：可选择禁用压缩（`compress.disableForLib: true`）
* 分析：可视化构建产物大小
* 输出：智能目录结构
  * App 模式：按包名组织（`dist/包名/`）
  * Lib 模式：直接输出（`dist/`）

**3. CDN 功能**
* 自动检测依赖并外部化
* 支持多 CDN 提供商（jsdelivr / unpkg / cdnjs）
* 自动添加 CSS 资源
* 自动配置 CORS（crossorigin="anonymous"）
* 支持自定义 CDN 地址

**4. 框架支持**
* Vue：自动使用 runtime 版本
* React：自动配置 JSX
* Svelte / Solid / Lit / Preact：开箱即用

---

## 🌐 CDN 功能详解

### 基础用法（自动检测）

```ts
enhance: {
  cdn: {
    autoDetect: true,              // 自动检测 package.json 中的依赖
    autoDetectDeps: 'dependencies', // 仅检测 dependencies
  }
}
```

### 高级配置

```ts
enhance: {
  cdn: {
    // 方式 1: 自动检测 + 排除/包含
    autoDetect: true,
    autoDetectDeps: 'all',           // dependencies | all | production
    autoDetectExclude: ['lodash'],   // 排除某些依赖
    autoDetectInclude: ['moment'],   // 强制包含某些依赖
    
    // 方式 2: 手动指定模块
    modules: ['vue', 'element-plus'], // 手动指定要外部化的模块
    
    // CDN 提供商
    cdnProvider: 'jsdelivr',  // jsdelivr | unpkg | cdnjs | custom
    customProdUrl: 'https://your-cdn.com/{name}@{version}/{path}',
    
    // 开发模式
    enableInDevMode: false,   // 默认仅生产环境启用
    
    // 自定义标签生成（高级）
    generateScriptTag: (name, url) => ({
      crossorigin: 'anonymous',
      integrity: 'sha384-...',
    }),
  }
}
```

### 支持的模块

自动检测支持以下常用库（自动添加 CSS）：

* **Vue 生态**: `vue`, `vue-router`, `element-plus`
* **React 生态**: `react`, `react-dom`, `antd`
* **工具库**: `lodash`, `axios`, `moment`, `dayjs`
* **其他**: `jquery`, `bootstrap`, `echarts`, `three`

### 效果对比

```bash
# 未使用 CDN
✓ dist/index.js   245 kB

# 使用 CDN 后
✓ dist/index.js   12 kB  ⚡️ 减少 95%
+ Vue 从 CDN 加载
+ Element Plus 从 CDN 加载（含 CSS）
```

### 适用场景

* ✅ 公网部署（利用 CDN 加速）
* ✅ 多页面应用（共享缓存）
* ✅ 减小构建产物体积
* ✅ 内网环境（配置私有 CDN）

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

### ✅ 推荐场景

* **企业级中后台系统**：自动化工程配置，减少重复劳动
* **多项目统一规范**：保持工程配置一致性
* **Monorepo 架构**：支持多包协作，自动处理依赖
* **组件库 / SDK**：Lib 模式开箱即用
* **性能优化项目**：CDN 外部化减小产物体积

### ⚠️ 不适合场景

* 需要极致自定义构建配置的项目（直接用 Vite）
* SSR / SSG 框架项目（使用 Nuxt / Next）
* 对构建工具有特殊要求的项目

---

## 🚀 进阶配置

### 压缩功能

```ts
enhance: {
  compress: {
    format: 'tar.gz',      // tar | tar.gz | zip
    enabled: true,         // 默认启用
    disableForLib: false,  // 库构建时是否禁用压缩
    appOnly: false,        // 仅在应用构建时启用
    outputDir: 'dist/lib', // 输出目录
    fileName: 'custom',    // 自定义文件名（可选）
  }
}
```

**效果对比**：
* tar: 246 KB（未压缩）
* tar.gz: 82 KB（gzip 压缩）
* zip: 82 KB（zip 压缩）

**库构建优化**：
```ts
// 库构建时禁用压缩（推荐）
enhance: {
  compress: {
    disableForLib: true,  // 库构建时不生成压缩包
  }
}
```

### 构建分析

```ts
enhance: {
  analyze: {
    enabled: true,
    open: false,              // 构建后自动打开
    filename: 'stats.html',   // 报告文件名
    template: 'treemap',      // treemap | sunburst | network
    gzipSize: true,           // 显示 gzip 体积
    brotliSize: true,         // 显示 brotli 体积
  }
}
```

### 禁用某些功能

```ts
enhance: {
  cdn: false,      // 完全禁用 CDN
  compress: false, // 禁用压缩
  analyze: false,  // 禁用分析
}
```

### 库构建配置

```ts
// 库构建默认配置（自动应用）
enhance: {
  // 无需配置，自动检测并应用以下默认值：
  // build.lib.entry: 'src/index.ts'
  // build.lib.formats: ['es', 'cjs']
  // build.lib.fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
}

// 自定义库构建配置（用户配置优先）
enhance: {
  // 用户配置会覆盖默认值
}
```

### 多框架项目

```ts
// Vue 项目
enhance: {
  // 自动检测 Vue，无需配置
  cdn: {
    modules: ['vue', 'vue-router', 'element-plus']
  }
}

// React 项目
enhance: {
  // 自动检测 React，无需配置
  cdn: {
    modules: ['react', 'react-dom', 'antd']
  }
}
```

---

## 🗺️ Roadmap（规划路线）

### Phase 1 · 核心能力（✅ 已完成）

* ✅ App / Lib 双构建模型
* ✅ Vue / React / Svelte / Solid / Lit / Preact 自动识别
* ✅ 官方插件体系
* ✅ CDN（自动检测 + 多提供商）
* ✅ 构建压缩（tar / tar.gz / zip）
* ✅ 构建分析

### Phase 2 · 工程规模化（🚧 进行中）

* 🚧 Monorepo 深度支持
* 🚧 构建缓存与加速
* 🚧 构建可观测性
* 🚧 PWA 支持

### Phase 3 · 跨平台工程（💭 规划中）

* 💭 Electron 工程增强
* 💭 React Native 工程协同
* 💭 Web / Desktop / Mobile 工程统一

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

## ❓ 常见问题

### Q1: 为什么构建后 CDN 资源加载失败？

**A**: 检查以下几点：
1. 网络是否能访问 `cdn.jsdelivr.net`
2. 如果是内网环境，配置 `customProdUrl` 指向内网 CDN
3. 如果不需要 CDN，设置 `cdn: false`

### Q2: Vue 项目使用了哪个版本的 Vue？

**A**: 自动使用 `vue.runtime.global.prod.js`（runtime 版本），因为：
* SFC 项目在构建时已经编译了模板
* Runtime 版本不包含模板编译器，体积更小（约 30%）

### Q3: 怎么禁用某些功能？

**A**: 直接设置为 `false`：
```ts
enhance: {
  cdn: false,      // 禁用 CDN
  compress: false, // 禁用压缩
  analyze: false,  // 禁用分析
}
```

### Q4: 支持哪些 CDN 提供商？

**A**: 支持：
* `jsdelivr` - 默认，全球 CDN
* `unpkg` - npm 官方 CDN
* `cdnjs` - Cloudflare CDN
* `custom` - 自定义 CDN 地址

### Q5: 怎么在 Monorepo 中使用？

**A**: 在每个子包的 `vite.config.ts` 中独立配置：
```ts
// packages/app1/vite.config.ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // 自动检测项目类型和框架
  }
})
```

### Q6: crossorigin="anonymous" 是否会导致问题？

**A**: 不会。主流 CDN（jsdelivr、unpkg）都支持 CORS。如果自建 CDN 不支持 CORS，可以自定义：
```ts
cdn: {
  generateScriptTag: () => ({}), // 不添加 crossorigin
}
```

---

## 📄 License

MIT

---

## 📦 项目结构

```
vite-enhance/
├── packages/
│   └── vite-enhance/          # 主包（单包设计）
│       ├── src/
│       │   ├── config/        # 配置处理
│       │   ├── plugins/       # 内置插件
│       │   │   ├── analyze/   # 构建分析
│       │   │   ├── cdn/       # CDN 外部化
│       │   │   ├── compress/  # 构建压缩
│       │   │   └── framework/ # 框架支持
│       │   └── shared/        # 共享工具
│       └── package.json
├── examples/                  # 示例项目
│   ├── app-build-test/       # 应用构建示例
│   ├── lib-build-test/       # 库构建示例（默认配置）
│   ├── lib-custom-config/    # 库构建示例（自定义配置）
│   ├── design/               # 设计系统库示例
│   ├── vue-ts-demo/          # Vue TypeScript 示例
│   └── tsconfig/             # TypeScript 配置预设
├── docs/                     # 文档
│   └── vite-enhance-analysis.md  # 完整架构分析
├── scripts/                  # 构建和发布脚本
└── .kiro/                    # Kiro 配置和规格文档
    └── specs/                # 功能规格文档
```

### 示例项目说明

所有示例项目都位于 `examples/` 目录，详细说明请参考 [examples/README.md](./examples/README.md)。

### 文档说明

* **README.md** - 项目主文档（本文件）
* **docs/vite-enhance-analysis.md** - 完整的架构分析和设计文档
* **examples/README.md** - 示例项目说明
* **PUBLISHING.md** - 发布指南

---

## 🧹 项目维护

### 清理构建产物

```bash
# 清理所有构建产物（推荐）
pnpm clean

# 或手动清理（Windows PowerShell）
Remove-Item -Recurse -Force packages/*/dist, examples/*/dist

# 或手动清理（Unix/Linux/Mac）
rm -rf packages/*/dist examples/*/dist
```

### 依赖管理

本项目使用 pnpm workspace catalog 统一管理依赖版本，详见上方"依赖管理"章节。

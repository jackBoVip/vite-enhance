# Vite Enhance Kit

English | [简体中文](./README.md)

> 🚀 **An engineering enhancement layer built on top of Vite, delivering enterprise-grade frontend engineering experience with minimal configuration**

---

## ✨ What is it?

**Vite Enhance Kit** is an engineering enhancement toolkit based on Vite, providing:

* Intelligent project type and framework detection (Vue / React / Svelte / Solid / Lit / Preact)
* Unified abstraction for App and Library builds
* Officially maintained engineering plugin ecosystem
* Enterprise-grade capabilities (CDN, Cache, PWA, Build Analysis, etc.)

It **does not replace Vite**, but serves as an *Enhance Layer* to make Vite more usable, unified, and governable in real-world projects.

---

## 🤔 Why do you need it?

In real-world medium to large projects, frontend engineering often faces the following challenges:

* Diverse project types: Web (Vue / React / Svelte / Solid / Lit / Preact), Component libraries, Electron, React Native
* Complex repository structures: Monorepo + multiple apps + multiple packages
* Inconsistent build requirements: fast development, stable CI, small bundle size
* Scattered engineering capabilities: CDN, cache, PWA, Mock, specifications each on their own

**Vite Enhance Kit focuses not on "how to bundle", but on "how to do engineering well in the long term".**

It attempts to transform:

> Engineering experience repeatedly validated in large companies into tool capabilities that ordinary projects can also use

---

### When using native Vite, you may have encountered these issues:

* Having to re-select plugins and copy configurations for each project
* Inconsistent configuration styles for Vue / React / Lib projects
* Scattered capabilities like CDN, compression, PWA, Mock
* Unable to accumulate engineering best practices

**Vite Enhance Kit solves "engineering problems", not "build problems".**

---

## 🎯 Core Positioning

| Dimension | Description |
| --------- | ----------- |
| Positioning | Vite Engineering Enhancement Layer |
| Application | Vue / React / Svelte / Solid / Lit / Preact apps & component libraries |
| Style | Convention over Configuration, Progressive Enhancement |
| Users | Medium-large projects, Tech Leads, Library Authors |
| Features | Type-safe, Plugin-based, Extensible |

Comparison with similar solutions:

| Solution | What it does | What it doesn't |
| -------- | ------------ | --------------- |
| Vite | Build tool | Engineering governance |
| Nuxt / Next | Application framework | Progressive adoption |
| Rsbuild | Build wrapper | Plugin ecosystem |
| **Vite Enhance Kit** | **Engineering enhancement** | **Framework takeover** |

---

## ⚡ Quick Start

### 1️⃣ Installation

```bash
# Using pnpm (recommended)
pnpm add -D vite-enhance

# Using npm
npm install -D vite-enhance

# Using yarn
yarn add -D vite-enhance
```

> **Note**: `vite-enhance` should be installed as a dev dependency since it's a build tool.

### 2️⃣ Configure Project

```ts
// vite.config.ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // ========== Auto Detection (Recommended) ==========
    // preset auto-detects project type (app/lib), no configuration needed
    // framework auto-detected from package.json dependencies (Vue/React/Svelte, etc.)
    
    // ========== CDN Optimization ==========
    cdn: {
      autoDetect: true,              // Auto-detect dependencies and externalize
      autoDetectDeps: 'dependencies', // Detection scope: dependencies | all | production
      cdnProvider: 'jsdelivr',        // CDN provider: jsdelivr | unpkg | cdnjs
    },
    
    // ========== Build Optimization ==========
    compress: {
      format: 'tar.gz',  // Compression format: tar | tar.gz | zip
      enabled: true,
    },
    
    // ========== Developer Experience ==========
    analyze: {
      enabled: true,     // Build analysis
      open: false,       // Auto-open after build
      template: 'treemap', // Visualization template
    },
  },
  
  // Native Vite config (optional)
  vite: {
    // Your Vite config...
  }
})
```

### Minimal Configuration

If you only need basic features, use the simplest config:

```ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // All features will be auto-detected and configured
    // No configuration needed!
  }
})
```

### 3️⃣ Start Using

```bash
# Development mode (auto-detect framework)
npm run dev

# Build production version (auto CDN externalization, compression, etc.)
npm run build

# Preview build result
npm run preview
```

### Build Output

```bash
dist/
├── your-package-name/    # Organized by package name
│   ├── index.html
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
└── lib/
    └── your-package-name.tar.gz  # Compressed archive
```

---

## 🧠 Core Capabilities

### 🎯 Intelligent Detection (Zero Config)

**Auto Project Type Detection**
* ✅ Detect `index.html` → App mode
* ✅ Detect `main`/`module` fields in `package.json` → Lib mode
* ✅ Auto-configure build output path (`dist/package-name/`)

**Auto Framework Detection**
* ✅ Vue / React / Svelte / Solid / Lit / Preact
* ✅ Auto-identify from `package.json` dependencies
* ✅ Auto-load corresponding framework plugins
* ✅ Vue projects auto-use runtime version (smaller bundle)

**Auto Dependency Detection**
* ✅ Auto-externalize common libraries to CDN
* ✅ Auto-add CSS resources (Element Plus, Antd, etc.)
* ✅ Auto-configure crossorigin attribute

### 📦 Package Architecture

* `vite-enhance` - Main entry package (monolithic design)
* Built-in all core feature plugins
* Zero additional dependencies (via optionalDependencies)

### 🧩 Multi-project / Multi-type Support

* ✅ Web apps (Vue / React / Svelte / Solid / Lit / Preact)
* ✅ Component libraries / SDKs (Lib mode)
* 🚧 Electron (planned)
* 🚧 React Native (planned)

---

### ⚙️ Unified Build & Engineering Model

* App Build (App Preset)
* Library Build (Lib Preset)
* Unified Web / Desktop / Mobile engineering model

---

### ⚡ Performance & Build Experience

* Build cache (local / remote reserved)
* Incremental builds
* Build analysis & timing statistics

---

### 🧩 Official Plugin Ecosystem

* Framework plugins (Vue / React / Svelte / Solid / Lit / Preact)
* CDN plugin (supports public & private networks, includes auto-detection)
* Build cache plugin (high-performance cache & smart invalidation)
* Build analysis plugin (includes build time statistics)
* PWA plugin

---

### ✅ Core Features

**1. Intelligent Detection**
* Project type: App / Lib auto-identification
* Framework type: Vue / React / Svelte / Solid / Lit / Preact
* Dependency externalization: Common libraries auto-CDN

**2. Build Optimization**
* Compression: Support tar / tar.gz / zip formats
* Analysis: Visualize build output size
* Output: Auto-organize by package name directory structure

**3. CDN Features**
* Auto-detect dependencies and externalize
* Support multiple CDN providers (jsdelivr / unpkg / cdnjs)
* Auto-add CSS resources
* Auto-configure CORS (crossorigin="anonymous")
* Support custom CDN URLs

**4. Framework Support**
* Vue: Auto-use runtime version
* React: Auto-configure JSX
* Svelte / Solid / Lit / Preact: Out-of-the-box

---

## 🌐 CDN Feature Details

### Basic Usage (Auto Detection)

```ts
enhance: {
  cdn: {
    autoDetect: true,              // Auto-detect dependencies from package.json
    autoDetectDeps: 'dependencies', // Only detect dependencies
  }
}
```

### Advanced Configuration

```ts
enhance: {
  cdn: {
    // Method 1: Auto-detect + exclude/include
    autoDetect: true,
    autoDetectDeps: 'all',           // dependencies | all | production
    autoDetectExclude: ['lodash'],   // Exclude certain dependencies
    autoDetectInclude: ['moment'],   // Force include certain dependencies
    
    // Method 2: Manually specify modules
    modules: ['vue', 'element-plus'], // Manually specify modules to externalize
    
    // CDN Provider
    cdnProvider: 'jsdelivr',  // jsdelivr | unpkg | cdnjs | custom
    customProdUrl: 'https://your-cdn.com/{name}@{version}/{path}',
    
    // Development Mode
    enableInDevMode: false,   // Only enabled in production by default
    
    // Custom tag generation (advanced)
    generateScriptTag: (name, url) => ({
      crossorigin: 'anonymous',
      integrity: 'sha384-...',
    }),
  }
}
```

### Supported Modules

Auto-detection supports the following common libraries (auto-add CSS):

* **Vue Ecosystem**: `vue`, `vue-router`, `element-plus`
* **React Ecosystem**: `react`, `react-dom`, `antd`
* **Utilities**: `lodash`, `axios`, `moment`, `dayjs`
* **Others**: `jquery`, `bootstrap`, `echarts`, `three`

### Effect Comparison

```bash
# Without CDN
✓ dist/index.js   245 kB

# With CDN
✓ dist/index.js   12 kB  ⚡️ 95% reduction
+ Vue loaded from CDN
+ Element Plus loaded from CDN (with CSS)
```

### Use Cases

* ✅ Public network deployment (leverage CDN acceleration)
* ✅ Multi-page applications (shared cache)
* ✅ Reduce build output size
* ✅ Intranet environments (configure private CDN)

---

## 🧩 Plugin Hierarchy

* **Core**: Core functionality (config governance, type definitions)
* **Official**: Officially maintained (Vue / React / Svelte / Solid / Lit / Preact / CDN / Cache / Analyze / PWA, etc.)
* **Community**: Community extensions

> Plugins have lifecycles, order, and governance.

### Plugin Lifecycle

* `configResolved` - Config resolution complete
* `buildStart` - Build starts
* `buildEnd` - Build ends
* `configureServer` - Server configuration
* `vitePlugin` - Return Vite plugin

---

## 🛣️ Suitable Scenarios

### ✅ Recommended Scenarios

* **Enterprise back-office systems**: Automated engineering configuration, reduce repetitive work
* **Multi-project unified standards**: Maintain engineering configuration consistency
* **Monorepo architecture**: Support multi-package collaboration, auto-handle dependencies
* **Component libraries / SDKs**: Lib mode out-of-the-box
* **Performance optimization projects**: CDN externalization reduces bundle size

### ⚠️ Not Suitable For

* Projects requiring extreme custom build configuration (use Vite directly)
* SSR / SSG framework projects (use Nuxt / Next)
* Projects with special build tool requirements

---

## 🚀 Advanced Configuration

### Compression

```ts
enhance: {
  compress: {
    format: 'tar.gz',      // tar | tar.gz | zip
    enabled: true,         // Enabled by default
    outputDir: 'dist/lib', // Output directory
    fileName: 'custom',    // Custom filename (optional)
  }
}
```

**Effect Comparison**:
* tar: 246 KB (uncompressed)
* tar.gz: 82 KB (gzip compression)
* zip: 82 KB (zip compression)

### Build Analysis

```ts
enhance: {
  analyze: {
    enabled: true,
    open: false,              // Auto-open after build
    filename: 'stats.html',   // Report filename
    template: 'treemap',      // treemap | sunburst | network
    gzipSize: true,           // Show gzip size
    brotliSize: true,         // Show brotli size
  }
}
```

### Disable Features

```ts
enhance: {
  cdn: false,      // Completely disable CDN
  compress: false, // Disable compression
  analyze: false,  // Disable analysis
}
```

### Multi-framework Projects

```ts
// Vue project
enhance: {
  // Auto-detect Vue, no configuration needed
  cdn: {
    modules: ['vue', 'vue-router', 'element-plus']
  }
}

// React project
enhance: {
  // Auto-detect React, no configuration needed
  cdn: {
    modules: ['react', 'react-dom', 'antd']
  }
}
```

---

## 🗺️ Roadmap

### Phase 1 · Core Capabilities (✅ Completed)

* ✅ App / Lib dual build model
* ✅ Vue / React / Svelte / Solid / Lit / Preact auto-detection
* ✅ Official plugin system
* ✅ CDN (auto-detection + multiple providers)
* ✅ Build compression (tar / tar.gz / zip)
* ✅ Build analysis

### Phase 2 · Engineering Scalability (🚧 In Progress)

* 🚧 Deep Monorepo support
* 🚧 Build cache & acceleration
* 🚧 Build observability
* 🚧 PWA support

### Phase 3 · Cross-platform Engineering (💭 Planned)

* 💭 Electron engineering enhancement
* 💭 React Native engineering collaboration
* 💭 Unified Web / Desktop / Mobile engineering

---

## 📦 Dependency Management

This project uses pnpm's workspace catalog feature to centrally manage all dependency versions.

### Adding New Dependencies

1. Add dependency version in `pnpm-workspace.yaml` catalog:
   ```yaml
   catalog:
     new-dependency: ^1.0.0
   ```

2. Reference in package.json using catalog syntax:
   ```json
   {
     "dependencies": {
       "new-dependency": "catalog:"
     }
   }
   ```

### Updating Dependency Versions

1. Update version in `pnpm-workspace.yaml` catalog
2. Run `pnpm install` to update all packages
3. Run `pnpm version:check` to verify consistency

### Validation

Run `pnpm version:check` to verify:
- All external dependencies use catalog references
- All catalog entries exist
- Workspace dependencies use correct syntax

### Build Output Management

The project has configured `.gitignore` to ensure all package `dist/` directories are not committed to git:
- Build outputs only exist locally
- Regenerated with each build
- Keep repository clean, avoid unnecessary file conflicts

For more details, see [Dependency Management Guide](./DEPENDENCY_MANAGEMENT.md).

---

## 🔗 Related Links

- [GitHub Repository](https://github.com/jackBoVip/vite-enhance)
- [npm Package](https://www.npmjs.com/package/vite-enhance)
- [Publishing Guide](PUBLISHING.md) - Learn how to publish new versions
- [Changelog](CHANGELOG.md) - View version update history

## 🤝 Contributing

We welcome all forms of contributions! Please check the [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the project
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Submit Pull Request

### Local Development

```bash
# Clone project
git clone https://github.com/jackBoVip/vite-enhance.git
cd vite-enhance

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode (watch file changes)
pnpm dev

# Type checking
pnpm typecheck

# Version check
pnpm version:check

# Sync dependency versions
pnpm version:sync
```

---

## ❓ FAQ

### Q1: Why do CDN resources fail to load after build?

**A**: Check the following:
1. Can the network access `cdn.jsdelivr.net`
2. If in intranet environment, configure `customProdUrl` to point to intranet CDN
3. If CDN is not needed, set `cdn: false`

### Q2: Which version of Vue is used in Vue projects?

**A**: Auto-use `vue.runtime.global.prod.js` (runtime version), because:
* SFC projects have templates compiled at build time
* Runtime version doesn't include template compiler, smaller bundle (about 30% reduction)

### Q3: How to disable certain features?

**A**: Simply set to `false`:
```ts
enhance: {
  cdn: false,      // Disable CDN
  compress: false, // Disable compression
  analyze: false,  // Disable analysis
}
```

### Q4: Which CDN providers are supported?

**A**: Supports:
* `jsdelivr` - Default, global CDN
* `unpkg` - npm official CDN
* `cdnjs` - Cloudflare CDN
* `custom` - Custom CDN URL

### Q5: How to use in Monorepo?

**A**: Configure independently in each sub-package's `vite.config.ts`:
```ts
// packages/app1/vite.config.ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // Auto-detect project type and framework
  }
})
```

### Q6: Will crossorigin="anonymous" cause issues?

**A**: No. Mainstream CDNs (jsdelivr, unpkg) all support CORS. If your self-hosted CDN doesn't support CORS, you can customize:
```ts
cdn: {
  generateScriptTag: () => ({}), // Don't add crossorigin
}
```

---

## 📄 License

MIT

---

## 🏗️ Project Architecture

Vite Enhance Kit uses Monorepo architecture, containing multiple functional packages:

### Package Structure

* **`packages/config`** - Config processing core logic
  * `defineEnhanceConfig` - Main config function
  * Config validation & default value handling
  * Vite config transformation

* **`packages/shared`** - Shared types & utilities
  * Type definitions (config, plugins, etc.)
  * Utility functions
  * Logger utilities

* **`packages/vite-enhance`** - Main entry package
  * Re-exports config package functionality
  * User entry point

* **`packages/plugins/*`** - Official plugins
  * `analyze` - Build analysis plugin
  * `cache` - Build cache plugin
  * `cdn` - CDN externalization plugin
  * `framework-*` - Framework support plugins (Vue / React / Svelte / Solid / Lit / Preact)
  * `pwa` - PWA support plugin

### Plugin Architecture

Each plugin implements the `EnhancePlugin` interface, including:

* `name` - Plugin name
* `version` - Plugin version
* `apply` - Application environment (serve/build/both)
* `vitePlugin()` - Return Vite plugin
* Lifecycle hook functions

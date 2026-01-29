# Changelog

## [0.4.0] - 2026-01-29

### 🎯 Major Refactoring

This release includes a comprehensive refactoring for better maintainability, extensibility, and performance.

#### Architecture Improvements

- **Modular Structure**: Split `vite-integration.ts` into multiple focused modules:
  - `detectors.ts` - Framework and preset detection
  - `plugin-factory.ts` - Plugin creation factory
  - `vite-integration.ts` - Core Vite config generation (now much smaller)

- **New Shared Modules**:
  - `package-utils.ts` - Cached package.json utilities
  - `cdn-modules.ts` - Centralized CDN module configurations

#### Dependency Optimization

- **Optional Peer Dependencies**: Framework plugins moved from `dependencies` to `peerDependenciesMeta`:
  - `@vitejs/plugin-vue`
  - `@vitejs/plugin-react`
  - `@sveltejs/vite-plugin-svelte`
  - `vite-plugin-solid`
  - `@preact/preset-vite`
  - `vite-plugin-pwa`
  - `rollup-plugin-visualizer`
  - `vite-plugin-vue-devtools`
  
  **Impact**: Significantly reduced installation size. Only install the plugins you need!

- **Added**: `picomatch` for better glob pattern matching

#### Performance Improvements

- **Package.json Caching**: Added TTL-based cache to avoid repeated file reads
- **Plugin Import Caching**: Plugin dynamic imports are now cached
- **Pattern Matching Cache**: Glob pattern regex compilation is cached

#### Developer Experience

- **Unified Logger**: New configurable logging system with levels (debug, info, warn, error)
  - `createLogger(name)` - Create namespaced logger
  - `setLogLevel(level)` - Global log level control
  - Success messages with ✓ indicator

- **Better Type Safety**: Reduced `any` usage throughout the codebase

- **ESLint Configuration**: Added `eslint.config.js` for code quality

#### New Exports

```typescript
// Logger utilities
export { createLogger, setLogLevel, getLogLevel, type Logger, type LogLevel };

// Package utilities
export { getPackageJson, getPackageName, hasDependency, clearPackageCache };

// CDN utilities
export { CDN_MODULE_CONFIGS, getCDNUrlTemplate, getSupportedModules };

// Plugin factory
export { createFrameworkPlugin, createFeaturePlugin, isPluginAvailable };

// Detectors
export { detectFramework, detectPreset, isMonorepo };
```

#### CDN Module Updates

- Added support for more modules: `pinia`, `vue-demi`, `naive-ui`, `@arco-design/web-vue`, `date-fns`, `d3`
- Better module version detection
- Centralized configuration reduces duplication

### Breaking Changes

- Minimum Node.js version is now 18.0.0
- Framework plugins are no longer auto-installed, add them to your project's dependencies

### Migration Guide

If you were relying on auto-installed framework plugins, add them to your project:

```bash
# For Vue projects
pnpm add -D @vitejs/plugin-vue vite-plugin-vue-devtools

# For React projects
pnpm add -D @vitejs/plugin-react

# For bundle analysis
pnpm add -D rollup-plugin-visualizer

# For PWA support
pnpm add -D vite-plugin-pwa
```

---

## [0.3.3] - 2026-01-15

### Fixed
- Library build now auto-configures `rollupOptions.output.exports: "named"` to avoid mixed export warnings

---

## [0.3.0] - 2026-01-08

### Added
- Library build preset with smart defaults
- Auto-detection of project type (app/lib)
- Compress plugin for build artifacts

### Changed
- Library builds output to `dist/` directly
- App builds output to `dist/{packageName}/`

---

## [0.2.0] - 2025-12-20

### Added
- Vue DevTools integration
- CDN auto-detection feature
- Cache plugin with intelligent invalidation

---

## [0.1.0] - 2025-12-01

### Added
- Initial release
- `defineEnhanceConfig` for type-safe configuration
- Framework detection (Vue, React, Svelte, Solid, Lit, Preact)
- Preset system (app, lib)
- Plugin system with lifecycle hooks

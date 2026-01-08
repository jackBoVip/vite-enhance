# 构建错误排查指南

## 错误：Could not resolve entry module "index.html"

### 问题描述
```
✗ Build failed in 16ms
error during build:
Could not resolve entry module "index.html".
```

### 原因分析
这个错误表明 Vite 在尝试查找 `index.html` 文件作为入口点，说明：
1. 项目被检测为**应用（app）模式**而不是**库（lib）模式**
2. 但项目中没有 `index.html` 文件

### 解决方案

#### 方案 1: 显式指定 preset 为 'lib'

在 `vite.config.ts` 中明确指定项目类型：

```ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    preset: 'lib',  // 👈 显式指定为库模式
    compress: false
  }
})
```

#### 方案 2: 确保 package.json 配置正确

检查 `package.json` 是否包含库项目的标识字段：

```json
{
  "name": "your-package",
  "main": "./dist/index.mjs",      // ✅ 必须指向 dist/
  "module": "./dist/index.mjs",    // ✅ 必须指向 dist/
  "types": "./dist/index.d.ts",    // ✅ 可选但推荐
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    }
  }
}
```

**关键点**：
- `main` 和 `module` 字段必须指向 `dist/`、`lib/` 或 `es/` 目录
- 这是自动检测库项目的主要依据

#### 方案 3: 检查项目结构

确保项目中**没有**以下文件/目录（这些会被识别为应用项目）：
- ❌ `index.html`
- ❌ `public/` 目录
- ❌ `assets/` 目录
- ❌ `static/` 目录

#### 方案 4: 重新构建 vite-enhance 包

如果你刚更新了 vite-enhance 的代码：

```bash
# 1. 清理并重新构建
cd packages/vite-enhance
pnpm clean
pnpm build

# 2. 重新安装依赖（在项目根目录）
cd ../..
pnpm install

# 3. 尝试重新构建你的项目
cd examples/your-project
pnpm build
```

---

## 警告：Entry module is using named and default exports together

### 问题描述
```
Entry module "src/index.ts" is using named and default exports together. 
Consumers of your bundle will have to use `lib-build-test.default` to access 
the default export, which may not be what you want. 
Use `output.exports: "named"` to disable this warning.
```

### 原因分析
这个警告是 Rollup 在检测到源文件同时使用命名导出和默认导出时发出的。例如：

```ts
// src/index.ts
export function hello() { }  // 命名导出
export default { hello }     // 默认导出
```

### 解决方案

**vite-enhance 0.3.1+ 已自动处理**

从 vite-enhance 0.3.1 版本开始，库构建会自动添加 `output.exports: "named"` 配置，不再显示此警告。

如果你使用的是旧版本，可以：

1. **升级到最新版本**（推荐）：
```bash
pnpm update vite-enhance
```

2. **手动配置**（如果不想升级）：
```ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    preset: 'lib'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          exports: 'named'  // 禁用混合导出警告
        }
      }
    }
  }
})
```

3. **修改源代码**（如果你想保持严格的导出方式）：
```ts
// 只使用命名导出
export function hello() { }
export const VERSION = '1.0.0'

// 移除默认导出
// export default { hello, VERSION }
```

### 注意事项

使用 `exports: "named"` 后，消费者需要这样导入：

```ts
// ESM
import { hello, VERSION } from 'your-package'

// CommonJS
const { hello, VERSION } = require('your-package')
```

如果你的库需要支持默认导出，建议只使用默认导出或只使用命名导出，避免混合使用。

---

## 验证检测结果

临时添加日志查看检测结果（在 `vite.config.ts` 中）：

```ts
import { defineEnhanceConfig } from 'vite-enhance'

const config = defineEnhanceConfig({
  enhance: {
    // preset: 'lib',  // 注释掉，让它自动检测
    compress: false
  }
})

console.log('Vite config:', config)

export default config
```

运行构建时会输出配置信息，检查是否正确识别为库模式。

### 常见场景

#### 场景 1: design 示例项目

```ts
// examples/design/vite.config.mts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    preset: 'lib',  // 显式指定
    compress: false
  },
  vite: {
    publicDir: 'src/scss-bem',
  },
})
```

#### 场景 2: lib-build-test 示例项目

```ts
// examples/lib-build-test/vite.config.ts
import { defineEnhanceConfig } from 'vite-enhance'

export default defineEnhanceConfig({
  enhance: {
    // 自动检测（因为 package.json 有 main/module 字段）
    compress: {
      disableForLib: true
    }
  }
})
```

### 调试步骤

1. **检查 package.json**
   ```bash
   cat package.json | grep -E "(main|module|types)"
   ```

2. **检查是否有 HTML 文件**
   ```bash
   ls -la | grep html
   ```

3. **检查项目目录**
   ```bash
   ls -la
   ```

4. **查看 vite-enhance 版本**
   ```bash
   npm list vite-enhance
   ```

5. **清理缓存**
   ```bash
   rm -rf node_modules/.vite
   rm -rf node_modules/.vite-temp
   ```

### 如果问题仍然存在

1. 提供完整的错误日志
2. 提供 `package.json` 内容
3. 提供 `vite.config.ts` 内容
4. 提供项目目录结构（`ls -la`）

这样可以更准确地诊断问题。

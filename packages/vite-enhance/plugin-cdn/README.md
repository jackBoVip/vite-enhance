# @vite-enhance/plugin-cdn

Enhanced CDN plugin for Vite that automatically replaces module imports with CDN links during production builds, similar to `vite-plugin-cdn-import` but with additional features and optimizations.

## Features

- 🚀 **Zero Configuration**: Works out of the box with popular libraries
- 🔄 **Development Mode Support**: Optional CDN replacement in development
- 🎨 **CSS Support**: Automatic CSS file injection for UI libraries
- 🏷️ **Module Aliases**: Support for module aliases (e.g., `react-dom/client`)
- 🌐 **Multiple CDN Providers**: Support for unpkg, jsDelivr, cdnjs, and custom CDNs
- ⚡ **Performance Optimized**: Intelligent caching and parallel processing
- 🛠️ **Customizable**: Custom script and CSS tag generation
- 📦 **TypeScript Support**: Full TypeScript support with type definitions

## Installation

```bash
pnpm add @vite-enhance/plugin-cdn
```

## Usage

### Basic Usage

```typescript
import { defineConfig } from 'vite';
import { createCDNPlugin } from '@vite-enhance/plugin-cdn';

export default defineConfig({
  plugins: [
    createCDNPlugin({
      modules: ['vue', 'react', 'lodash'],
    }),
  ],
});
```

### With Vite Enhance Kit

```typescript
import { defineConfig } from 'vite';
import { createEnhanceConfig } from '@vite-enhance/config';

export default defineConfig(
  createEnhanceConfig({
    cdn: {
      modules: ['vue', 'react', 'react-dom', 'lodash', 'axios'],
      prodUrl: 'https://unpkg.com',
    },
  })
);
```

## Configuration Options

```typescript
interface CreateCDNPluginOptions {
  // Modules to replace with CDN links
  modules?: string[];
  
  // CDN base URL (default: 'https://unpkg.com')
  prodUrl?: string;
  
  // Enable CDN replacement in development mode (default: false)
  enableInDevMode?: boolean;
  
  // Custom script tag generator
  generateScriptTag?: (module: ModuleConfig) => string;
  
  // Custom CSS link tag generator
  generateCssLinkTag?: (module: ModuleConfig, css: string) => string;
}
```

## Supported Libraries

The plugin includes built-in configurations for popular libraries:

### JavaScript Libraries
- **Vue**: `vue` (with CSS support)
- **React**: `react`, `react-dom` (with aliases)
- **Lodash**: `lodash`
- **Axios**: `axios`
- **Day.js**: `dayjs`
- **Moment.js**: `moment`

### UI Libraries
- **Ant Design**: `antd` (with CSS)
- **Element Plus**: `element-plus` (with CSS)

## CDN Providers

### Supported Providers

1. **unpkg** (default): `https://unpkg.com`
2. **jsDelivr**: `https://cdn.jsdelivr.net`
3. **cdnjs**: `https://cdnjs.cloudflare.com`
4. **Custom**: Any custom CDN URL

### Provider Detection

The plugin automatically detects the CDN provider based on the `prodUrl`:

```typescript
createCDNPlugin({
  prodUrl: 'https://cdn.jsdelivr.net', // Detected as jsDelivr
  modules: ['vue', 'react'],
});
```

## Advanced Usage

### Custom Script Tags

```typescript
createCDNPlugin({
  modules: ['vue', 'react'],
  generateScriptTag: (module) => {
    return `<script src="${module.path}" crossorigin="anonymous" integrity="..."></script>`;
  },
});
```

### Custom CSS Links

```typescript
createCDNPlugin({
  modules: ['antd', 'element-plus'],
  generateCssLinkTag: (module, css) => {
    return `<link rel="stylesheet" href="${css}" crossorigin="anonymous">`;
  },
});
```

### Development Mode

```typescript
createCDNPlugin({
  modules: ['vue', 'react'],
  enableInDevMode: true, // Use CDN in development too
});
```

### Private CDN

```typescript
createCDNPlugin({
  modules: ['vue', 'react'],
  prodUrl: 'https://internal-cdn.company.com', // Private CDN
});
```

## How It Works

1. **Development**: Imports work normally, no CDN replacement
2. **Build Process**:
   - Configures Rollup externals for specified modules
   - Maps module names to global variables
   - Generates CDN URLs based on provider
   - Injects script and CSS tags into HTML
   - Creates CDN manifest for debugging

### Generated Output

During build, the plugin:

1. **Externalizes modules**: Prevents bundling of CDN modules
2. **Injects HTML tags**: Adds `<script>` and `<link>` tags to HTML
3. **Creates manifest**: Generates `cdn-manifest.json` with CDN information

### Example Build Output

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/antd@5/dist/reset.css">
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
</head>
<body>
  <!-- Your app content -->
</body>
</html>
```

## Comparison with vite-plugin-cdn-import

| Feature | @vite-enhance/plugin-cdn | vite-plugin-cdn-import |
|---------|-------------------------|------------------------|
| Basic CDN replacement | ✅ | ✅ |
| CSS file support | ✅ | ❌ |
| Development mode | ✅ | ❌ |
| Module aliases | ✅ | ❌ |
| Multiple CDN providers | ✅ | ✅ |
| Custom tag generation | ✅ | ❌ |
| TypeScript support | ✅ | ✅ |
| Performance caching | ✅ | ❌ |
| CDN manifest | ✅ | ❌ |

## Troubleshooting

### Module Not Found

If you see warnings about unknown modules:

```typescript
// Add custom module mapping
createCDNPlugin({
  modules: ['my-custom-lib'],
  // The plugin will warn about unknown modules
});
```

### CSS Not Loading

Ensure the library has CSS configuration in the built-in mappings, or use a custom CSS link generator.

### Development vs Production

Remember that CDN replacement only happens during build by default. Use `enableInDevMode: true` to test CDN behavior in development.

## License

MIT
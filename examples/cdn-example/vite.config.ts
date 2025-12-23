import { defineConfig } from 'vite';
import { defineEnhanceConfig } from '../../packages/config/src/index.js';

export default defineConfig(
  defineEnhanceConfig({
    enhance: {
      preset: 'app',
      
      // Enhanced CDN configuration
      cdn: {
        // Modules to replace with CDN links
        modules: ['vue', 'react', 'react-dom', 'lodash', 'axios', 'antd'],
        
        // CDN provider URL
        prodUrl: 'https://unpkg.com',
        
        // Enable CDN replacement in development mode (optional)
        enableInDevMode: false,
        
        // Custom script tag generator (optional)
        generateScriptTag: (module) => {
          return `<script src="${module.path}" crossorigin="anonymous"></script>`;
        },
        
        // Custom CSS link tag generator (optional)
        generateCssLinkTag: (module, css) => {
          return `<link rel="stylesheet" href="${css}" crossorigin="anonymous">`;
        },
      },
      
      // 框架配置
      vue: true, // 自动检测
      react: true, // 自动检测
      
      // 其他功能
      cache: true,
      pwa: false,
    },
    
    vite: {
      build: {
        // Additional Vite build options
        minify: 'terser',
        sourcemap: true,
      },
    },
  })
);
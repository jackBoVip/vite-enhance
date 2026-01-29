import { defineEnhanceConfig } from 'vite-enhance'

// PWA 功能示例 - 测试渐进式 Web 应用配置
export default defineEnhanceConfig({
  enhance: {
    // PWA 配置
    pwa: {
      // 更新策略
      registerType: 'autoUpdate', // 'prompt' | 'autoUpdate'
      
      // Workbox 配置
      workbox: {
        // 预缓存的文件模式
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        
        // 运行时缓存策略
        runtimeCaching: [
          {
            // 缓存 Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
            },
          },
          {
            // 缓存 API 请求
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
        
        // Service Worker 行为
        skipWaiting: true,
        clientsClaim: true,
      },
      
      // Web App Manifest
      manifest: {
        name: 'PWA Demo - vite-enhance',
        short_name: 'PWA Demo',
        description: 'Testing PWA features with vite-enhance',
        theme_color: '#4DBA87',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      
      // 开发选项
      devOptions: {
        enabled: true, // 开发模式下启用 PWA
        type: 'module',
      },
    },
  },
})

import { defineEnhanceConfig } from 'vite-enhance'

// 压缩功能示例 - 测试构建产物打包
export default defineEnhanceConfig({
  enhance: {
    // 库模式
    preset: 'lib',
    
    // 压缩配置
    compress: {
      // 是否启用
      enabled: true,
      
      // 压缩格式
      // 'tar' - Unix tar 格式（默认）
      // 'tar.gz' - gzip 压缩的 tar
      // 'zip' - Windows 友好的 zip 格式
      format: 'tar.gz',
      
      // 输出目录
      outputDir: 'dist',
      
      // 自定义文件名（不含扩展名）
      // 默认使用 package.json 中的 name
      fileName: 'compress-demo-lib-ss',
    },
  },
  
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'CompressDemo',
        formats: ['es', 'cjs'],
      },
    },
  },
})

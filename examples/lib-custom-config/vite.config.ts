import { defineConfig } from 'vite'
import { defineEnhanceConfig } from 'vite-enhance'

export default defineConfig(
  defineEnhanceConfig({
    enhance: {
      preset: 'lib'
    },
    vite: {
      build: {
        lib: {
          // 用户自定义配置，应该优先使用
          entry: 'src/main.ts',  // 自定义入口
          name: 'MyCustomLib',   // 自定义名称
          formats: ['es', 'umd'], // 自定义格式
          fileName: 'custom'      // 自定义文件名
        }
      }
    }
  })
)
import { defineConfig } from 'vite'
import { defineEnhanceConfig } from 'vite-enhance'

export default defineConfig(
  defineEnhanceConfig({
    enhance: {
      preset: 'app'
    }
  })
)
import { defineEnhanceConfig } from '@vite-enhance/config';

export default defineEnhanceConfig({
  preset: 'lib',
  
  vite: {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'Shared',
        fileName: 'index'
      }
    }
  }
});
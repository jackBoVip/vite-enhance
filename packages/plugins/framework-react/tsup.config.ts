import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    compilerOptions: {
      incremental: false,
      composite: false,
    },
  },
  clean: true,
  external: ['react', 'react-dom', '@vitejs/plugin-react'],
});
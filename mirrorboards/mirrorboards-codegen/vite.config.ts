import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: '@mirrorboards/codegen-tools',
      fileName: 'index',
      entry: './src',
      formats: ['es', 'cjs'],
    },
  },
  plugins: [dts()],
});

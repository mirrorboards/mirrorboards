import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      name: '@mirrorboards/namespace',
      fileName: 'index',
      entry: './src',
      formats: ['es', 'cjs'],
    },
  },
  plugins: [dts()],
});

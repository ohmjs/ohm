import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/index.vite.js',
      output: {
        entryFileNames: 'main-vite.js',
        format: 'iife',
      },
    },
    outDir: 'dist',
  },
});

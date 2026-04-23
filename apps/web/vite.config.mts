/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@org/api-client': resolve(import.meta.dirname, '../../shared/api-client/src/index.ts'),
      '@org/data': resolve(import.meta.dirname, '../../shared/data/src/index.ts'),
      '@org/types': resolve(import.meta.dirname, '../../shared/types/src/index.ts'),
      '@org/utils': resolve(import.meta.dirname, '../../shared/utils/src/index.ts'),
      '@org/ui-media-upload': resolve(import.meta.dirname, '../../ui/media-upload/src/index.ts'),
      '@org/ui-primitives': resolve(import.meta.dirname, '../../ui/primitives/src/index.ts'),
      '@org/ui-web': resolve(import.meta.dirname, '../../ui/web/src/index.ts'),
      react: resolve(import.meta.dirname, '../../node_modules/react'),
      'react-dom': resolve(import.meta.dirname, '../../node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'web',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['text', 'lcov', 'html'],
    },
  },
}));

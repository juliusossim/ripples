import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/ui/web',
  plugins: [react()],
  resolve: {
    alias: {
      '@org/api-client': resolve(__dirname, '../../shared/api-client/src/index.ts'),
      '@org/data': resolve(__dirname, '../../shared/data/src/index.ts'),
      '@org/types': resolve(__dirname, '../../shared/types/src/index.ts'),
      '@org/ui-primitives': resolve(__dirname, '../primitives/src/index.ts'),
      react: resolve(__dirname, '../../node_modules/react'),
      'react-dom': resolve(__dirname, '../../node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  test: {
    name: '@org/ui-web',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['text', 'lcov', 'html'],
    },
  },
}));

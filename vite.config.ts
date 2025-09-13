import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type Plugin } from 'vite';

export default defineConfig(() => {
  const plugins = [react()];

  if (process.env.ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
        open: false,
      }) as Plugin,
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': '/src',
        '@lib': '/src/lib',
        '@hooks': '/src/hooks',
        '@ui': '/src/ui',
        '@components': '/src/components',
        '@types': '/src/types',
      },
    },
    base: process.env.BASE_URL || '/',
    test: {
      environment: 'jsdom',
      setupFiles: ['src/setupTests.ts'],
      globals: true,
      pool: 'forks',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: 'coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/__tests__/**', 'src/main.tsx', 'src/lib/clients.ts'],
        thresholds: {
          lines: 75,
          functions: 75,
          statements: 75,
          branches: 65,
        },
      },
    },
  };
});

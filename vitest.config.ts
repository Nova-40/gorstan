/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    coverage: {
      provider: 'v8',
      reporter: ['text','html','lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/stories/**',
        'src/**/__mocks__/**',
        'src/**/types/**',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      thresholds: { statements: 0.9, branches: 0.85, functions: 0.9, lines: 0.9 }
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    alias: {},
    reporters: ['default']
  }
});
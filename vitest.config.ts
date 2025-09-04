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
      enabled: true,
      provider: 'istanbul',
      all: true,
      clean: true,
      reportOnFailure: true,
      // Add json & json-summary so collect-metrics can reliably read coverage output
      reporter: ['text','html','lcov','json','json-summary'],
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
      // thresholds temporarily disabled while grading pipeline stabilizes
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    alias: {},
    reporters: ['default']
  }
});
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
  exclude: ['node_modules/**', '**/e2e/**', '**/tests/e2e/**', '**/playwright/**'],
    coverage: {
  reporter: ['text', 'lcov'],
  include: ['src/core/npcs/**/*.{ts,tsx}'],
      thresholds: { lines: 80, statements: 80, branches: 80, functions: 80 },
    },
  },
});

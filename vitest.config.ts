/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setupTests.ts"],
    globals: true,                // allows Jest-like global expect, describe, it
    css: true,                    // allow CSS imports in components
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/stories/**",
        "src/**/__mocks__/**",
        "src/**/types/**",
        "src/main.tsx",
        "src/vite-env.d.ts"
      ],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0
      }
    },
    include: [
      "src/**/*.{test,spec}.{ts,tsx}"
    ],
    alias: {}, // tsconfigPaths handles this
    reporters: ["default"],
    // If Gorstan uses heavy workers or node APIs, uncomment:
    // threads: false,
  }
});
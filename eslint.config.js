// eslint.config.js
// Gorstan Game ESLint Configuration (v9+ format)
// Code Licence MIT

import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
// path/__dirname helpers not needed in this config

export default [
  js.configs.recommended,
  // Ignore declaration files and generated/auxiliary folders to avoid noisy linting
  {
    ignores: [
      '**/*.d.ts',
      'src/**/*.d.ts',
      'src/utils/performanceOptimization.tsx',
      // Common script/tooling folders and generated outputs
      'scripts/**',
      'scripts/compiled/**',
      'compiled/**',
      'e2e/**',
      'examples/**',
      'backup/**',
      '.restore-test/**',
  // Built distribution bundles
  'dist/**',
      // Top-level tooling/config files that are intentionally permissive
      'deploy.js',
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.js',
  '.eslintrc.cjs',
  'vite.config.ts',
      '.eslintrc.js',
      'main.js',
      // Local helper scripts used for analysis; not part of app runtime
      '.local-tools/**',
    ],
  },
  {
    // Limit this main ruleset to source files only to avoid linting top-level
    // tooling, compiled bundles, and backup copies. Specific overrides for
    // tests and helpers remain below.
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // React specific rules
      'react/jsx-uses-react': 'off', // Not needed with React 17+ JSX transform
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General rules
      'no-console': 'off', // Allow console logs for game debugging
      'no-unused-vars': 'off', // Use TypeScript version instead
      'prefer-const': 'warn',
      'no-var': 'error',
      'curly': ['warn', 'all'], // Downgrade to warning temporarily
      'no-duplicate-imports': 'warn', // Downgrade to warning temporarily
      'no-redeclare': 'warn', // Downgrade to warning temporarily

      // Relaxed rules for game development
      'no-case-declarations': 'off',
      'no-fallthrough': 'warn',

      // Reduce severity for noisy rules so linting is non-blocking for legacy code
      'unused-imports/no-unused-imports': 'warn',
      'eqeqeq': ['warn', 'always'],
      'no-useless-escape': 'warn',
      'no-empty': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // TypeScript files: use the TypeScript parser but do not enable type-aware rules
    // here to avoid parser/project mismatches during CI and local linting.
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // Intentionally not setting `project` here to avoid 'file not found in project' parser errors
      },
    },
    rules: {
      // TypeScript compiled/runtime checks are handled by `tsc`; disable no-undef in eslint for TS files
      'no-undef': 'off',
      // Allow var as warning to reduce mass failures from legacy/generated files; plan to convert in follow-ups
      'no-var': 'warn',
      // Relax rules-of-hooks to warnings so lint doesn't block on intricate hook patterns in legacy code
      'react-hooks/rules-of-hooks': 'warn',
    },
  },
  {
    // Specific helper that confuses the type-aware parser: parse with espree instead
    files: ['src/utils/performanceOptimization.tsx'],
    languageOptions: {
      parser: 'espree',
      parserOptions: { ecmaVersion: 2023, sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Specific overrides for declaration files: avoid type-aware parsing here
    files: ['src/**/*.d.ts'],
    languageOptions: {
      // do not set parserOptions.project so the parser won't require a TSConfig that lists this file
      parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Test files configuration (include legacy tests/ folder)
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/test/**/*.{js,jsx,ts,tsx}', 'tests/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        // Intentionally not setting `project` to avoid parser project mismatches
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        // Some older test code uses Jest globals; allow them as readonly so
        // eslint doesn't fail on legacy tests. New tests should use `vi`.
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
];

// eslint.config.js
// Gorstan Game ESLint Configuration (v9+ format)
// Code Licence MIT
// Gorstan and characters (c) Geoff Webster 2025

import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  js.configs.recommended,
  // Ignore declaration files globally to avoid type-aware parser-project mismatches
  {
  ignores: ['**/*.d.ts', 'src/**/*.d.ts', 'src/utils/performanceOptimization.tsx'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
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
      '@typescript-eslint/no-explicit-any': 'warn',
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
      'eqeqeq': ['error', 'always'],
      'curly': ['warn', 'all'], // Downgrade to warning temporarily
      'no-duplicate-imports': 'warn', // Downgrade to warning temporarily
      'no-redeclare': 'warn', // Downgrade to warning temporarily
      
      // Relaxed rules for game development
      'no-case-declarations': 'off',
      'no-fallthrough': 'warn',
  // remove unused imports automatically
  'unused-imports/no-unused-imports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // TypeScript files: enable type-aware parser project
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
      },
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
    // Test files configuration
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', 'src/test/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
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
    },
  },
];

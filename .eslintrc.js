/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  root: true,
  ignorePatterns: ['.restore-test/**', 'backup/**', 'node_modules/**'],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: { react: { version: 'detect' } },
  overrides: [
    // Some helper utilities use patterns that confuse the type-aware parser; lint them without `project`.
    {
      files: ['src/utils/performanceOptimization.tsx'],
      // Parse as plain JS/JSX for this helper to avoid project-based parsing issues
      parser: 'espree',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    // JS config files and scripts shouldn't use the TS parser/project
    {
      files: ['*.js', '*.cjs', '*.mjs', 'scripts/**', 'scripts/**/*', 'scripts/*'],
      parser: 'espree',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    // TypeScript files: enable type-aware parser project via override
    {
      files: ['**/*.{ts,tsx}'],
      excludedFiles: ['src/utils/performanceOptimization.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: [path.resolve(__dirname, './tsconfig.eslint.json'), path.resolve(__dirname, './tsconfig.json')],
        tsconfigRootDir: __dirname,
      },
    },
    // Declaration files: avoid requiring the TSConfig to include them
    {
      files: ['src/**/*.d.ts', '**/*.d.ts'],
      parser: 'espree',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },
  ],
  rules: {
    // equality + braces:
    eqeqeq: ['error', 'always'],
    curly: ['warn', 'all'],

    // React 17+:
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    // kill unused imports automatically:
    'unused-imports/no-unused-imports': 'error',
    // keep eslint’s unused-vars for params/locals:
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // tame these for now (we’ll type them incrementally):
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
};

module.exports = {
  root: true,
  ignorePatterns: ['.restore-test/**', 'backup/**', 'node_modules/**'],
  // For a few helper files we'll parse without the type-aware project; for TypeScript files
  // enable the type-aware parser via an override so we can exclude specific files.
  overrides: [
    {
      files: ['src/utils/performanceOptimization.tsx'],
      // parse this helper as plain JS/JSX to avoid project-based parsing
      parser: 'espree',
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
    },
    {
      // TypeScript files: enable type-aware parser project via override and exclude helper
      files: ['**/*.{ts,tsx}'],
      excludedFiles: ['src/utils/performanceOptimization.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.eslint.json', './tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
  'unused-imports/no-unused-imports': 'warn',
  '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
  '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  '@typescript-eslint/no-non-null-assertion': 'warn',
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'eqeqeq': ['error', 'smart'],
  },
  settings: { react: { version: 'detect' } },
};

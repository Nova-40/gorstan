// MIT License © 2025 Geoff Webster
// Gorstan v2.5
process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild-wasm/bin/esbuild.wasm');

import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

import react from '@vitejs/plugin-react';

export default defineConfig({
plugins: [react(), wasm(), topLevelAwait()]
});
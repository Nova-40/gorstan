/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
  
  You may play Gorstan for free for personal entertainment only.
  You may NOT copy, redistribute, modify, or sell the game, its code, 
  artwork, storyline, or any other part without written permission.
  
  Gorstan includes third-party libraries and assets:
    - React © Meta Platforms, Inc. – MIT Licence
    - Lucide Icons © Lucide Contributors – ISC Licence
    - Flaticon icons © Flaticon.com – Free Licence with attribution
    - Other packages under their respective licences (see package.json)

  Full licence terms: see EULA.md in the project root.
*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ ensures @ maps to /src
    },
  },
  build: {
    // Increase chunk size warning limit for Vercel
    chunkSizeWarningLimit: 1000,
    // Build tuning for smaller vendor and better tree-shaking
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      // Conditionally attach analysis plugins when running `npm run analyze`.
      // npm sets `npm_lifecycle_event` to the script name; pnpm also forwards this env var.
      plugins: (process.env.npm_lifecycle_event === 'analyze')
        ? [
            visualizer({
              filename: 'dist/bundle-stats.html',
              title: 'Gorstan bundle analysis',
              open: false,
              gzipSize: true,
            }),
          ]
        : [],
      output: {
        // Optimize chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Map heavy vendor packages into dedicated chunks to keep vendor lean
        manualChunks: (id) => {
          if (!id) return null;
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
          // Create per-zone chunks for room modules (src/rooms/zoneName_*)
          if (id.includes('/src/rooms/') || id.includes('src\\rooms\\')) {
            const m = id.match(/rooms[\\\/]([a-zA-Z0-9_-]+)_/);
            if (m && m[1]) return `zone-${m[1]}`;
            return 'rooms';
          }
          return null;
        },
      },
      // Aggressive treeshake hints to reduce accidental bloat
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  }
});


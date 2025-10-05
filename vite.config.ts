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
    // Enable sourcemaps for production debugging
    sourcemap: false,
    // Minimize output
    minify: 'terser',
    // Target modern browsers for better optimization
    target: 'esnext',
    rollupOptions: {
      output: {
        // Optimize chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Use a function to create deterministic chunks for major folders and heavy deps.
        // This reduces churn when modules are both statically and dynamically imported.
        manualChunks(id) {
          if (!id) return null;
          // node_modules go into vendor chunks by package name
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('lucide-react')) return 'lucide-react';
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('groq-sdk') || id.includes('groq')) return 'ai-services';
            if (id.includes('valtio') || id.includes('zustand') || id.includes('@tanstack')) return 'state-management';
            return 'vendor';
          }

          // Group internal source folders into stable chunks
          if (id.includes('/src/minigames/') || id.includes('\\src\\minigames\\')) return 'minigames';
          if (id.includes('/src/ai/') || id.includes('\\src\\ai\\')) return 'ai-services';
          if (id.includes('/src/npc/') || id.includes('\\src\\npc\\')) return 'npc';
          if (id.includes('/src/components/') || id.includes('\\src\\components\\')) return 'components';
          if (id.includes('/src/logic/') || id.includes('\\src\\logic\\')) return 'game-logic';
          if (id.includes('/src/engine/') || id.includes('\\src\\engine\\')) return 'game-engine';

          return null; // let Rollup decide
        }
      }
    }
  }
});


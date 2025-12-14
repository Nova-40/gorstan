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
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

export default defineConfig({
    plugins: [
        react(),
        // Bundle analyzer for development
        visualizer({
            filename: 'dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
        // Gzip compression
        compression({
            algorithm: 'gzip',
            ext: '.gz',
        }),
        // Brotli compression
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        target: 'es2020',
        sourcemap: false,
        minify: 'esbuild',
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                // Use a manualChunks function for deterministic grouping of vendor and src folders
                manualChunks(id) {
                    if (!id) return null;
                    if (id.includes('node_modules')) {
                        if (id.includes('framer-motion')) return 'framer-motion';
                        if (id.includes('lucide-react')) return 'lucide-react';
                        if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
                        if (id.includes('groq-sdk') || id.includes('groq')) return 'ai-services';
                        if (id.includes('valtio') || id.includes('zustand') || id.includes('@tanstack')) return 'state-management';
                        return 'vendor';
                    }

                    if (id.includes('/src/minigames/') || id.includes('\\src\\minigames\\')) return 'minigames';
                    if (id.includes('/src/ai/') || id.includes('\\src\\ai\\')) return 'ai-services';
                    if (id.includes('/src/npc/') || id.includes('\\src\\npc\\')) return 'npc';
                    if (id.includes('/src/components/') || id.includes('\\src\\components\\')) return 'components';
                    if (id.includes('/src/logic/') || id.includes('\\src\\logic\\')) return 'game-logic';
                    if (id.includes('/src/engine/') || id.includes('\\src\\engine\\')) return 'game-engine';

                    return null;
                }
            }
        }
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'framer-motion',
            'lucide-react'
        ]
    }
});

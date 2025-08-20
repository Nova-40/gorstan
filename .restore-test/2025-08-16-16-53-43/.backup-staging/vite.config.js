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
                manualChunks: {
                    // Core React chunk
                    'react-vendor': ['react', 'react-dom'],
                    // Heavy UI libraries
                    'framer-motion': ['framer-motion'],
                    'lucide-react': ['lucide-react'],
                    // Analytics/monitoring (non-critical)
                    'analytics': ['@vercel/analytics', '@vercel/speed-insights'],
                    // Game state management
                    'state-management': ['valtio', 'zustand', '@tanstack/react-query'],
                    // AI services (can be lazy loaded)
                    'ai-services': ['groq-sdk'],
                }
            }
        }
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'framer-motion',
            'lucide-react',
            '@vercel/analytics',
            '@vercel/speed-insights'
        ]
    }
});

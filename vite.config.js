/*
  Gorstan – Copyright © 2025 Geoff Webster. All Rights Reserved.
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
                // consistent filenames
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
                manualChunks(id) {
                    if (id && id.includes('node_modules')) {
                        if (id.includes('react')) return 'vendor-react';
                        if (id.includes('framer-motion')) return 'vendor-motion';
                        if (id.includes('lucide-react')) return 'vendor-icons';
                        if (id.includes('groq-sdk')) return 'vendor-ai';
                        if (id.includes('valtio') || id.includes('zustand') || id.includes('@tanstack/react-query')) return 'vendor-state';
                        return 'vendor';
                    }
                }
            },
            treeshake: {
                moduleSideEffects: 'no-external',
                propertyReadSideEffects: false,
                tryCatchDeoptimization: false
            },
            plugins: [
                {
                    name: 'fail-on-empty-chunk',
                    generateBundle(_, bundle) {
                        for (const [fileName, chunk] of Object.entries(bundle)) {
                            if (chunk && chunk.type === 'chunk') {
                                const code = chunk.code || '';
                                if (code.trim().length === 0) {
                                    this.error(`Empty chunk generated: ${fileName}`);
                                }
                            }
                        }
                    }
                }
            ]
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

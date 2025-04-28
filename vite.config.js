import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Specify the development server port
    open: true, // Automatically open the app in the browser
  },
  build: {
    outDir: 'dist', // Specify the output directory for the build
    sourcemap: true, // Generate source maps for easier debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Separate vendor code into its own chunk
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Create an alias for the src directory
    },
  },
});

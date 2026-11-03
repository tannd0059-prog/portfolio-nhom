import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 4500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Tách riêng 3D Three.js Engine
          if (id.includes('three')) {
            return 'three-vendor';
          }
          // Tách riêng 3D Spline Runtime nếu dùng
          if (id.includes('@splinetool')) {
            return 'spline-runtime';
          }
          // Tách riêng thư viện chuyển động GSAP
          if (id.includes('gsap')) {
            return 'gsap-motion';
          }
          // Tách riêng core React & Zustand
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/zustand/') ||
            id.includes('node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          // Tách riêng icons
          if (id.includes('lucide-react')) {
            return 'icons';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

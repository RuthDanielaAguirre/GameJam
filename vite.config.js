import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Three.js y MindAR vienen del CDN (importmap en index.html)
  // Vite no los bundlea, los deja como imports externos
  optimizeDeps: {
    exclude: ['three', 'mindar-image-three'],
  },
  build: {
    rollupOptions: {
      external: ['three', 'mindar-image-three'],
    },
  },
})
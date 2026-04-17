import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Ensure three.js and react-globe.gl resolve correctly
  optimizeDeps: {
    include: ['three', 'react-globe.gl'],
    // Exclude large three.js examples that aren't needed
    exclude: ['three/examples/jsm/controls/OrbitControls'],
  },

  // Required for Clerk's JWT verification headers in dev
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },

  build: {
    // Increase chunk size warning limit for three.js
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split three.js into its own chunk for better caching
          three: ['three'],
          globe: ['react-globe.gl'],
          clerk: ['@clerk/clerk-react'],
          groq: ['groq-sdk'],
        },
      },
    },
  },
})

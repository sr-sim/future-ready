import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // Document QA API endpoints
      '/api/chat-history': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false
      },
      '/api/chat-with-documents': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false
      },
      '/api/documents': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false
      },
      '/api/analyze-document': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false
      },
      '/api/re-analyze-document': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false
      },
      // Job Matching API endpoints
      '/api/job-matching': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      },
      '/api/job-matches': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      },
      // Embedding API endpoints
      '/api/generate-embedding': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false
      },
      // Health check endpoints
      '/health': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

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
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      },
      '/api/chat-with-documents': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      },
      '/api/company-documents': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      },
      // legacy routes below can remain pointed to old services if still used
      // New: DOCX preview and re-analyze endpoints served by document-qa-api.js (port 3010)
      '/api/preview-docx': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      },
      '/api/reanalyze-company': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false
      },
      '/api/reanalyze-document': {
        target: 'http://localhost:3010',
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
      // Enhanced Document QA API endpoints
      '/api/enhanced-chat': {
        target: 'http://localhost:3008',
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

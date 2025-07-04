import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from'@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/accounts': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Origin', 'http://localhost:8000');
          });
        }
      },
      '/signup': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/transactions': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/categories': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

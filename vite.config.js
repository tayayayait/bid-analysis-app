import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    allowedHosts: ['end-richardson-compact-safely.trycloudflare.com'],
    proxy: {
      '/api': {
        target: 'https://apis.data.go.kr/1230000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },
})

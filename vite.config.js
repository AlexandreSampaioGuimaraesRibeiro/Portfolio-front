import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // mantenha os seus plugins como estão
  server: {
    proxy: {
      '/wakatime-api': {
        target: 'https://wakatime.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wakatime-api/, '/api/v1'),
      },
    },
  },
})

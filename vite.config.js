import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // vite.config.js
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})

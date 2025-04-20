import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'  // Asegúrate de importar path

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Aquí se define el alias
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})

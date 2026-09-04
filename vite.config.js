import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: false, // سيتنقل للبورت 5174 تلقائياً إذا كان 5173 مشغولاً
    watch: {
      usePolling: true,
    },
  },
})
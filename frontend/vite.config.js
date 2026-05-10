import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
      host: true,  // exposes the dev server on your network
      port: 5173,
    },
  define: {
    global: 'globalThis',
  },
})
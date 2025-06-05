import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      proxy: {
        "/service": {
          target: "http://localhost:5000",
        },
      },
    },
    build: {
      outDir: "dist",
    },
    plugins: [react(), tailwindcss()],
  }
})

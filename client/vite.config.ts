import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Add this server configuration block
    proxy: {
      // Proxy requests starting with /api to your backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true, // Recommended, especially for CORS
        secure: false,      // Set to false if backend uses http (common for localhost)
        // Optional: If your backend routes *don't* include /api, uncomment the rewrite
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
    // You can optionally specify the frontend dev server port if needed
    // port: 5173,
  }
})

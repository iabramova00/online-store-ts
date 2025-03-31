import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // 👈 nothing more needed; Tailwind runs through PostCSS
})

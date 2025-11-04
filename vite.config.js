import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base URL para GitHub Pages ou servidor com subpasta
  base: '/orcamentix/',
})

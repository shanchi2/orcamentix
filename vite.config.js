import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/orcamentix/',       // <- importante para GitHub Pages
  plugins: [react()],
})

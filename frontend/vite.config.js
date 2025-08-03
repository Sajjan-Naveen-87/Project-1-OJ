import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This is the directory where the build output will be placed.
    outDir: 'dist',
  },
  // This is the crucial part. It tells Vite to prepend `/static/` to all asset paths.
  // This ensures that the paths in the generated index.html match Django's STATIC_URL.
  base: '/static/',
})
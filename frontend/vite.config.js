import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This is the directory where the build output will be placed.
    outDir: 'build', // Changed to 'build' to be more explicit
    // Generate a manifest file for Django to read.
    manifest: true,
  },
  // This is the crucial part. It tells Vite to prepend `/static/` to all asset paths.
  // This ensures that the paths in the generated index.html match Django's STATIC_URL.
  base: '/static/',
})
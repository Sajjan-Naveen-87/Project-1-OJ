import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This must match the directory used in the Dockerfile COPY commands.
    outDir: 'build',
    // This is crucial for Django integration. It creates the manifest.json file.
    manifest: true,
  },
  // This ensures asset paths in index.html are correct for Django's static file handling.
  base: '/static/',
})

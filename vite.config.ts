// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });

// import {defineConfig} from 'vite'
// import react from '@vitejs/plugin-react'
//
//
// export default defineConfig({
//   plugins: [react()],
//   base: './', // For GitHub Pages
//   build: {
//     outDir: 'dist', // Frontend builds here
//     emptyOutDir: true,
//   },
//   publicDir: 'public' // Static assets
// })

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Critical for GitHub Pages
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  }
})
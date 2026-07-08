import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// The site builds the library straight from source, so `pnpm dev` needs no
// prior lib build and the demo always tracks the working tree. Order matters:
// the `styles.css` subpath must resolve before the bare package name.
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: '@ldlework/feedback/styles.css',
        replacement: fileURLToPath(new URL('../styles.css', import.meta.url)),
      },
      {
        find: '@ldlework/feedback',
        replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      },
    ],
  },
})

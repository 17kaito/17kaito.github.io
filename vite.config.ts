import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/17kaito.github.io/',
  build: {
    outDir: 'dist'
  }
})



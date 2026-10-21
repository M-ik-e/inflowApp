import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      // Any request starting with /api will be sent to inflowmetrics.site instead
      '/api': {
        target: 'https://inflowmetrics.site',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

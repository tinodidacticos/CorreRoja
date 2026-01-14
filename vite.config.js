import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'assets/*.jpg'],
      manifest: {
        name: 'Corre Roja - Desafíos',
        short_name: 'Corre Roja',
        description: 'Desafíos visuales y acertijos',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo-corre-roja.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-corre-roja.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})

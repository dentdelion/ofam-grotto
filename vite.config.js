import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Precache everything, including all gallery photos, so the kiosk
        // keeps working fully if the internet connection drops.
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
      },
      manifest: {
        name: 'Museum Kiosk',
        short_name: 'Museum',
        display: 'fullscreen',
        background_color: '#1c1a17',
        theme_color: '#1c1a17',
      },
    }),
  ],
})

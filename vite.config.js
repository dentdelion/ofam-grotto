import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // Gallery photos are raw multi-megapixel scans (7-14 MB each). We never
    // display more than ~2000px on this 1080-wide kiosk, so content.js imports
    // every photo through imagetools with ?thumb / ?display directives and the
    // originals never reach the bundle. See src/lib/content.js.
    imagetools({
      // Only the raw gallery scans go through the resize pipeline. The small
      // hand-tuned images (language-bg, exhibition-chapters) keep Vite's plain
      // ?url handling.
      include: /[\\/]content[\\/]photos[\\/].*\.(jpe?g|png|webp)(\?.*)?$/i,
      defaultDirectives: (url) => {
        // The kiosk panel is a fixed 1080x1920 at DPR 1. 600px covers the
        // 440px grid card / filmstrip; 1600px covers the full-screen viewer
        // plus a bit of PhotoSwipe pinch-zoom headroom.
        if (url.searchParams.has('thumb')) {
          return new URLSearchParams('w=600&format=webp&quality=70')
        }
        if (url.searchParams.has('display')) {
          return new URLSearchParams('w=1600&format=webp&quality=76')
        }
        return new URLSearchParams()
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // The optimised webp derivatives are small enough (~25 MB total) to
        // precache in full, so the kiosk still works offline from a cold start.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Belt-and-suspenders: anything not precached (a stray large file, a
        // future format) is still cached on first view and kept for offline.
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'kiosk-images',
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
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

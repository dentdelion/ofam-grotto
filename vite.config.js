import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import { VitePWA } from 'vite-plugin-pwa'

// Galleries whose scans are documents to be read rather than photos to be
// looked at, so they get the high-resolution viewer derivative (see below).
// gallery-c is "Maps" in content/galleries.json.
const ZOOMABLE_GALLERY = /[\\/]gallery-c[\\/]/

export default defineConfig({
  plugins: [
    react(),
    // Gallery photos are raw multi-megapixel scans (7-14 MB each). content.js
    // imports every photo through imagetools with ?thumb / ?display directives
    // and the originals never reach the bundle. See src/lib/content.js.
    imagetools({
      // Only the raw gallery scans go through the resize pipeline. The small
      // hand-tuned images (language-bg, exhibition-chapters) keep Vite's plain
      // ?url handling.
      include: /[\\/]content[\\/]photos[\\/].*\.(jpe?g|png|webp)(\?.*)?$/i,
      defaultDirectives: (url) => {
        // The kiosk panel is a fixed 1080x1920 at DPR 1. 600px covers the
        // 440px grid card / filmstrip; the viewer shows the image in an
        // 800x960 box, so 1600px covers "fit" plus a little zoom headroom.
        if (url.searchParams.has('thumb')) {
          return new URLSearchParams('w=600&format=webp&quality=70')
        }
        if (url.searchParams.has('display')) {
          // Maps are engraved city plans visitors pinch-zoom into to read
          // street names, so they need far more pixels than a photograph:
          // at 1600px PhotoSwipe ran out of real detail at 2x the fit zoom
          // and started upscaling. 4000px is PhotoSwipe's own MAX_IMAGE_WIDTH
          // ceiling and lets the viewer reach ~5x fit at native sharpness.
          // It costs 1-3 MB of webp per map, and there are only ten of them.
          return ZOOMABLE_GALLERY.test(url.pathname)
            ? new URLSearchParams('w=4000&format=webp&quality=82')
            : new URLSearchParams('w=1600&format=webp&quality=76')
        }
        return new URLSearchParams()
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // The optimised webp derivatives are small enough to precache in
        // full, so the kiosk still works offline from a cold start. The cap
        // has to clear the largest 4000px map derivative (~3 MB) or that map
        // would silently drop out of the precache and only work online.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
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

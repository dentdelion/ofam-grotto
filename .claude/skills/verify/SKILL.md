---
name: verify
description: Build, launch, and drive the museum kiosk app to verify changes end-to-end.
---

# Verifying the museum kiosk app

Node is managed with nvm and NOT on the default PATH in non-interactive shells:

```bash
export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"
```

## Build + launch

```bash
npm run build                    # production build (includes PWA service worker)
npm run preview -- --port 4173   # serve dist/ (run in background)
```

The service worker only exists in the production build — `npm run dev` cannot
verify offline behavior.

## Drive

`node scripts/verify-drive.mjs` drives the full flow headlessly with Playwright
(installed as a devDependency; browser via `npx playwright install chromium`):
home → gallery A → open lightbox → swipe to next photo → gallery B → info screen,
plus probes: double-tap on a series card, offline reload (service worker), and a
1280×800 window (ScaleShell). Screenshots go to the session scratchpad dir —
edit the `shots` constant at the top. It prints lightbox counter/caption,
service-worker state, and any console errors.

## Gotchas

- PhotoSwipe hides prev/next arrow buttons in touch contexts (`hasTouch: true`) —
  that's correct kiosk behavior; navigate by drag-swipe, not arrow clicks.
- Sample photos are tiny SVGs, so Vite inlines them as data URIs and they don't
  appear as separate files in `dist/assets` — real JPGs will.
- The idle reset (2 min) is impractical to wait out; to verify it, temporarily
  lower `IDLE_RESET_MS` in `src/App.jsx`.

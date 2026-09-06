# Museum Kiosk

Interactive touchscreen website for a museum kiosk: a home screen with 3 buttons,
two photo galleries (grid of series thumbnails → swipeable PhotoSwipe lightbox),
and an info screen.

- **Stack**: Vite + React, PhotoSwipe 5, vite-plugin-pwa (offline cache), plain CSS modules.
- **Content editing**: see [HOW-TO-EDIT-CONTENT.md](HOW-TO-EDIT-CONTENT.md) — staff drop
  photos into `content/photos/` folders and edit one JSON file.
- **Hosting**: Netlify (`netlify.toml` included) — connect the Git repo and it deploys on push.

## Development

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Node is managed with nvm (`nvm use --lts`).

### Gallery media

`content/photos/` (~1 GB of raw scans) is **not** in git — it is a build input,
published as a zip on a GitHub Release and pinned by `content/photos.version`.

- `npm run dev` / `npm run build` run `scripts/media-fetch.mjs` first (`predev` /
  `prebuild`), which downloads and unzips the pinned bundle. It's a no-op once the
  local folder matches the pin, and it's cached between Netlify builds
  (`netlify-plugin-cache` in `netlify.toml`).
- `npm run media:publish [tag]` zips the current `content/photos/`, attaches it to
  a new Release, and rewrites `content/photos.version`. Commit that file to deploy
  the new photos. Needs the `gh` CLI logged in, or `GITHUB_TOKEN` with
  "Contents: write".
- A **private** repo also needs `GITHUB_TOKEN` ("Contents: read") in Netlify's
  environment variables so the build can fetch the bundle.

## Design / pixel-perfect workflow

The UI currently uses a **placeholder design**. To restyle it to match the Figma file:

1. In the **Figma desktop app**, open the design and enable
   *Preferences → Enable Dev Mode MCP Server*.
2. Connect it to Claude Code:

   ```bash
   claude mcp add --transport http figma http://127.0.0.1:3845/mcp
   ```

3. Ask Claude Code to restyle each screen from the selected Figma frame. The places
   built for this:
   - `src/designSize.js` — set to the Figma frame size (currently 1920×1080).
     The whole UI renders at exactly this size and scales to fit the screen
     (`src/components/ScaleShell.jsx`).
   - `src/styles/tokens.css` — colors, fonts, radii, spacing as CSS variables.
   - `src/screens/*.module.css` — per-screen layout.
   - Export each Figma screen as PNG into `design-refs/` and ask Claude Code to
     screenshot the running app at the design resolution and iterate until they match.
4. Fonts: export/download the design's webfonts into `src/fonts/` and `@font-face`
   them in `tokens.css` — the kiosk must not depend on an external font CDN.

## Kiosk behavior

- Fixed design-resolution canvas scaled to the screen (no responsive layout drift).
- Idle reset: after 2 minutes without touches the app closes any open photo viewer
  and returns home (`IDLE_RESET_MS` in `src/App.jsx`).
- Text selection, context menu, page pinch-zoom, and tap highlights are disabled;
  PhotoSwipe keeps pinch-zoom and swipe inside the photo viewer.
- A service worker precaches the whole site including photos, so the kiosk keeps
  working through internet outages (after the first successful load).
- On the kiosk machine run Chrome with `--kiosk <site-url>`.

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: *Add new site → Import an existing project* → pick the repo.
   Build settings are read from `netlify.toml` automatically.
3. **Publish the media bundle once** before the first deploy: `npm run
   media:publish` (creates the Release named in `content/photos.version`), then
   commit and push `content/photos.version`.
4. **Private repo only:** add `GITHUB_TOKEN` (fine-grained token, "Contents:
   read") under *Site settings → Environment variables* so the build can download
   `content/photos/`.
5. Every `git push` republishes the site. The photo bundle is only re-downloaded
   when `content/photos.version` changes; otherwise it's served from the build
   cache.

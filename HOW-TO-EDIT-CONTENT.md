# How to add or remove photos (for museum staff)

All photos live in the `content/photos/` folder. No coding needed.

## The folder layout

```
content/
  photos/
    gallery-a/              ← first gallery
      stone-carvings/       ← one folder = one photo series
        01.jpg
        02.jpg
        03.jpg
      ancient-pottery/
        ...
    gallery-b/              ← second gallery
      ...
  galleries.json            ← titles and order of the series
```

Rules:

- **One folder = one photo series.** The folder name is used internally — use lowercase
  letters and dashes, no spaces (e.g. `winter-exhibition`).
- **Photos show in alphabetical order.** Name them `01.jpg`, `02.jpg`, `03.jpg`, …
  The **first** photo is used as the thumbnail in the gallery grid.
- Supported formats: JPG, PNG, WebP. Keep photos under ~4000px on the long side so
  the kiosk stays fast.

## Adding a new series

1. Create a new folder inside `content/photos/gallery-a/` (or `gallery-b/`),
   e.g. `content/photos/gallery-a/winter-exhibition/`.
2. Copy the photos into it, named `01.jpg`, `02.jpg`, …
3. Open `content/galleries.json` and add one line to that gallery's `series` list:

   ```json
   { "folder": "winter-exhibition", "title": "Winter Exhibition", "caption": "Optional caption shown in the photo viewer." }
   ```

   The order of entries in this list is the order the series appear on screen.
   (If you skip this step the series still appears — at the end, with a title made
   from the folder name.)

## Removing a series

1. Delete the series folder from `content/photos/`.
2. Remove its line from `content/galleries.json`.

## Adding/removing photos in an existing series

Just add or delete image files in the series folder. Remember: alphabetical order,
first file = thumbnail.

## Publishing your changes

The kiosk website updates when the project is pushed to Git — Netlify rebuilds and
publishes automatically within a couple of minutes:

```
git add .
git commit -m "Update gallery photos"
git push
```

If you don't use Git, ask your developer about Netlify's drag-and-drop deploy
(build the site with `npm run build`, then drag the `dist` folder onto the Netlify
"Deploys" page).

The kiosk browser picks up the new version on its next page load; it also caches
everything locally so it keeps working if the internet drops.

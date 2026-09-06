# How to add or remove photos (for museum staff)

All photos live in the `content/photos/` folder. No coding needed.

## The folder layout

```
content/
  photos/
    gallery-a/              ← Gallery
      postwar-museum-1947/  ← one folder = one photo series
        01.jpg
        02.jpg
        03.jpg
      gorshteyn-album/
        ...
    gallery-c/              ← Maps
      ...
    gallery-b/              ← Reference materials
      ...
  galleries.json            ← titles and order of the series
```

Rules:

- **One folder = one photo series.** The folder name is used internally — use lowercase
  letters and dashes, no spaces (e.g. `winter-exhibition`).
- **Photos show in alphabetical order.** Name them `01.jpg`, `02.jpg`, `03.jpg`, …
  The **first** photo is used as the thumbnail in the gallery grid.
- Supported formats: JPG, PNG, WebP. Full-resolution scans are fine — the build
  automatically makes small web-sized copies (a 600px grid thumbnail and a 1600px
  viewer image), so the kiosk only ever downloads those, not the heavy originals.

## Adding a new series

1. Create a new folder inside `content/photos/gallery-a/`, `gallery-b/`, or `gallery-c/`,
   e.g. `content/photos/gallery-a/winter-exhibition/`.
2. Copy the photos into it, named `01.jpg`, `02.jpg`, …
3. Open `content/galleries.json` and add one entry to that gallery's `series` list.
   Since the kiosk is bilingual, titles/captions/descriptions are given twice — once
   per language, with `_ua` and `_en` suffixes:

   ```json
   {
     "folder": "winter-exhibition",
     "title_ua": "Зимова виставка", "title_en": "Winter Exhibition",
     "caption_ua": "Необов'язковий підпис у переглядачі фото.", "caption_en": "Optional caption shown in the photo viewer.",
     "year": 2024
   }
   ```

   The order of entries in this list is the order the series appear on screen.
   (If you skip this step the series still appears — at the end, with a title made
   from the folder name and shown the same way in both languages.)

## Removing a series

1. Delete the series folder from `content/photos/`.
2. Remove its line from `content/galleries.json`.

## Adding/removing photos in an existing series

Just add or delete image files in the series folder. Remember: alphabetical order,
first file = thumbnail.

## Changing the first screen's background photos

The language-selection screen (the very first screen visitors see) shows a
slideshow of photos behind the "Українська" / "English" buttons, changing to
the next one every 10 seconds. Those photos live in `content/language-bg/`.

- **Photos show in alphabetical order**, then loop back to the first.
- Add, delete, or replace files there — any number of photos works (with
  only one, it just stays still instead of changing).
- Supported formats: JPG, PNG, WebP.

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

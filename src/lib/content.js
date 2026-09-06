import galleriesConfig from '../../content/galleries.json'

// Every image under content/photos/ is bundled at build time; staff only add
// files and (optionally) a title entry in content/galleries.json.
//
// The raw files are multi-megapixel scans (7-14 MB each). We never show more
// than ~2000px on this 1080-wide kiosk, so each photo is imported twice through
// vite-imagetools (see vite.config.js) and the originals never reach the bundle:
//   ?thumb   -> 900px  webp, used for the gallery grid + viewer filmstrip
//   ?display -> 2000px webp, used for the full-screen lightbox; the ?as=metadata
//               form also hands us the exact pixel size PhotoSwipe needs, so we
//               no longer download full images at startup just to measure them.
const thumbModules = import.meta.glob(
  '/content/photos/*/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?thumb', import: 'default' },
)
const displayModules = import.meta.glob(
  '/content/photos/*/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?display&as=metadata:src;width;height', import: 'default' },
)

function prettify(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}

function buildGalleries() {
  // path: /content/photos/<gallery>/<series>/<file>
  const folders = {}
  for (const [path, meta] of Object.entries(displayModules)) {
    const [, , , gallery, series, file] = path.split('/')
    folders[gallery] ??= {}
    folders[gallery][series] ??= []
    folders[gallery][series].push({
      file,
      thumb: thumbModules[path],
      src: meta.src,
      width: meta.width,
      height: meta.height,
    })
  }

  const galleries = {}
  for (const [galleryId, config] of Object.entries(galleriesConfig)) {
    const seriesFolders = folders[galleryId] ?? {}
    const series = []
    const listed = new Set()

    for (const entry of config.series) {
      listed.add(entry.folder)
      const images = seriesFolders[entry.folder]
      if (!images) {
        console.warn(`galleries.json lists "${entry.folder}" but content/photos/${galleryId}/${entry.folder}/ has no images`)
        continue
      }
      series.push(makeSeries(
        entry.folder,
        { ua: entry.title_ua, en: entry.title_en },
        { ua: entry.caption_ua, en: entry.caption_en },
        images,
        entry.year,
        { ua: entry.description_ua, en: entry.description_en },
      ))
    }

    // Folders staff added without a galleries.json entry still show up,
    // with a title derived from the folder name (same string in both languages,
    // since there's no translation to draw from).
    for (const [folder, images] of Object.entries(seriesFolders)) {
      if (!listed.has(folder)) {
        const fallback = prettify(folder)
        series.push(makeSeries(folder, { ua: fallback, en: fallback }, { ua: '', en: '' }, images))
      }
    }

    galleries[galleryId] = { id: galleryId, title: config.title, series }
  }
  return galleries
}

function makeSeries(folder, title, caption, images, year, description = { ua: '', en: '' }) {
  const sorted = [...images].sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))
  return {
    folder,
    title,
    caption: { ua: caption.ua ?? '', en: caption.en ?? '' },
    description: { ua: description.ua ?? '', en: description.en ?? '' },
    year: year ?? null,
    // Display images with their build-time pixel dimensions (for PhotoSwipe).
    images: sorted.map((img) => ({ src: img.src, width: img.width, height: img.height })),
    // Lightweight 900px webp versions for the grid card + viewer filmstrip.
    thumbs: sorted.map((img) => img.thumb),
    thumbnail: sorted[0].thumb,
  }
}

export const galleries = buildGalleries()

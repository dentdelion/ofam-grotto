import galleriesConfig from '../../content/galleries.json'

// Every image under content/photos/ is bundled at build time; staff only add
// files and (optionally) a title entry in content/galleries.json.
const imageModules = import.meta.glob(
  '/content/photos/*/*/*.{jpg,jpeg,png,webp,svg,JPG,JPEG,PNG,WEBP,SVG}',
  { eager: true, query: '?url', import: 'default' },
)

function prettify(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
}

function buildGalleries() {
  // path: /content/photos/<gallery>/<series>/<file>
  const folders = {}
  for (const [path, url] of Object.entries(imageModules)) {
    const [, , , gallery, series, file] = path.split('/')
    folders[gallery] ??= {}
    folders[gallery][series] ??= []
    folders[gallery][series].push({ file, url })
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
      series.push(makeSeries(entry.folder, entry.title, entry.caption, images, entry.year))
    }

    // Folders staff added without a galleries.json entry still show up,
    // with a title derived from the folder name.
    for (const [folder, images] of Object.entries(seriesFolders)) {
      if (!listed.has(folder)) {
        series.push(makeSeries(folder, prettify(folder), '', images))
      }
    }

    galleries[galleryId] = { id: galleryId, title: config.title, series }
  }
  return galleries
}

function makeSeries(folder, title, caption, images, year) {
  const sorted = [...images].sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))
  return {
    folder,
    title,
    caption: caption ?? '',
    year: year ?? null,
    images: sorted.map((img) => img.url),
    thumbnail: sorted[0].url,
  }
}

export const galleries = buildGalleries()

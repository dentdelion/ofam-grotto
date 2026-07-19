// PhotoSwipe needs each image's pixel dimensions. Rather than making staff
// maintain them, measure once at runtime and cache. preloadAll() warms the
// cache (and the browser cache) at app start so the lightbox opens instantly.
const cache = new Map()

function measure(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
        img.onerror = () => resolve({ width: 1600, height: 1200 })
        img.src = url
      }),
    )
  }
  return cache.get(url)
}

export function getSizes(urls) {
  return Promise.all(urls.map(measure))
}

export function preloadAll(galleries) {
  for (const gallery of Object.values(galleries)) {
    for (const series of gallery.series) {
      getSizes(series.images)
    }
  }
}

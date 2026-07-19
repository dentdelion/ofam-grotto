import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { getSizes } from './imageSizes'

let active = null

export async function openSeriesLightbox(series, startIndex = 0) {
  const sizes = await getSizes(series.images)
  const dataSource = series.images.map((url, i) => ({
    src: url,
    width: sizes[i].width,
    height: sizes[i].height,
    caption: series.caption ? `${series.title} — ${series.caption}` : series.title,
  }))

  const lightbox = new PhotoSwipeLightbox({
    dataSource,
    pswpModule: () => import('photoswipe'),
    // Kiosk: keep users inside the experience
    closeOnVerticalDrag: true,
    pinchToClose: true,
    wheelToZoom: false,
    counter: true,
    zoom: false,
    bgOpacity: 0.95,
  })

  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'series-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        el.className = 'pswp__series-caption'
        pswp.on('change', () => {
          el.textContent = pswp.currSlide.data.caption ?? ''
        })
      },
    })
  })

  lightbox.on('destroy', () => {
    if (active === lightbox) active = null
  })

  lightbox.init()
  lightbox.loadAndOpen(startIndex)
  active = lightbox
}

// Used by the idle-reset timer to make sure a stale lightbox
// isn't left open for the next visitor.
export function closeActiveLightbox() {
  active?.pswp?.close()
  active = null
}

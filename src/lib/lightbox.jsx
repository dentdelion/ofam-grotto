import { createRoot } from 'react-dom/client'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { getSizes } from './imageSizes'
import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../designSize'
import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import KioskFooter from '../components/KioskFooter'
import ViewerArrows from '../components/ViewerArrows'
import ViewerBottomPanel from '../components/ViewerBottomPanel'
import { strings } from './i18n'

let active = null

// The image sits in the space between the header and the bottom panel
// (filmstrip + counter + caption) + footer. Keep TOP/BOTTOM in sync with
// the 680px vertical-center hardcoded in ViewerArrows.module.css.
const TOP_PADDING = 240
const BOTTOM_PADDING = 640 + 161 + 40
const SIDE_PADDING = 140

// Full-screen album viewer, styled after Figma "Grotto screen" node
// 2281:9117, with a thumbnail filmstrip added below the image. Renders on
// top of PhotoSwipe (preserves pinch-zoom/swipe) but swaps its default UI
// for React-rendered chrome that matches the rest of the kiosk.
export async function openSeriesLightbox(series, lang, onToggleLang, startIndex = 0) {
  const sizes = await getSizes(series.images)
  const dataSource = series.images.map((url, i) => ({
    src: url,
    width: sizes[i].width,
    height: sizes[i].height,
  }))

  const lightbox = new PhotoSwipeLightbox({
    dataSource,
    pswpModule: () => import('photoswipe'),
    // Mount inside the scaled design-resolution canvas (not document.body)
    // so this viewer uses the same 1080×1920 coordinate space as every
    // other screen instead of raw device pixels.
    appendToEl: document.getElementById('kiosk-canvas') ?? undefined,
    getViewportSizeFn: () => ({ x: DESIGN_WIDTH, y: DESIGN_HEIGHT }),
    padding: { top: TOP_PADDING, bottom: BOTTOM_PADDING, left: SIDE_PADDING, right: SIDE_PADDING },
    loop: true,
    wheelToZoom: false,
    closeOnVerticalDrag: false,
    pinchToClose: false,
    bgOpacity: 1,
    close: false,
    counter: false,
    zoom: false,
    arrowPrev: false,
    arrowNext: false,
    preloader: false,
  })

  let currentLang = lang
  const mounted = []

  lightbox.on('uiRegister', () => {
    const { pswp } = lightbox

    // PhotoSwipe's own stylesheet declares these same custom properties
    // directly on `.pswp` (not `:root`), so an external CSS override loses
    // the cascade tie by source order. An inline style always wins.
    pswp.element.style.setProperty('--pswp-bg', '#fff')
    pswp.element.style.setProperty('--pswp-icon-color', '#070707')
    pswp.element.style.setProperty('--pswp-icon-color-secondary', '#070707')
    pswp.element.style.setProperty('--pswp-error-text-color', '#070707')

    const mount = (name, Component, getProps) => {
      pswp.ui.registerElement({
        name,
        appendTo: 'root',
        isButton: false,
        className: `pswp__custom-${name}`,
        onInit: (el) => {
          const root = createRoot(el)
          const render = () => root.render(<Component {...getProps()} />)
          mounted.push({ root, render })
          render()
        },
      })
    }

    const refreshAll = () => mounted.forEach(({ render }) => render())

    mount('back', BackButton, () => ({
      lang: currentLang,
      onClick: () => pswp.close(),
    }))

    mount('lang', LanguageToggle, () => ({
      lang: currentLang,
      onToggle: () => {
        currentLang = currentLang === 'ua' ? 'en' : 'ua'
        onToggleLang?.()
        refreshAll()
      },
    }))

    mount('footer', KioskFooter, () => ({}))

    mount('arrows', ViewerArrows, () => ({
      labels: strings[currentLang],
      onPrev: () => pswp.prev(),
      onNext: () => pswp.next(),
    }))

    mount('panel', ViewerBottomPanel, () => ({
      lang: currentLang,
      series,
      images: series.images,
      currentIndex: pswp.currIndex,
      onSelect: (i) => pswp.goTo(i),
      onZoomIn: () => zoomStep(pswp, 1),
      onZoomOut: () => zoomStep(pswp, -1),
    }))

    pswp.on('change', refreshAll)
  })

  lightbox.on('destroy', () => {
    mounted.forEach(({ root }) => root.unmount())
    if (active === lightbox) active = null
  })

  lightbox.init()
  lightbox.loadAndOpen(startIndex)
  active = lightbox
}

function zoomStep(pswp, direction) {
  const slide = pswp.currSlide
  if (!slide) return
  const target = direction > 0 ? slide.zoomLevels.secondary : slide.zoomLevels.initial
  pswp.zoomTo(target, { x: pswp.viewportSize.x / 2, y: pswp.viewportSize.y / 2 }, 300)
}

// Used by the idle-reset timer to make sure a stale lightbox
// isn't left open for the next visitor.
export function closeActiveLightbox() {
  active?.pswp?.close()
  active = null
}

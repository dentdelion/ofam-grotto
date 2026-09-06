// UI strings per language. Content (gallery titles etc.) lives in
// content/galleries.json; this is only for fixed interface labels.
export const strings = {
  ua: {
    menuGallery: 'Галерея',
    menuMaps: 'Мапи',
    menuReference: 'Довідникові матеріали',
    menuInfo: 'Загальні відомості',
    back: 'Назад',
    total: 'Всього',
    allPeriods: 'Усі періоди',
    infoChronology: 'Хронологія назв музею',
    infoDirectors: 'Очільники музею',
    placeholderBody: 'Цей екран ще не спроєктовано. Вміст з’явиться, коли буде надано макет Figma.',
    viewerPage: 'сторінка',
    zoomIn: 'Збільшити',
    zoomOut: 'Зменшити',
    prevPhoto: 'Попереднє фото',
    nextPhoto: 'Наступне фото',
    archiveLine: (year, source) => (year != null ? `${year} рік. ${source}` : source),
  },
  en: {
    menuGallery: 'Gallery',
    menuMaps: 'Maps',
    menuReference: 'Reference materials',
    menuInfo: 'General information',
    back: 'Back',
    total: 'Total',
    allPeriods: 'All periods',
    infoChronology: 'Chronology of Museum Names',
    infoDirectors: 'Museum directors',
    placeholderBody: 'This screen has not been designed yet. Content will appear once its Figma frame is provided.',
    viewerPage: 'page',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    archiveLine: (year, source) => (year != null ? `${year}. ${source}` : source),
    // English-only menu entry (Figma "ENG Grotto screen", node 2331:1412) —
    // no Ukrainian equivalent has been requested, so this key is EN-only.
    exploreExhibition: 'Explore the Exhibition',
    // Back-button label for the exhibition chapter list (Figma node
    // 2428:2316) — English-only, same reasoning as exploreExhibition above.
    returnButton: 'Return',
  },
}

// Screen titles for the gallery sections reuse the menu labels.
export const galleryTitleKey = {
  'gallery-a': 'menuGallery',
  'gallery-c': 'menuMaps',
  'gallery-b': 'menuReference',
}

// Period filter chips (Figma frame 2281:9031). The design's second row
// repeats "1991 >" — placeholder duplicates; these are the distinct ones.
export const periods = [
  { id: 'pre1900', label: '< 1900', test: (y) => y <= 1900 },
  { id: 'early', label: '1901 — 1939', test: (y) => y >= 1901 && y <= 1939 },
  { id: 'mid', label: '1939 — 1991', test: (y) => y >= 1940 && y <= 1991 },
  { id: 'modern', label: '1991 >', test: (y) => y > 1991 },
]

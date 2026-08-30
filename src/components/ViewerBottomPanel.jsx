import zoomOutIcon from '../assets/zoom-out.svg'
import zoomInIcon from '../assets/zoom-in.svg'
import { strings } from '../lib/i18n'
import styles from './ViewerBottomPanel.module.css'

// Filmstrip + page counter/zoom + caption, stacked below the photo
// (Figma node 2281:9117's caption block, plus the filmstrip added on request).
export default function ViewerBottomPanel({ lang, series, images, currentIndex, onSelect, onZoomIn, onZoomOut }) {
  const t = strings[lang]
  return (
    <div className={styles.panel}>
      <div className={styles.filmstrip}>
        {images.map((src, i) => (
          <button
            key={src}
            data-testid="viewer-thumb"
            className={`${styles.thumb} ${i === currentIndex ? styles.thumbActive : ''}`}
            onClick={() => onSelect(i)}
          >
            <img src={src} alt="" className={styles.thumbImg} />
          </button>
        ))}
      </div>

      <div className={styles.counterRow}>
        <button className={styles.zoomButton} onClick={onZoomOut} aria-label={t.zoomOut}>
          <img src={zoomOutIcon} alt="" className={styles.zoomIcon} />
        </button>
        <span data-testid="viewer-counter" className={styles.counterText}>
          {t.viewerPage} {currentIndex + 1}/{images.length}
        </span>
        <button className={styles.zoomButton} onClick={onZoomIn} aria-label={t.zoomIn}>
          <img src={zoomInIcon} alt="" className={styles.zoomIcon} />
        </button>
      </div>

      <div className={styles.caption}>
        <div className={styles.captionHead}>
          <p className={styles.title}>{series.title}</p>
          {series.year != null && <p className={styles.subtitle}>{t.archiveLine(series.year)}</p>}
        </div>
        {series.description && <p className={styles.description}>{series.description}</p>}
      </div>
    </div>
  )
}

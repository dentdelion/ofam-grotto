import { openSeriesLightbox } from '../lib/lightbox'
import styles from './Gallery.module.css'

export default function Gallery({ gallery, onNavigate }) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => onNavigate('home')}>
          ‹ Back
        </button>
        <h1 className={styles.title}>{gallery.title}</h1>
      </header>
      <div className={styles.grid}>
        {gallery.series.map((series) => (
          <button
            key={series.folder}
            className={styles.card}
            onClick={() => openSeriesLightbox(series)}
          >
            <img className={styles.thumb} src={series.thumbnail} alt={series.title} />
            <span className={styles.cardTitle}>{series.title}</span>
            <span className={styles.cardCount}>{series.images.length} photos</span>
          </button>
        ))}
      </div>
    </div>
  )
}

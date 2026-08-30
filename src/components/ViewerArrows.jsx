import arrowIcon from '../assets/arrow.svg'
import styles from './ViewerArrows.module.css'

// Prev/next navigation for the album viewer (Figma nodes 2281:9125 / 2281:9126).
// Rendered as a full-screen, pointer-events-none layer so the gap between the
// two buttons stays click-through for PhotoSwipe's own swipe handling.
export default function ViewerArrows({ labels, onPrev, onNext }) {
  return (
    <div className={styles.layer}>
      <button
        data-testid="viewer-prev"
        className={`${styles.arrowButton} ${styles.prev}`}
        onClick={onPrev}
        aria-label={labels.prevPhoto}
      >
        <img src={arrowIcon} alt="" className={styles.prevIcon} />
      </button>
      <button
        data-testid="viewer-next"
        className={`${styles.arrowButton} ${styles.next}`}
        onClick={onNext}
        aria-label={labels.nextPhoto}
      >
        <img src={arrowIcon} alt="" className={styles.nextIcon} />
      </button>
    </div>
  )
}

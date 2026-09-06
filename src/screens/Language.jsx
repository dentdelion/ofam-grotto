import KioskFooter from '../components/KioskFooter'
import BgSlideshow from '../components/BgSlideshow'
import bgSlideshowImages from '../lib/bgSlideshowImages'
import styles from './Language.module.css'

// Entry / language-selection screen (Figma "Grotto screen", node 2281:8952),
// with a background photo slideshow added per the museum's request
// (content/language-bg) — the only screen that carries it.
export default function Language({ onSelect }) {
  return (
    <div className={styles.screen}>
      <BgSlideshow images={bgSlideshowImages} />
      <p className={styles.titleUa}>Дізнайтесь більше про музей</p>
      <p className={styles.titleEn}>Learn more about museum</p>
      <button className={`${styles.langButton} ${styles.ua}`} onClick={() => onSelect('ua')}>
        Українська
      </button>
      <button className={`${styles.langButton} ${styles.en}`} onClick={() => onSelect('en')}>
        English
      </button>
      <KioskFooter />
    </div>
  )
}

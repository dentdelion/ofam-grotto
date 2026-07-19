import KioskFooter from '../components/KioskFooter'
import bgPhoto from '../assets/bg-photo.jpg'
import styles from './Language.module.css'

// Entry / language-selection screen (Figma "Grotto screen", node 2281:8952).
export default function Language({ onSelect }) {
  return (
    <div className={styles.screen}>
      <div className={styles.bg}>
        <img src={bgPhoto} alt="" />
      </div>
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

import KioskFooter from '../components/KioskFooter'
import LanguageToggle from '../components/LanguageToggle'
import { strings } from '../lib/i18n'
import styles from './Home.module.css'

// Main menu (Figma "Grotto screen", node 2281:8921).
export default function Home({ onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <LanguageToggle lang={lang} onToggle={onToggleLang} />
      <div className={styles.menu}>
        <button className={styles.menuButton} onClick={() => onNavigate('gallery-a')}>
          {t.menuGallery}
        </button>
        <button className={styles.menuButton} onClick={() => onNavigate('gallery-b')}>
          {t.menuReference}
        </button>
        <button className={styles.menuButton} onClick={() => onNavigate('info')}>
          {t.menuInfo}
        </button>
      </div>
      <KioskFooter />
    </div>
  )
}

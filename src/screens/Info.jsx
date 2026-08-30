import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import KioskFooter from '../components/KioskFooter'
import { strings } from '../lib/i18n'
import styles from './Info.module.css'

// General information menu (Figma "Grotto screen", node 2281:8928).
export default function Info({ onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('home')} />
      <LanguageToggle lang={lang} onToggle={onToggleLang} />

      <header className={styles.header}>
        <h1 className={styles.title}>{t.menuInfo}</h1>
      </header>

      <div className={styles.menu}>
        <button className={styles.menuButton} onClick={() => onNavigate('info-chronology')}>
          {t.infoChronology}
        </button>
        <button className={styles.menuButton} onClick={() => onNavigate('info-directors')}>
          {t.infoDirectors}
        </button>
      </div>

      <KioskFooter />
    </div>
  )
}

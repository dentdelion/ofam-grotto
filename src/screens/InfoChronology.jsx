import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import KioskFooter from '../components/KioskFooter'
import { strings } from '../lib/i18n'
import { chronology } from '../lib/chronology'
import styles from './InfoChronology.module.css'

// Museum name chronology (Figma "Grotto screen", node 2300:677).
export default function InfoChronology({ onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('info')} />
      <LanguageToggle lang={lang} onToggle={onToggleLang} />

      <header className={styles.header}>
        <h1 className={styles.title}>{t.infoChronology}</h1>
      </header>

      <ol className={styles.list}>
        {chronology.map((entry) => (
          <li key={entry.year} className={styles.row}>
            <span className={styles.year}>{entry.year}</span>
            <span className={styles.name}>{entry[lang]}</span>
          </li>
        ))}
      </ol>

      <KioskFooter />
    </div>
  )
}

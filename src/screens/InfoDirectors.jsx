import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import { strings } from '../lib/i18n'
import directors from '../lib/directors'
import styles from './InfoDirectors.module.css'

// Museum directors (Figma "Grotto screen", node 2303:811). Names are
// Ukrainian-only proper nouns — no English variant was given, so only the
// screen chrome (back/title) responds to `lang`.
export default function InfoDirectors({ onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('info')} style={{ top: '70px' }} />
      <LanguageToggle lang={lang} onToggle={onToggleLang} style={{ top: '70px' }} />

      <header className={styles.header}>
        <h1 className={styles.title}>{t.infoDirectors}</h1>
      </header>

      <ol className={styles.list}>
        {directors.map((entry) => (
          <li key={entry.years} className={styles.row}>
            <span className={styles.years}>{entry.years}</span>
            <span className={styles.name}>{entry.name}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

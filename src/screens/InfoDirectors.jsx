import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import { strings } from '../lib/i18n'
import directors from '../lib/directors'
import styles from './InfoDirectors.module.css'

// Museum directors (Figma "Grotto screen", node 2303:811). No English
// variant was given in Figma or on the museum's own site; English names are
// a transliteration (Ukrainian National system), matching the spellings the
// museum itself uses for its documented directors (Kostandi, Roitburd, Kulai).
export default function InfoDirectors({ onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('info')} style={{ top: '70px' }} />
      <LanguageToggle lang={lang} onToggle={onToggleLang} />

      <header className={styles.header}>
        <h1 className={styles.title}>{t.infoDirectors}</h1>
      </header>

      <ol className={styles.list}>
        {directors.map((entry) => (
          <li key={entry.years} className={styles.row}>
            <span className={styles.years}>{lang === 'en' && entry.years_en ? entry.years_en : entry.years}</span>
            <span className={styles.name}>{entry[lang]}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

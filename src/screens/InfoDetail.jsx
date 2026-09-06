import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import { strings } from '../lib/i18n'
import styles from './InfoDetail.module.css'

// Generic placeholder for destinations with no Figma frame yet (originally
// "Хронологія назв музею" / "Очільники музею", linked from Info node
// 2312:9778 / 2312:9787; also reused for exhibition chapters, node
// 2428:2313's rows). Replace with the real design once its node-id is
// shared. Pass `title` for a literal (non-i18n) heading, e.g. chapter
// titles from content/exhibition-chapters.json; `titleKey` looks it up in
// strings[lang] instead. `hideLanguageToggle` matches screens (like the
// exhibition chapter list) whose Figma frame has no language switcher.
export default function InfoDetail({
  titleKey,
  title,
  backTo = 'info',
  backLabel,
  hideLanguageToggle = false,
  onNavigate,
  lang,
  onToggleLang,
}) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate(backTo)} label={backLabel} />
      {!hideLanguageToggle && <LanguageToggle lang={lang} onToggle={onToggleLang} />}

      <header className={styles.header}>
        <h1 className={styles.title}>{title ?? t[titleKey]}</h1>
      </header>

      <p className={styles.body}>{t.placeholderBody}</p>
    </div>
  )
}

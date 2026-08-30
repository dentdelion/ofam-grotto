import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import KioskFooter from '../components/KioskFooter'
import { strings } from '../lib/i18n'
import styles from './InfoDetail.module.css'

// Placeholder for "Хронологія назв музею" / "Очільники музею" — the two
// destinations linked from Info (node 2312:9778 / 2312:9787). No Figma
// frame has been provided for these yet; replace with the real design
// once its node-id is shared.
export default function InfoDetail({ titleKey, onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('info')} />
      <LanguageToggle lang={lang} onToggle={onToggleLang} />

      <header className={styles.header}>
        <h1 className={styles.title}>{t[titleKey]}</h1>
      </header>

      <p className={styles.body}>{t.placeholderBody}</p>

      <KioskFooter />
    </div>
  )
}

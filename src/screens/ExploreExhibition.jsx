import BackButton from '../components/BackButton'
import chapters from '../lib/exhibitionChapters'
import { strings } from '../lib/i18n'
import styles from './ExploreExhibition.module.css'

// "Explore the Exhibition" chapter list (Figma node 2428:2313), English-only
// — no language toggle on this screen, matching the Figma frame.
export default function ExploreExhibition({ onNavigate, onSelectChapter, lang }) {
  const t = strings[lang]
  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('home')} label={t.returnButton} style={{ top: '70px' }} />
      <div className={styles.list}>
        {chapters.map((title, i) => (
          <button key={title} className={styles.item} onClick={() => onSelectChapter(i)}>
            {i + 1}. {title}
          </button>
        ))}
      </div>
    </div>
  )
}

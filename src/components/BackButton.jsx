import { strings } from '../lib/i18n'
import styles from './BackButton.module.css'

// Top-left black back button (Figma node 2244:8201). `label` and `style`
// let callers override the text (e.g. "Return") and position for screens
// that reuse this component at a different spot (e.g. Figma node 2428:2316).
export default function BackButton({ lang, onClick, label, style }) {
  return (
    <button className={styles.back} onClick={onClick} style={style}>
      <span className={styles.chevron} />
      {label ?? strings[lang].back}
    </button>
  )
}

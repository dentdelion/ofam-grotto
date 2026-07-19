import { strings } from '../lib/i18n'
import styles from './BackButton.module.css'

// Top-left black back button (Figma node 2244:8201).
export default function BackButton({ lang, onClick }) {
  return (
    <button className={styles.back} onClick={onClick}>
      <span className={styles.chevron} />
      {strings[lang].back}
    </button>
  )
}

import styles from './LanguageToggle.module.css'

// Top-right language switch (Figma node 2236:7955). Shows the language the
// visitor would switch TO, per the design (UA screen shows "EN"). `style`
// lets callers override position for screens with a different header
// layout (e.g. Figma node 2303:811's compact top:70 header row).
export default function LanguageToggle({ lang, onToggle, style }) {
  return (
    <button className={styles.toggle} onClick={onToggle} style={style}>
      {lang === 'ua' ? 'EN' : 'UA'}
    </button>
  )
}

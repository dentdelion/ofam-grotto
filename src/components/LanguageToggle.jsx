import styles from './LanguageToggle.module.css'

// Top-right language switch (Figma node 2236:7955). Shows the language the
// visitor would switch TO, per the design (UA screen shows "EN"). `style`
// lets callers override position when a screen needs a different layout.
export default function LanguageToggle({ lang, onToggle, style }) {
  return (
    <button className={styles.toggle} onClick={onToggle} style={style}>
      {lang === 'ua' ? 'EN' : 'UA'}
    </button>
  )
}

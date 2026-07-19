import styles from './LanguageToggle.module.css'

// Top-right language switch (Figma node 2236:7955). Shows the language the
// visitor would switch TO, per the design (UA screen shows "EN").
export default function LanguageToggle({ lang, onToggle }) {
  return (
    <button className={styles.toggle} onClick={onToggle}>
      {lang === 'ua' ? 'EN' : 'UA'}
    </button>
  )
}

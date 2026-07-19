import styles from './Info.module.css'

// Placeholder for the third home-screen button's destination —
// replace with whatever the Figma design shows for this screen.
export default function Info({ onNavigate }) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => onNavigate('home')}>
          ‹ Back
        </button>
        <h1 className={styles.title}>About the Museum</h1>
      </header>
      <div className={styles.body}>
        <p>
          This screen is a placeholder. Its final content and layout will come from the
          Figma design for the third home-screen button.
        </p>
      </div>
    </div>
  )
}

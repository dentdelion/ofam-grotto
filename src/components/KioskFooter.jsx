import styles from './KioskFooter.module.css'
import pfruLogo from '../assets/pfru-logo.png'
import marazliLogo from '../assets/marazli-logo.svg'
import museumLogoMark from '../assets/museum-logo-mask.svg'
import museumLogoText from '../assets/museum-logo-text.svg'

// Bottom partner-logos band, shared by every screen (Figma node 2226:7806).
export default function KioskFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.credit}>
        Проєкт здійснено за підтримки Програми “Партнерство за сильну Україну”, яка фінансується
        урядами Великої Британії, Естонії, Канади, Норвегії, Фінляндії, Швейцарії та Швеції.
      </p>
      <img className={styles.pfruLogo} src={pfruLogo} alt="Партнерство за сильну Україну" />
      <img className={styles.marazliLogo} src={marazliLogo} alt="Marazli Club" />
      <img className={styles.museumLogoMark} src={museumLogoMark} alt="" />
      <img className={styles.museumLogoText} src={museumLogoText} alt="Одеський національний художній музей" />
    </footer>
  )
}

import styles from './Partnerships.module.css'
import pfruLogo from '../assets/pfru-logo.png'
// NOTE: these three asset files are misnamed. Their actual contents:
//   marazli-logo.svg     -> the Odesa museum logo (spiral + ОНХМ wordmark)
//   museum-logo-mask.svg  -> the Marazli Club face emblem
//   museum-logo-text.svg  -> the Marazli Club wordmark
import museumLogo from '../assets/marazli-logo.svg'
import marazliMark from '../assets/museum-logo-mask.svg'
import marazliWordmark from '../assets/museum-logo-text.svg'

const CREDIT_UA =
  'Проєкт здійснено за підтримки Програми “Партнерство за сильну Україну”, яка фінансується ' +
  'урядами Великої Британії, Естонії, Канади, Норвегії, Фінляндії, Швейцарії та Швеції.'

const CREDIT_EN =
  'The project was implemented with the support of the “Partnership for a Resilient Ukraine” ' +
  'program, which is funded by the governments of the United Kingdom, Estonia, Canada, Norway, ' +
  'Finland, Switzerland, and Sweden.'

// Full-screen partner-credits frame (Figma node 2428:1748). The former
// KioskFooter band was dropped from every screen in the new design; the
// partner acknowledgement now lives here, shown once per loop as the final
// slide of the entry-screen slideshow (see BgSlideshow). Logo order matches
// the Figma frame: PFRU · Odesa museum · Marazli Club.
export default function Partnerships() {
  return (
    <div className={styles.frame}>
      <p className={styles.credit}>{CREDIT_UA}</p>

      <div className={styles.logos}>
        <img className={styles.pfruLogo} src={pfruLogo} alt="Партнерство за сильну Україну" />
        <img
          className={styles.museumLogo}
          src={museumLogo}
          alt="Одеський національний художній музей"
        />
        <span className={styles.marazliLogo}>
          <img className={styles.marazliMark} src={marazliMark} alt="" />
          <img className={styles.marazliWordmark} src={marazliWordmark} alt="Marazli Club" />
        </span>
      </div>

      <p className={styles.credit}>{CREDIT_EN}</p>
    </div>
  )
}

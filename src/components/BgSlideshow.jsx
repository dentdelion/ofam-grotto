import { useEffect, useState } from 'react'
import Partnerships from './Partnerships'
import styles from './BgSlideshow.module.css'

const SLIDE_MS = 10_000

// Background slideshow for the entry (Language) screen. Cross-fades through
// the given photos, one every 10s, then shows the full-screen partner-credits
// frame (Figma node 2428:1748) once per loop — also 10s — before repeating.
// Tapping the credits frame jumps straight back to the first photo, revealing
// the language-choice buttons underneath (per the museum's request).
export default function BgSlideshow({ images }) {
  const creditsIndex = images.length
  const slideCount = images.length + 1 // photos + the partner-credits frame
  const [index, setIndex] = useState(0)
  const [restart, setRestart] = useState(0) // bump to re-arm the timer on tap

  useEffect(() => {
    if (slideCount < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount)
    }, SLIDE_MS)
    return () => clearInterval(id)
  }, [slideCount, restart])

  const showLanguageChoice = () => {
    setIndex(0)
    setRestart((n) => n + 1)
  }

  const creditsShown = index === creditsIndex

  return (
    <div className={styles.bg}>
      {images.map((src, i) => (
        <img key={src} src={src} alt="" className={i === index ? styles.active : styles.photo} />
      ))}
      <div className={styles.overlay} />
      <div
        className={creditsShown ? styles.creditsActive : styles.credits}
        onClick={showLanguageChoice}
        aria-hidden={!creditsShown}
      >
        <Partnerships />
      </div>
    </div>
  )
}

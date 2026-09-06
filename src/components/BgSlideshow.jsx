import { useEffect, useState } from 'react'
import styles from './BgSlideshow.module.css'

const SLIDE_MS = 10_000

// Background photo slideshow for the Home screen, requested directly by the
// museum (see content/home-bg — photos + "головний екран" doc): cross-fades
// through the given photos, one every 10s, looping.
export default function BgSlideshow({ images }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, SLIDE_MS)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div className={styles.bg}>
      {images.map((src, i) => (
        <img key={src} src={src} alt="" className={i === index ? styles.active : styles.photo} />
      ))}
      <div className={styles.overlay} />
    </div>
  )
}

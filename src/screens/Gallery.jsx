import { useEffect, useMemo, useRef, useState } from 'react'
import { openSeriesLightbox } from '../lib/lightbox'
import BackButton from '../components/BackButton'
import LanguageToggle from '../components/LanguageToggle'
import { strings, galleryTitleKey, periods } from '../lib/i18n'
import styles from './Gallery.module.css'

const TRACK_HEIGHT = 1072

// Gallery grid screen (Figma "Grotto screen", node 2281:9022).
export default function Gallery({ gallery, onNavigate, lang, onToggleLang }) {
  const t = strings[lang]
  const [activePeriods, setActivePeriods] = useState(new Set())
  const scrollRef = useRef(null)
  const [thumb, setThumb] = useState({ top: 0, height: TRACK_HEIGHT })

  const series = useMemo(() => {
    if (activePeriods.size === 0) return gallery.series
    const tests = periods.filter((p) => activePeriods.has(p.id)).map((p) => p.test)
    return gallery.series.filter((s) => s.year != null && tests.some((test) => test(s.year)))
  }, [gallery, activePeriods])

  const totalPhotos = useMemo(
    () => gallery.series.reduce((sum, s) => sum + s.images.length, 0),
    [gallery],
  )

  const togglePeriod = (id) => {
    setActivePeriods((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const updateThumb = () => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight <= clientHeight) {
      setThumb({ top: 0, height: TRACK_HEIGHT })
      return
    }
    const height = Math.max(60, (clientHeight / scrollHeight) * TRACK_HEIGHT)
    const top = (scrollTop / (scrollHeight - clientHeight)) * (TRACK_HEIGHT - height)
    setThumb({ top, height })
  }

  useEffect(updateThumb, [series])

  return (
    <div className={styles.screen}>
      <BackButton lang={lang} onClick={() => onNavigate('home')} />
      <LanguageToggle lang={lang} onToggle={onToggleLang} />

      <header className={styles.header}>
        <h1 className={styles.title}>{t[galleryTitleKey[gallery.id]]}</h1>
        <span className={styles.count}>{t.total}: {totalPhotos}</span>
      </header>

      <div className={styles.filters}>
        <button
          className={styles.chip}
          onClick={() => setActivePeriods(new Set())}
        >
          <span className={`${styles.checkbox} ${activePeriods.size === 0 ? styles.checked : ''}`} />
          {t.allPeriods}
        </button>
        {periods.map((p) => (
          <button key={p.id} className={styles.chip} onClick={() => togglePeriod(p.id)}>
            <span className={`${styles.checkbox} ${activePeriods.has(p.id) ? styles.checked : ''}`} />
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.scrollArea} ref={scrollRef} onScroll={updateThumb}>
        <div className={styles.grid}>
          {series.map((s) => (
            <button key={s.folder} className={styles.card} onClick={() => openSeriesLightbox(s, lang, onToggleLang)}>
              <img className={styles.thumb} src={s.thumbnail} alt={s.title} />
              <span className={styles.cardTitle}>{s.title}</span>
              <span className={styles.cardMeta}>{s.caption}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.scrollTrack}>
        <div
          className={styles.scrollThumb}
          style={{ top: thumb.top, height: thumb.height }}
        />
      </div>
    </div>
  )
}

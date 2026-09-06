import { useCallback, useEffect, useState } from 'react'
import ScaleShell from './components/ScaleShell'
import Language from './screens/Language'
import Home from './screens/Home'
import Gallery from './screens/Gallery'
import Info from './screens/Info'
import InfoChronology from './screens/InfoChronology'
import InfoDirectors from './screens/InfoDirectors'
import InfoDetail from './screens/InfoDetail'
import ExploreExhibition from './screens/ExploreExhibition'
import ExhibitionChapter from './screens/ExhibitionChapter'
import { galleries } from './lib/content'
import chapters from './lib/exhibitionChapters'
import chapterContent from './lib/exhibitionChapterContent'
import { strings } from './lib/i18n'
import { preloadAll } from './lib/imageSizes'
import { closeActiveLightbox } from './lib/lightbox'
import { useIdleReset } from './lib/useIdleReset'

const IDLE_RESET_MS = 90_000

export default function App() {
  const [screen, setScreen] = useState('language')
  const [lang, setLang] = useState('ua')
  const [chapterIndex, setChapterIndex] = useState(0)

  useEffect(() => {
    preloadAll(galleries)
    const blockContextMenu = (e) => e.preventDefault()
    window.addEventListener('contextmenu', blockContextMenu)
    return () => window.removeEventListener('contextmenu', blockContextMenu)
  }, [])

  const resetToLanguage = useCallback(() => {
    closeActiveLightbox()
    setScreen('language')
  }, [])

  useIdleReset(resetToLanguage, IDLE_RESET_MS)

  const selectLanguage = useCallback((nextLang) => {
    setLang(nextLang)
    setScreen('home')
  }, [])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ua' ? 'en' : 'ua'))
  }, [])

  const selectChapter = useCallback((index) => {
    setChapterIndex(index)
    setScreen('explore-chapter')
  }, [])

  return (
    <ScaleShell>
      {screen === 'language' && <Language onSelect={selectLanguage} />}
      {screen === 'home' && <Home onNavigate={setScreen} lang={lang} onToggleLang={toggleLang} />}
      {(screen === 'gallery-a' || screen === 'gallery-b') && (
        <Gallery gallery={galleries[screen]} onNavigate={setScreen} lang={lang} onToggleLang={toggleLang} />
      )}
      {screen === 'info' && <Info onNavigate={setScreen} lang={lang} onToggleLang={toggleLang} />}
      {screen === 'info-chronology' && (
        <InfoChronology onNavigate={setScreen} lang={lang} onToggleLang={toggleLang} />
      )}
      {screen === 'info-directors' && (
        <InfoDirectors onNavigate={setScreen} lang={lang} onToggleLang={toggleLang} />
      )}
      {screen === 'explore-exhibition' && (
        <ExploreExhibition onNavigate={setScreen} onSelectChapter={selectChapter} lang={lang} />
      )}
      {screen === 'explore-chapter' && chapterContent[chapterIndex] && (
        <ExhibitionChapter
          chapterIndex={chapterIndex}
          content={chapterContent[chapterIndex]}
          onNavigate={setScreen}
          onNext={() => selectChapter(chapterIndex + 1)}
        />
      )}
      {screen === 'explore-chapter' && !chapterContent[chapterIndex] && (
        <InfoDetail
          title={`${chapterIndex + 1}. ${chapters[chapterIndex]}`}
          backTo="explore-exhibition"
          backLabel={strings.en.returnButton}
          hideLanguageToggle
          onNavigate={setScreen}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}
    </ScaleShell>
  )
}

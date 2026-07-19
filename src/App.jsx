import { useCallback, useEffect, useState } from 'react'
import ScaleShell from './components/ScaleShell'
import Language from './screens/Language'
import Home from './screens/Home'
import Gallery from './screens/Gallery'
import Info from './screens/Info'
import { galleries } from './lib/content'
import { preloadAll } from './lib/imageSizes'
import { closeActiveLightbox } from './lib/lightbox'
import { useIdleReset } from './lib/useIdleReset'

const IDLE_RESET_MS = 120_000

export default function App() {
  const [screen, setScreen] = useState('language')
  const [lang, setLang] = useState('ua')

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

  return (
    <ScaleShell>
      {screen === 'language' && <Language onSelect={selectLanguage} />}
      {screen === 'home' && <Home onNavigate={setScreen} lang={lang} onToggleLang={toggleLang} />}
      {(screen === 'gallery-a' || screen === 'gallery-b') && (
        <Gallery gallery={galleries[screen]} onNavigate={setScreen} />
      )}
      {screen === 'info' && <Info onNavigate={setScreen} />}
    </ScaleShell>
  )
}

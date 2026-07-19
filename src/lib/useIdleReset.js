import { useEffect } from 'react'

// After `timeoutMs` without any touch/click/key, run onIdle (close lightbox,
// return to the home screen) so the kiosk is fresh for the next visitor.
export function useIdleReset(onIdle, timeoutMs = 120_000) {
  useEffect(() => {
    let timer
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(onIdle, timeoutMs)
    }
    const events = ['pointerdown', 'pointermove', 'touchstart', 'keydown']
    for (const ev of events) window.addEventListener(ev, reset, { passive: true })
    reset()
    return () => {
      clearTimeout(timer)
      for (const ev of events) window.removeEventListener(ev, reset)
    }
  }, [onIdle, timeoutMs])
}

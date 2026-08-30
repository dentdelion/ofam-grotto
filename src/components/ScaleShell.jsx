import { useEffect, useState } from 'react'
import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../designSize'
import styles from './ScaleShell.module.css'

// Renders children on a fixed DESIGN_WIDTH×DESIGN_HEIGHT canvas and scales it
// to fit the actual screen, so the layout is pixel-identical to the Figma
// frame on the kiosk and still displays correctly on any other screen.
export default function ScaleShell({ children }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () =>
      setScale(Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className={styles.viewport}>
      <div
        id="kiosk-canvas"
        className={styles.canvas}
        style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

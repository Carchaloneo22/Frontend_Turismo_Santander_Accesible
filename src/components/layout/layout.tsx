import { Outlet } from 'react-router-dom'
import { GovcoBar } from '../GovcoBar'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { SignPlayer } from '../SignPlayer'
import { AccessibilityPanel } from '../AccessibilityPanel'
import { CookieBanner } from '../../consent'
import { useApplyAccessibility } from '../../../hooks/useApplyAccessibility'
import { useNarrator } from '../../../hooks/useNarrator'
import { useSignLanguage } from '../../../hooks/useSignLanguage'
import styles from './Layout.module.css'

export function Layout() {
  useApplyAccessibility() // aplica contraste + tamaño de fuente al <html>
  useNarrator()
  useSignLanguage() // Lengua de Señas global (hover/focus sobre [data-sign])
  return (
    <div className={styles.layout}>
      <a href="#main" className={styles.skipLink}>
        Saltar al contenido principal
      </a>
      <GovcoBar />
      <header className={styles.header}>
        <Navbar />
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <SignPlayer />
      <AccessibilityPanel />
      <CookieBanner />
    </div>
  )
}

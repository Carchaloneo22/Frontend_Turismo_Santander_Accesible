import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Al cambiar de ruta, vuelve al inicio de la página.
 *
 * En una SPA el navegador NO reinicia el scroll: si vas al pie del Home y abres
 * «Mapa del sitio», la página nueva aparece desplazada abajo. Esto lo corrige.
 *
 * - Respeta los enlaces con ancla (`/ruta#seccion`): ahí no toca el scroll.
 * - Con `prefers-reduced-motion` salta sin animación.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return // el navegador se encarga de ir al ancla
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: suave ? 'smooth' : 'auto' })
  }, [pathname, hash])

  return null
}

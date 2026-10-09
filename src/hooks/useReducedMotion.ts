import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getSnapshot() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/**
 * useReducedMotion — fuente única de verdad para `prefers-reduced-motion`.
 * Reactivo: si el usuario cambia la preferencia del sistema, los componentes
 * suscritos se re-renderizan. Cualquier animación (GSAP, pulsos 3D, autoplay)
 * la consulta con una línea en vez de repetir matchMedia (DRY / SRP).
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

import { useEffect, useRef } from 'react'
import { useAccessibilityStore } from '../store/accessibility.store'
import { speak, stopSpeaking } from '../lib/speak'

// Elementos "leíbles": enlaces, botones, títulos, párrafos, imágenes, o cualquiera con aria-label.
const READABLE = 'a, button, h1, h2, h3, h4, h5, h6, p, li, label, summary, img, [aria-label]'

function readableText(el: Element): string | null {
  const aria = el.getAttribute('aria-label')
  if (aria) return aria.trim() || null
  if (el instanceof HTMLImageElement) return el.alt.trim() || null // imágenes → su alt
  return el.textContent?.trim() || null
}

/** Narrador global: lee el nombre accesible de cualquier elemento al hover/focus. */
export function useNarrator() {
  const narrator = useAccessibilityStore((s) => s.narrator)
  const lastEl = useRef<Element | null>(null)

  useEffect(() => {
    if (!narrator) return

    const handle = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return
      const el = target.closest(READABLE) // sube al elemento leíble más cercano
      if (!el || el === lastEl.current) return // evita repetir el mismo
      lastEl.current = el
      const text = readableText(el)
      if (text) speak(text)
    }

    const onOver = (e: MouseEvent) => handle(e.target)
    const onFocus = (e: FocusEvent) => handle(e.target)

    document.addEventListener('mouseover', onOver)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('focusin', onFocus)
      stopSpeaking()
      lastEl.current = null
    }
  }, [narrator])
}

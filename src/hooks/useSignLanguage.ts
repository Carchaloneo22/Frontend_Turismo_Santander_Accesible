import { useEffect, useRef } from 'react'
import { useSignLanguageStore } from '../store/signLanguage.store'

/** Etiqueta accesible del elemento señalado (para el caption del reproductor). */
function signLabel(el: Element): string | undefined {
  const explicit = el.getAttribute('data-sign-label')
  if (explicit) return explicit.trim() || undefined
  const aria = el.getAttribute('aria-label')
  if (aria) return aria.trim() || undefined
  return el.textContent?.trim() || undefined
}

/** ¿El destino del puntero/foco sigue dentro de una zona "segura" (texto o reproductor)? */
function isSafe(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('[data-sign], [data-sign-player]')
}

/**
 * Lengua de Señas global: al hacer hover/focus sobre CUALQUIER elemento con
 * `data-sign="<url>"` abre el reproductor sobre él; al salir, lo cierra.
 *
 * Mismo patrón que useNarrator (listeners delegados en `document`) → cobertura
 * uniforme en todos los componentes, sin cablear handlers uno por uno.
 *
 * Cumple WCAG 2.2 SC 1.4.13 (Content on Hover or Focus):
 *  - Descartable: se cierra con Escape.
 *  - Sostenible al hover: no se cierra si el puntero pasa al propio reproductor.
 *  - Persistente: pequeño retardo de cierre para cruzar el hueco texto→reproductor.
 */
export function useSignLanguage() {
  const enabled = useSignLanguageStore((s) => s.enabled)
  const play = useSignLanguageStore((s) => s.play)
  const close = useSignLanguageStore((s) => s.close)
  const currentEl = useRef<Element | null>(null)

  useEffect(() => {
    if (!enabled) return

    let closeTimer: ReturnType<typeof setTimeout> | null = null

    const cancelClose = () => {
      if (closeTimer !== null) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
    }
    const scheduleClose = () => {
      if (!currentEl.current) return
      cancelClose()
      closeTimer = setTimeout(() => {
        currentEl.current = null
        close()
      }, 200) // margen para cruzar el hueco texto→reproductor sin parpadeo
    }

    const openFor = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return
      const el = target.closest<HTMLElement>('[data-sign]')
      if (!el) return
      cancelClose()
      if (el === currentEl.current) return // ya abierto para este elemento
      const src = el.getAttribute('data-sign')
      if (!src) return
      currentEl.current = el
      play(src, signLabel(el), el.getBoundingClientRect())
    }

    const onOver = (e: MouseEvent) => {
      // Estar sobre el propio reproductor lo mantiene abierto (SC 1.4.13 hoverable).
      if (e.target instanceof Element && e.target.closest('[data-sign-player]')) {
        cancelClose()
        return
      }
      openFor(e.target)
    }
    const onOut = (e: MouseEvent) => {
      if (isSafe(e.relatedTarget)) return // sigue sobre texto señalado o reproductor
      scheduleClose()
    }
    const onFocusIn = (e: FocusEvent) => openFor(e.target)
    const onFocusOut = (e: FocusEvent) => {
      if (isSafe(e.relatedTarget)) return
      scheduleClose()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentEl.current) {
        cancelClose()
        currentEl.current = null
        close()
      }
    }

    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelClose()
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('keydown', onKeyDown)
      currentEl.current = null
      close()
    }
  }, [enabled, play, close])
}

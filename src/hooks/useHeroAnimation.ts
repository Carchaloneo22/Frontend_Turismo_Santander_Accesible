import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { RefObject } from 'react'

gsap.registerPlugin(SplitText)

/**
 * useHeroAnimation — GSAP encapsulado para el Hero.
 * - Título con efecto MÁQUINA DE ESCRIBIR (SplitText, char por char).
 * - Entrada del resto (eyebrow, subtítulo, CTAs).
 * - Parallax de mouse (profundidad): video opuesto al cursor, contenido lo acompaña.
 * Respeta prefers-reduced-motion. useGSAP limpia solo.
 */
export function useHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const el = scope.current
      if (!el) return
      const q = gsap.utils.selector(el)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Escala base del video → margen para el parallax sin mostrar bordes
      gsap.set(q('[data-hero-el="media"]'), { scale: 1.14 })
      if (reduce) return

      // Máquina de escribir en el título
      const titleEl = q('[data-hero-el="title"]')[0]
      const split = titleEl
        ? new SplitText(titleEl, { type: 'words, chars', wordsClass: 'split-word' })
        : null

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      const eyebrow = q('[data-hero-el="eyebrow"]')
      if (eyebrow.length) tl.from(eyebrow, { y: 20, autoAlpha: 0, duration: 0.6 })
      if (split) {
        // Cada carácter aparece en secuencia → efecto typewriter
        tl.from(split.chars, { autoAlpha: 0, duration: 0.05, stagger: 0.03, ease: 'none' }, '-=0.1')
      }
      const subtitle = q('[data-hero-el="subtitle"]')
      if (subtitle.length) tl.from(subtitle, { y: 20, autoAlpha: 0, duration: 0.7 }, '+=0.15')
      const actions = q('[data-hero-el="actions"]')
      if (actions.length) tl.from(actions, { y: 18, autoAlpha: 0, duration: 0.7 }, '-=0.45')

      // Parallax de mouse (más notorio)
      const media = q('[data-hero-el="media"]')[0]
      const content = q('[data-hero-el="content"]')[0]
      if (!media || !content) return () => split?.revert()

      const mediaX = gsap.quickTo(media, 'x', { duration: 0.9, ease: 'power2.out' })
      const mediaY = gsap.quickTo(media, 'y', { duration: 0.9, ease: 'power2.out' })
      const contentX = gsap.quickTo(content, 'x', { duration: 1.1, ease: 'power2.out' })
      const contentY = gsap.quickTo(content, 'y', { duration: 1.1, ease: 'power2.out' })

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5 // -0.5..0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        mediaX(nx * -60)
        mediaY(ny * -45) // video se mueve opuesto → profundidad
        contentX(nx * 26)
        contentY(ny * 20) // contenido acompaña
      }
      el.addEventListener('mousemove', onMove)

      return () => {
        el.removeEventListener('mousemove', onMove)
        split?.revert() // deshace el split al desmontar
      }
    },
    { scope },
  )
}

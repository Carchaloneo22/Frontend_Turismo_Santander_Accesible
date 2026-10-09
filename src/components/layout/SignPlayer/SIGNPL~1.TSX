import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Text } from '../../ui/Text'
import { Button } from '../../ui/Button'
import { useSignLanguageStore } from '../../../store/signLanguage.store'
import { computePosition } from './computePosition'
import styles from './SignPlayer.module.css'

export function SignPlayer() {
  const activeSrc = useSignLanguageStore((s) => s.activeSrc)
  const activeLabel = useSignLanguageStore((s) => s.activeLabel)
  const anchor = useSignLanguageStore((s) => s.anchor)
  const close = useSignLanguageStore((s) => s.close)

  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<CSSProperties | null>(null)

  // Coloca el reproductor sobre el texto señalado usando su tamaño ya renderizado.
  // useLayoutEffect mide y reposiciona antes del pintado → sin parpadeo.
  useLayoutEffect(() => {
    if (!activeSrc) return
    const el = ref.current
    if (!el) return

    const place = () => {
      if (!anchor) {
        // Sin ancla (p. ej. disparo programático): esquina inferior izquierda.
        setPosition({ bottom: 20, left: 20 })
        return
      }
      const rect = el.getBoundingClientRect()
      const { top, left } = computePosition(
        anchor,
        { width: rect.width, height: rect.height },
        { width: window.innerWidth, height: window.innerHeight },
      )
      setPosition({ top, left })
    }

    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [activeSrc, anchor])

  if (!activeSrc) return null

  const isVideo = /\.(mp4|webm)$/i.test(activeSrc)

  return (
    <div
      ref={ref}
      className={styles.player}
      // Oculto hasta tener la posición medida para evitar un salto visual.
      style={position ?? { visibility: 'hidden' }}
      // Zona segura: el hook no cierra mientras el puntero esté aquí (WCAG 1.4.13).
      data-sign-player=""
      role="dialog"
      aria-label="Reproductor de Lengua de Señas"
    >
      <div className={styles.header}>
        <Text as="span" size="sm" weight="bold" color="#fff">
          Lengua de Señas
        </Text>
        <Button
          variant="ghost"
          size="sm"
          textColor="#fff"
          onClick={close}
          aria-label="Cerrar reproductor"
        >
          ✕
        </Button>
      </div>

      {isVideo ? (
        <video className={styles.video} src={activeSrc} autoPlay loop controls />
      ) : (
        <Text align="center" muted className={styles.placeholder}>
          Video en Lengua de Señas — próximamente
        </Text>
      )}

      {activeLabel && (
        <Text size="sm" muted className={styles.caption}>
          “{activeLabel}”
        </Text>
      )}
    </div>
  )
}

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Icon } from '../../ui/Icon'
import { Text } from '../../ui/Text'
import { Heading } from '../../ui/Heading'
import { useSignLanguageStore } from '../../../store/signLanguage.store'
import { useAccessibilityStore } from '../../../store/accessibility.store'
import type { FontScale } from '../../../store/accessibility.store'
import styles from './AccessibilityPanel.module.css'

const FONT_SCALES: { label: string; value: FontScale }[] = [
  { label: 'A-', value: 0.9 },
  { label: 'A', value: 1 },
  { label: 'A+', value: 1.15 },
  { label: 'A++', value: 1.3 },
]

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Animación de apertura con GSAP: el panel entra desde la esquina (escala +
  // desvanecido) y las filas aparecen escalonadas. Respeta reduce-motion.
  useGSAP(
    () => {
      if (!open || !panelRef.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from(panelRef.current, {
        autoAlpha: 0,
        x: 24,
        scale: 0.96,
        transformOrigin: 'center right',
        duration: 0.3,
        ease: 'power3.out',
      })
      // Cada opción entra por separado, una a una, deslizando desde la derecha.
      gsap.from(panelRef.current.querySelectorAll('[data-a11y-row]'), {
        autoAlpha: 0,
        x: 30,
        stagger: 0.1,
        duration: 0.34,
        ease: 'back.out(1.7)',
        delay: 0.12,
      })
    },
    { dependencies: [open] },
  )

  const signOn = useSignLanguageStore((s) => s.enabled)
  const toggleSign = useSignLanguageStore((s) => s.toggleEnabled)
  const contrast = useAccessibilityStore((s) => s.contrast)
  const toggleContrast = useAccessibilityStore((s) => s.toggleContrast)
  const narrator = useAccessibilityStore((s) => s.narrator)
  const toggleNarrator = useAccessibilityStore((s) => s.toggleNarrator)
  const fontScale = useAccessibilityStore((s) => s.fontScale)
  const setFontScale = useAccessibilityStore((s) => s.setFontScale)

  return (
    <div className={styles.wrap}>
      {open && (
        <div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-label="Opciones de accesibilidad"
        >
          <Heading level={2} size={5} className={styles.title}>
            Accesibilidad
          </Heading>

          <button
            data-a11y-row
            className={styles.row}
            onClick={toggleSign}
            role="switch"
            aria-checked={signOn}
          >
            <Text as="span">Lengua de Señas</Text>
            <span className={`${styles.switch} ${signOn ? styles.on : ''}`} aria-hidden="true" />
          </button>

          <button
            data-a11y-row
            className={styles.row}
            onClick={toggleContrast}
            role="switch"
            aria-checked={contrast}
          >
            <Text as="span">Alto contraste</Text>
            <span className={`${styles.switch} ${contrast ? styles.on : ''}`} aria-hidden="true" />
          </button>
          <button
            data-a11y-row
            className={styles.row}
            onClick={toggleNarrator}
            role="switch"
            aria-checked={narrator}
          >
            <Text as="span">Narrador</Text>
            <span className={`${styles.switch} ${narrator ? styles.on : ''}`} aria-hidden="true" />
          </button>

          <div data-a11y-row className={styles.rowStatic}>
            <Text as="span">Tamaño de texto</Text>
            <div className={styles.fontBtns} role="group" aria-label="Tamaño de texto">
              {FONT_SCALES.map((f) => (
                <button
                  key={f.value}
                  className={`${styles.fontBtn} ${fontScale === f.value ? styles.fontActive : ''}`}
                  onClick={() => setFontScale(f.value)}
                  aria-pressed={fontScale === f.value}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Próximamente: Narrador (Paso B) */}
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setOpen((o) => !o)}
        aria-label="Opciones de accesibilidad"
        aria-expanded={open}
      >
        <Icon name="accessibility" size={26} />
      </button>
    </div>
  )
}

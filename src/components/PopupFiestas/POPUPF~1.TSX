import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from '../ui/Link'
import { sessionStore } from '../../services/storage/StorageService'
import { proximasFiestas, formatearRango } from '../../features/fiestas/fiestas.data'
import styles from './PopupFiestas.module.css'

const CLAVE = 'fiestasPopupCerrado'
const DURACION = 9 // segundos por historia (tiempo para leer y narrar)
const CONFETI = ['#e11d48', '#f59e0b', '#1a6b3c', '#facc15', '#db2777', '#0891b2']

function diasHasta(desdeIso: string): number {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const [y, m, d] = desdeIso.split('-').map(Number)
  return Math.max(0, Math.ceil((new Date(y, m - 1, d).getTime() - hoy.getTime()) / 86_400_000))
}

/**
 * Popup de "Próximas fiestas en Santander" tipo STORIES: varias ferias en un
 * carrusel con barras de progreso que auto-avanzan (~6 s), navegación con
 * flechas/teclado, pausa, y cierre (botón, Escape, clic fuera). Solo en el Home,
 * una vez por sesión.
 *
 * Accesibilidad: `role="dialog"` + `aria-modal`; el carrusel se anuncia con
 * `aria-roledescription="carrusel"`, cada historia dice "X de N" y hay una región
 * `aria-live` que anuncia el cambio. Con `prefers-reduced-motion` NO auto-avanza
 * (WCAG 2.2.2): el usuario navega a su ritmo con las flechas.
 */
export function PopupFiestas() {
  const [lista] = useState(proximasFiestas)
  const [idx, setIdx] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [visible, setVisible] = useState(false)
  const total = lista.length

  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const cerrarRef = useRef<HTMLButtonElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const cerrar = useCallback(() => {
    setVisible(false)
    sessionStore.set(CLAVE, true)
  }, [])

  // Auto-avance en BUCLE: al llegar al final vuelve al inicio (no se cierra solo).
  const avanzar = useCallback(() => {
    setIdx((i) => (i + 1 >= total ? 0 : i + 1))
  }, [total])

  const retroceder = useCallback(() => setIdx((i) => (i - 1 < 0 ? total - 1 : i - 1)), [total])

  // Mostrar al montar (Home), una vez por sesión.
  useEffect(() => {
    if (total === 0) return
    if (sessionStore.get<boolean>(CLAVE, false)) return
    const t = setTimeout(() => setVisible(true), 700)
    return () => clearTimeout(t)
  }, [total])

  // Teclado: flechas navegan, Escape cierra, espacio pausa.
  useEffect(() => {
    if (!visible) return
    cerrarRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      else if (e.key === 'ArrowRight') avanzar()
      else if (e.key === 'ArrowLeft') retroceder()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, cerrar, avanzar, retroceder])

  // Entrada del modal (una vez).
  useGSAP(
    () => {
      if (!visible || !cardRef.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from(overlayRef.current, { autoAlpha: 0, duration: 0.25 })
      gsap.from(cardRef.current, {
        autoAlpha: 0,
        y: 48,
        scale: 0.9,
        duration: 0.5,
        ease: 'back.out(1.5)',
      })
    },
    { dependencies: [visible] },
  )

  // Barras de progreso + auto-avance de la historia activa.
  useGSAP(
    () => {
      if (!visible || !cardRef.current) return
      const bars = cardRef.current.querySelectorAll<HTMLElement>('[data-bar]')
      bars.forEach((el, i) => gsap.set(el, { scaleX: i < idx ? 1 : 0 }))
      const active = bars[idx]
      if (!active) return
      // Animación de contenido al cambiar de historia.
      gsap.from(cardRef.current.querySelectorAll('[data-story]'), {
        autoAlpha: 0,
        y: 14,
        stagger: 0.06,
        duration: 0.4,
        ease: 'power2.out',
      })
      // reduce-motion: sin auto-avance; la barra activa queda llena.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(active, { scaleX: 1 })
        return
      }
      const t = gsap.fromTo(
        active,
        { scaleX: 0 },
        { scaleX: 1, duration: DURACION, ease: 'none', onComplete: avanzar },
      )
      tweenRef.current = t
      if (pausado) t.pause()
      return () => t.kill()
    },
    { dependencies: [visible, idx] },
  )

  // Pausa/reanuda sin reiniciar la barra.
  useEffect(() => {
    const t = tweenRef.current
    if (!t) return
    if (pausado) t.pause()
    else t.resume()
  }, [pausado])

  if (!visible || total === 0) return null
  const f = lista[idx]
  const dias = diasHasta(f.desde)

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={cerrar}>
      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-roledescription="carrusel de próximas fiestas"
        aria-labelledby="fiesta-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen a pantalla completa + máscara difuminada para el texto */}
        <img src={f.imagen} alt="" className={styles.imagen} />
        <div className={styles.mask} />

        <div className={styles.confeti} aria-hidden="true">
          {CONFETI.map((c, i) => (
            <span
              key={i}
              className={styles.pieza}
              style={{
                background: c,
                left: `${8 + i * 15}%`,
                top: `${10 + (i % 3) * 14}%`,
                transform: `rotate(${i * 40}deg)`,
              }}
            />
          ))}
        </div>

        {/* Barras de progreso */}
        <div className={styles.barras} aria-hidden="true">
          {lista.map((it) => (
            <span key={it.id} className={styles.barTrack}>
              <span data-bar className={styles.barFill} style={{ transformOrigin: 'left' }} />
            </span>
          ))}
        </div>

        <div className={styles.topBtns}>
          <button
            className={styles.iconBtn}
            onClick={() => setPausado((p) => !p)}
            aria-label={pausado ? 'Reanudar' : 'Pausar'}
          >
            {pausado ? '▶' : '❚❚'}
          </button>
          <button
            ref={cerrarRef}
            className={styles.iconBtn}
            onClick={cerrar}
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>

        <p className={styles.srOnly} aria-live="polite">
          Fiesta {idx + 1} de {total}: {f.nombre}, en {f.municipio}.{' '}
          {formatearRango(f.desde, f.hasta)}.
        </p>

        <span data-story className={styles.eyebrow} aria-label="Próximas fiestas en Santander">
          <span aria-hidden="true">🎉</span> Próximas fiestas en Santander
        </span>

        {/* Contenido sobre la máscara */}
        <div className={styles.contenido}>
          <span data-story className={styles.municipio} aria-label={`Municipio: ${f.municipio}`}>
            {f.municipio}
          </span>
          <h2 data-story id="fiesta-titulo" className={styles.titulo}>
            {f.nombre}
          </h2>
          <div data-story className={styles.meta}>
            <span
              className={styles.chipFecha}
              aria-label={`Fechas: ${formatearRango(f.desde, f.hasta)}`}
            >
              <span aria-hidden="true">📅</span> {formatearRango(f.desde, f.hasta)}
            </span>
            {dias > 0 && (
              <span
                className={styles.chipDias}
                aria-label={`Faltan ${dias} ${dias === 1 ? 'día' : 'días'}`}
              >
                Faltan <strong>{dias}</strong> {dias === 1 ? 'día' : 'días'}
              </span>
            )}
          </div>
          <p data-story className={styles.desc}>
            {f.descripcion}
          </p>
          <div data-story className={styles.acciones}>
            {f.enlace && (
              <Link to={f.enlace} className={styles.btn} onClick={cerrar}>
                Ver más
              </Link>
            )}
            <button type="button" className={styles.btnGhost} onClick={cerrar}>
              Ahora no
            </button>
          </div>
        </div>

        {/* Navegación (en bucle: siempre disponibles) */}
        <button
          className={`${styles.nav} ${styles.navPrev}`}
          onClick={retroceder}
          aria-label="Fiesta anterior"
        >
          ‹
        </button>
        <button
          className={`${styles.nav} ${styles.navNext}`}
          onClick={avanzar}
          aria-label="Siguiente fiesta"
        >
          ›
        </button>
      </div>
    </div>
  )
}

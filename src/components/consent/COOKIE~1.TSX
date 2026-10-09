import { useEffect, useState } from 'react'
import { Link } from '../ui/Link'
import { useConsentStore } from '../../store/consent.store'
import styles from './CookieBanner.module.css'

/**
 * Banner de consentimiento de cookies / tecnologías similares (Ley 1581 + guías GD).
 *
 * - Se muestra hasta que el titular decide; también puede reabrirse desde el footer
 *   ("Configurar cookies") para CAMBIAR o REVOCAR.
 * - Opt-in real: las categorías opcionales arrancan DESACTIVADAS.
 * - Accesible: `role="dialog"`, `aria-modal`, foco inicial y cierre con Escape en
 *   el panel de configuración.
 */
/**
 * Panel de configuración por categorías. Es un componente aparte para que su
 * estado de toggles nazca de las props al MONTARSE (sin efectos de sincronía):
 * cada vez que se abre, React lo remonta con los valores ya consentidos.
 */
function ConfigPanel({
  mapas,
  experiencias,
  decidido,
  onGuardar,
  onCancelar,
}: {
  mapas: boolean
  experiencias: boolean
  decidido: boolean
  onGuardar: (config: { mapas: boolean; experiencias: boolean }) => void
  onCancelar: () => void
}) {
  const [cfgMapas, setCfgMapas] = useState(mapas)
  const [cfgExp, setCfgExp] = useState(experiencias)

  // Escape cierra el panel (solo si ya había una decisión previa).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && decidido) onCancelar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [decidido, onCancelar])

  return (
    <div className={styles.overlay}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-cfg-titulo"
      >
        <h2 id="cookie-cfg-titulo" className={styles.titulo}>
          Configuración de cookies
        </h2>
        <p className={styles.texto}>
          Elige qué tecnologías permites. Puedes cambiarlo o revocarlo cuando quieras. Más detalle
          en la{' '}
          <Link to="/politica-de-cookies" className={styles.enlace}>
            Política de Cookies
          </Link>
          .
        </p>

        <ul className={styles.categorias}>
          <li className={styles.categoria}>
            <div className={styles.catInfo}>
              <strong>Estrictamente necesarias</strong>
              <span className={styles.catDesc}>
                Sesión, seguridad y preferencias (tema, accesibilidad, lengua de señas). No se
                pueden desactivar.
              </span>
            </div>
            <span className={styles.siempre} aria-label="Siempre activas">
              Siempre activas
            </span>
          </li>

          <li className={styles.categoria}>
            <label className={styles.catLabel}>
              <div className={styles.catInfo}>
                <strong>Mapas interactivos</strong>
                <span className={styles.catDesc}>
                  Cargan mapas desde proveedores externos (Esri, Carto), que reciben tu dirección
                  IP.
                </span>
              </div>
              <input
                type="checkbox"
                checked={cfgMapas}
                onChange={(e) => setCfgMapas(e.target.checked)}
              />
            </label>
          </li>

          <li className={styles.categoria}>
            <label className={styles.catLabel}>
              <div className={styles.catInfo}>
                <strong>Experiencias 360° / VR</strong>
                <span className={styles.catDesc}>
                  Cargan contenido inmersivo desde CDN de terceros (A-Frame).
                </span>
              </div>
              <input
                type="checkbox"
                checked={cfgExp}
                onChange={(e) => setCfgExp(e.target.checked)}
              />
            </label>
          </li>
        </ul>

        <div className={styles.acciones}>
          {decidido && (
            <button type="button" className={styles.btnGhost} onClick={onCancelar}>
              Cancelar
            </button>
          )}
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => onGuardar({ mapas: cfgMapas, experiencias: cfgExp })}
          >
            Guardar preferencias
          </button>
        </div>
      </div>
    </div>
  )
}

export function CookieBanner() {
  const decidido = useConsentStore((s) => s.decidido)
  const panelAbierto = useConsentStore((s) => s.panelAbierto)
  const mapas = useConsentStore((s) => s.mapas)
  const experiencias = useConsentStore((s) => s.experiencias)
  const aceptarTodo = useConsentStore((s) => s.aceptarTodo)
  const soloNecesarias = useConsentStore((s) => s.soloNecesarias)
  const guardar = useConsentStore((s) => s.guardar)
  const reabrir = useConsentStore((s) => s.reabrir)
  const cerrarPanel = useConsentStore((s) => s.cerrarPanel)

  // ── Panel de configuración por categorías ──
  if (panelAbierto) {
    return (
      <ConfigPanel
        mapas={mapas}
        experiencias={experiencias}
        decidido={decidido}
        onGuardar={guardar}
        onCancelar={cerrarPanel}
      />
    )
  }

  // Si ya decidió y el panel está cerrado, no se muestra nada.
  if (decidido) return null

  // ── Banner inicial ──
  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className={styles.bannerTexto}>
        <strong>Usamos cookies y tecnologías similares.</strong> Solo las estrictamente necesarias
        están activas por defecto. Puedes aceptar las opcionales (mapas y experiencias 360°),
        rechazarlas o configurarlas. Consulta la{' '}
        <Link to="/politica-de-cookies" className={styles.enlace}>
          Política de Cookies
        </Link>{' '}
        y la{' '}
        <Link to="/politica-de-datos" className={styles.enlace}>
          Política de Tratamiento de Datos
        </Link>
        .
      </div>
      <div className={styles.bannerAcciones}>
        <button type="button" className={styles.btnGhost} onClick={reabrir}>
          Configurar
        </button>
        <button type="button" className={styles.btnGhost} onClick={soloNecesarias}>
          Solo necesarias
        </button>
        <button type="button" className={styles.btnPrimary} onClick={aceptarTodo}>
          Aceptar todas
        </button>
      </div>
    </div>
  )
}

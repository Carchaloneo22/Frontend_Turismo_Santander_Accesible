import type { ReactNode } from 'react'
import { Link } from '../ui/Link'
import { useConsentStore, type CategoriaOpcional } from '../../store/consent.store'
import styles from './ConsentGate.module.css'

/**
 * Puerta de consentimiento: solo renderiza `children` si el titular aceptó la
 * categoría. Si no, muestra un aviso con un botón para activarla. Se usa para
 * envolver contenido que carga terceros (p. ej. la experiencia 360°/VR).
 */
export function ConsentGate({
  categoria,
  titulo,
  descripcion,
  children,
}: {
  categoria: CategoriaOpcional
  titulo: string
  descripcion: string
  children: ReactNode
}) {
  const permitido = useConsentStore((s) => s[categoria])
  const activar = useConsentStore((s) => s.activarCategoria)

  if (permitido) return <>{children}</>

  return (
    <div className={styles.gate} role="note">
      <div className={styles.box}>
        <h1 className={styles.titulo}>{titulo}</h1>
        <p className={styles.desc}>{descripcion}</p>
        <div className={styles.acciones}>
          <button type="button" className={styles.btn} onClick={() => activar(categoria)}>
            Activar y continuar
          </button>
          <Link to="/" className={styles.volver}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

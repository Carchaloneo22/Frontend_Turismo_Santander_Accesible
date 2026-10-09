import styles from './GovcoBar.module.css'

/**
 * Barra superior GOV.CO — presente en todas las vistas (requisito de integración
 * al Portal Único del Estado para sedes y componentes vinculados). El logotipo
 * enlaza a https://www.gov.co.
 *
 * NOTA: el wordmark "GOV.CO" en texto es un marcador de posición; debe
 * reemplazarse por el **logo oficial SVG del Kit UI GOV.CO** cuando la
 * Gobernación lo provea.
 */
export function GovcoBar() {
  return (
    <div className={styles.bar}>
      <a
        href="https://www.gov.co"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.logo}
        aria-label="Ir al Portal Único del Estado Colombiano, GOV.CO (se abre en una pestaña nueva)"
      >
        <span className={styles.gov}>GOV</span>
        <span className={styles.co}>.CO</span>
      </a>
    </div>
  )
}

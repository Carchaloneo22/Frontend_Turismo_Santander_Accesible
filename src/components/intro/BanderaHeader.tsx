import styles from './Intro.module.css'

interface BanderaHeaderProps {
  src?: string
  alt?: string
}

/**
 * Componente institucional parametrizado.
 * Mantiene la bandera responsiva y sanitizada con atributos de carga prioritaria.
 */
export function BanderaHeader({
  src = '/img/Intro/introsplashgobernacion.webp',
  alt = 'Cabecera Oficial Gobernación de Santander',
}: BanderaHeaderProps) {
  return (
    <header className={styles.banderaWrapper} aria-label="Encabezado institucional">
      <img
        src={src}
        alt={alt}
        className={styles.banderaImg}
        loading="eager" // Carga inmediata sin delay
        // @ts-expect-compliance: Prioridad de carga alta para rendimiento rápido
        fetchPriority="high"
        decoding="async"
      />
    </header>
  )
}

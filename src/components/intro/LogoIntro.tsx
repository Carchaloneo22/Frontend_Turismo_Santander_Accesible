import styles from './Intro.module.css'

interface LogoIntroProps {
  src?: string
  alt?: string
}

/**
 * Componente parametrizado para el logo central de la Gobernación.
 */
export function LogoIntro({
  src = '/img/Intro/LogoGobernacion.webp',
  alt = 'Logo Gobernación de Santander',
}: LogoIntroProps) {
  return (
    <div className={styles.logoWrapper}>
      <img src={src} alt={alt} className={styles.logoImg} />
    </div>
  )
}

import { Hero } from '../../components/sections/Hero/Hero'
import { useSEO } from '../../hooks/useSEO'
import { asset } from '../../lib/asset'
import { SubirFoto } from '../../components/sections/SubirFoto'
import { ExploraModalidades } from '../../components/sections/ExploraModalidades'
import { MapaSantander } from '../../components/sections/MapaSantander'
import { Testimonios } from '../../components/sections/Testimonios'
import { PopupFiestas } from '../../components/PopupFiestas'
import { Text } from '../../components/ui/Text'
import styles from './HomePage.module.css'

export function HomePage() {
  useSEO({
    title: 'Turismo Accesible en Santander',
    description:
      'Conectamos viajeros con empresas turísticas que garantizan accesibilidad real en Santander, Colombia. Transporte, hospedaje y planes inclusivos.',
    path: '/',
  })

  return (
    <>
      <Hero
        variant="home"
        eyebrow="Turismo accesible en Santander"
        title={
          <>
            Turismo Inclusivo,
            <br />
            Ojos, Oídos y<br />
            Pasos Libres
          </>
        }
        subtitle="Conectamos a las empresas turísticas de Santander con viajeros que necesitan experiencias accesibles e inclusivas."
        videoSrc={asset('/video/hero-real.mp4')}
        poster={asset('/video/hero-poster.webp')}
        ctaLabel="Explorar experiencias"
        ctaTo="/planes-turisticos"
        secondaryLabel="Ver hospedajes"
        secondaryTo="/hospedaje"
      />

      {/* Catálogo principal organizado por modalidad de turismo (ERS RF-01). */}
      <ExploraModalidades />

      {/* Mapa de Santander: sitios turísticos y lugares de interés. */}
      <MapaSantander />

      {/* Reseñas de viajeros (placeholder en modo presentación). */}
      <Testimonios />

      {/* Acceso de las casas de cultura. */}
      <section className={styles.casas}>
        <Text size="sm" muted>
          ¿Eres de una casa de cultura?
        </Text>
        <SubirFoto />
      </section>

      {/* Popup de próximas fiestas — solo en el Home, una vez por sesión. */}
      <PopupFiestas />
    </>
  )
}

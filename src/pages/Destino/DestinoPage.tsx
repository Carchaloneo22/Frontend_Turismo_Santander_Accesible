import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Hero } from '../../components/sections/Hero/Hero'
import { MapaSitiosSection } from '../../components/sections/MapaSitiosSection'
import { Container } from '../../components/ui/Container'
import { Heading } from '../../components/ui/Heading'
import { Text } from '../../components/ui/Text'
import { Link } from '../../components/ui/Link'
import { Loader } from '../../components/ui/Loader'
import { aDestino, type SitioConDestino } from '../../features/destinos'
import { destinosService } from '../../services'
import { useSEO } from '../../hooks/useSEO'
import { useRecurso } from '../../hooks/useRecurso'
import { useAssetPreloader } from '../../hooks/useAssetPreloader'
import type { Asset } from '../../lib/preload'
import styles from './DestinoPage.module.css'

/**
 * DestinoPage — la página de un municipio (p. ej. Bucaramanga).
 *
 * Los datos vienen del BACKEND (destinos/detalle.php, cacheado en Redis), no ya
 * del catálogo estático que viajaba dentro del bundle. Antes, publicar un
 * municipio obligaba a recompilar y volver a desplegar el frontend; ahora es una
 * fila. Por eso Floridablanca y Piedecuesta, que llevaban meses escritos en el
 * .ts sin poder verse, ya salen.
 *
 * El mapa muestra los sitios DE ESTE municipio. Antes pintaba los de todo el
 * departamento en la página de cada uno, así que en Bucaramanga aparecían los
 * parques de Barichara. El endpoint devuelve solo los suyos, y es lo coherente
 * con lo que el título promete.
 */
export function DestinoPage() {
  const { slug } = useParams<{ slug: string }>()

  // useCallback: useRecurso lo tiene por dependencia del efecto. Sin memorizar,
  // sería una función nueva en cada render y la petición se repetiría sin fin.
  const cargar = useCallback(() => destinosService.detalle(slug ?? ''), [slug])
  const { dato, cargando, error } = useRecurso(cargar, 'No se pudo cargar el destino.')

  const destino = useMemo(() => (dato ? aDestino(dato) : null), [dato])

  useSEO({
    title: destino ? destino.nombre : 'Destino',
    description: destino?.descripcion,
    path: `/destinos/${slug ?? ''}`,
    type: 'article',
  })

  // Hero + la imagen de cada sitio, para que no se vean aparecer una a una.
  const assets = useMemo<Asset[]>(() => {
    if (!destino) return []
    return [
      { url: destino.heroPoster ?? destino.heroMedia, type: 'image' },
      ...destino.sitios.map((s) => ({ url: s.imagen, type: 'image' as const })),
    ]
  }, [destino])

  const { ready, progress } = useAssetPreloader(assets)

  // El mapa quiere cada sitio con su municipio. Aquí todos son del mismo.
  const sitios = useMemo<SitioConDestino[]>(
    () => (destino ? destino.sitios.map((sitio) => ({ sitio, destino })) : []),
    [destino],
  )

  if (cargando) {
    return <Loader label="Cargando destino" />
  }

  if (error || !destino) {
    return (
      <Container maxWidth={720} className={styles.notFound}>
        <Heading level={1} size={2}>
          Destino no encontrado
        </Heading>
        {/* El mensaje del backend distingue "no está publicado" de "se cayó la
            API". Son cosas distintas para quien lo lee: una es definitiva y la
            otra se arregla reintentando. */}
        <Text muted>{error ?? 'El destino que buscas no existe o aún no está disponible.'}</Text>
        <Link to="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </Container>
    )
  }

  return (
    <>
      {!ready && <Loader progress={progress} label={`Cargando ${destino.nombre}`} />}

      <Hero
        variant="page"
        eyebrow="Destino en Santander"
        title={destino.titular}
        subtitle={destino.descripcion}
        poster={destino.heroPoster ?? destino.heroMedia}
        ctaLabel="Explorar en realidad virtual"
        ctaTo={`/metaverso/${destino.slug}`}
        secondaryLabel="Volver al inicio"
        secondaryTo="/"
      />

      <Container as="section" maxWidth={860} className={styles.intro}>
        <Heading level={2} size={3}>
          Sobre {destino.nombre}
        </Heading>
        <Text size="lg">{destino.descripcion}</Text>
      </Container>

      {/* Un municipio puede estar publicado sin sitios cargados todavía (es el
          caso de Socorro, Vélez y Los Santos). Se dice, en vez de enseñar un
          mapa vacío que parece roto. */}
      {sitios.length > 0 ? (
        <MapaSitiosSection sitios={sitios} />
      ) : (
        <Container as="section" maxWidth={860} className={styles.intro}>
          <Text muted>
            Todavía no hay sitios cargados para {destino.nombre}. Las casas de cultura del municipio
            están fotografiándolos.
          </Text>
        </Container>
      )}
    </>
  )
}

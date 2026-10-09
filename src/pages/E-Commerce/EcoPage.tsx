import { useCallback } from 'react'
import { CatalogoPage } from '../../components/sections/CatalogoPage'
import type { CardProps } from '../../components/ui/Card'
import { useListado } from '../../hooks/useListado'
import { ecommerceService, type Producto } from '../../services'
import { imagenUrl } from '../../lib/gcs'
import { precio } from '../../lib/formato'

const BANNER = 'https://picsum.photos/seed/banner-artesanias/1600/600'

function productoToCard(p: Producto): CardProps {
  return {
    image: imagenUrl(p.img_url),
    imageAlt: `Artesanía: ${p.nombre}`,
    // Sin stock la tarjeta lo dice en el badge: enterarse al pagar es peor.
    badge: p.stock > 0 ? precio(p.precio) : 'Agotado',
    title: p.nombre,
    description:
      p.descripcion ?? [p.artesano, p.ciudad].filter(Boolean).join(' · ') ?? p.categoria ?? '',
  }
}

export function EcoPage() {
  const cargar = useCallback(() => ecommerceService.listar(), [])
  const { datos, cargando, error } = useListado<Producto>(
    cargar,
    'No pudimos cargar las artesanías. Inténtalo de nuevo en un momento.',
  )

  return (
    <CatalogoPage
      seo={{
        title: 'Artesanías de Santander — Santander Accesible',
        description:
          'Productos artesanales hechos en Santander, comprados directamente a sus artesanos.',
      }}
      hero={{
        eyebrow: 'Artesanías',
        title: 'Llévate Santander a casa',
        subtitle:
          'Piezas hechas a mano por artesanos de la región, compradas directamente a quien las hizo.',
        banner: BANNER,
      }}
      grid={{
        title: 'Productos disponibles',
        subtitle: 'Cada pieza indica su artesano, su origen y su precio.',
        loadingLabel: 'Cargando artesanías…',
        emptyLabel: 'Todavía no hay artesanías publicadas. Vuelve pronto.',
      }}
      items={datos.map(productoToCard)}
      cargando={cargando}
      error={error}
      etiquetaCarga="Cargando artesanías"
    />
  )
}

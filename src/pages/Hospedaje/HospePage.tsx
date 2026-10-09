import { useCallback } from 'react'
import { CatalogoPage } from '../../components/sections/CatalogoPage'
import type { CardProps } from '../../components/ui/Card'
import { useListado } from '../../hooks/useListado'
import { hospedajeService, type Hospedaje } from '../../services'
import { imagenUrl } from '../../lib/gcs'
import { precio } from '../../lib/formato'

const BANNER = 'https://picsum.photos/seed/banner-hospedaje/1600/600'

function hospedajeToCard(h: Hospedaje): CardProps {
  return {
    image: imagenUrl(h.img_url),
    imageAlt: `Hospedaje: ${h.nombre}`,
    badge: `${precio(h.precio_noche)} por noche`,
    title: h.nombre,
    // La accesibilidad va PRIMERO: es el motivo por el que existe la plataforma,
    // no una nota al pie. Sin ella, al menos el tipo y la ciudad.
    description: h.accesibilidad || h.descripcion || `${h.tipo} en ${h.ciudad}`,
  }
}

export function HospePage() {
  const cargar = useCallback(() => hospedajeService.listarPublico(), [])
  const { datos, cargando, error } = useListado<Hospedaje>(
    cargar,
    'No pudimos cargar los hospedajes. Inténtalo de nuevo en un momento.',
  )

  return (
    <CatalogoPage
      seo={{
        title: 'Hospedaje accesible en Santander — Santander Accesible',
        description:
          'Alojamientos en Santander con accesibilidad verificada: habitaciones adaptadas, rampas y personal capacitado.',
      }}
      hero={{
        eyebrow: 'Hospedaje',
        title: 'Dormir tranquilo también es accesibilidad',
        subtitle:
          'Alojamientos que declaran qué tienen adaptado, para que nadie llegue a averiguarlo en la recepción.',
        banner: BANNER,
      }}
      grid={{
        title: 'Alojamientos disponibles',
        subtitle: 'Cada ficha indica su accesibilidad, capacidad y precio por noche.',
        loadingLabel: 'Cargando hospedajes…',
        emptyLabel: 'Todavía no hay hospedajes publicados. Vuelve pronto.',
      }}
      items={datos.map(hospedajeToCard)}
      cargando={cargando}
      error={error}
      etiquetaCarga="Cargando hospedajes"
    />
  )
}

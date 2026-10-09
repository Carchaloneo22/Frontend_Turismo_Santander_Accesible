import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

const SITE_NAME = 'Santander Accesible'
// El dominio se toma de la variable de entorno para no fijarlo en código: en
// producción se define VITE_SITE_URL con el dominio oficial. El valor por
// defecto es un PLACEHOLDER — reemplázalo al configurar el dominio real.
const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://santander-accesible.co'
const DEFAULT_DESC =
  'Plataforma de turismo inclusivo en Santander, Colombia. Experiencias accesibles para todos.'
const DEFAULT_IMAGE = `${BASE_URL}/img/og-cover.webp`

/**
 * Hook que actualiza dinámicamente el <title> y las meta tags de SEO/OG
 * para cada página. En una SPA esto es esencial para compartir en redes
 * y para crawlers que ejecutan JS (Google, Bing).
 */
export function useSEO({ title, description, path = '/', image, type = 'website' }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`
    const desc = description || DEFAULT_DESC
    const url = `${BASE_URL}${path}`
    const img = image || DEFAULT_IMAGE

    // Title
    document.title = fullTitle

    // Meta tags helper
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Standard
    setMeta('name', 'description', desc)

    // Open Graph
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:type', type)

    // Twitter
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, path, image, type])
}

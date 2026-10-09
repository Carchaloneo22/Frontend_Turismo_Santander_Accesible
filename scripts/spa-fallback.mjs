import { copyFile } from 'node:fs/promises'

/**
 * Copia dist/index.html → dist/404.html.
 *
 * GitHub Pages no sabe hacer el fallback de una SPA: para cualquier ruta que no
 * sea un archivo real busca 404.html. Si ese 404.html ES la app, React Router
 * lee la URL y pinta la página correcta, así que recargar en /metaverso/giron o
 * entrar por un enlace directo funciona.
 *
 * El `public/_redirects` que ya existe NO sirve aquí: es la convención de
 * Netlify/Cloudflare y GitHub Pages lo ignora por completo. Se conserva para que
 * el mismo build siga funcionando en esos hostings.
 *
 * Único matiz: Pages devuelve la página con estado HTTP 404 aunque se vea bien.
 * Para una demo da igual; con dominio propio conviene un hosting con rewrites
 * de verdad (el propio VPS con Nginx, por ejemplo).
 */
await copyFile('dist/index.html', 'dist/404.html')
console.log('✓ dist/404.html generado (fallback de SPA para GitHub Pages)')

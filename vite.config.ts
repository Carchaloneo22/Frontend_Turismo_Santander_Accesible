import { defineConfig } from 'vitest/config'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import basicSsl from '@vitejs/plugin-basic-ssl'

/**
 * `base` — prefijo de las URLs de los assets del build.
 *
 * En un dominio propio (Cloudflare Pages con nuestro subdominio) el sitio cuelga
 * de la RAÍZ, así que `base` es '/' y no hay que tocar nada. Se deja
 * configurable por variable de entorno solo por si algún día se sirve bajo una
 * subruta (p. ej. /<repo>/ en un hosting de proyecto), donde habría que pasar
 * BASE_PATH=/subruta/.
 *
 *   npm run build                    → raíz '/' (Cloudflare Pages, dominio propio)
 *   BASE_PATH=/subruta/ npm run build → solo si el sitio cuelga de una subruta
 */
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    basicSsl(), // HTTPS (contexto seguro) requerido por WebXR en el Quest
  ],
  server: {
    host: true, // expone en la red local para abrir la app desde el Quest
    port: 5174,
    strictPort: true, // si 5174 está ocupado, falla en vez de saltar a otro puerto
    proxy: {
      // Backend base NestJS (prefijo /api). Se reenvía a localhost:3004 y el
      // navegador lo ve same-origin (sin CORS). Configurable con BACKEND_URL.
      '/api': {
        target: process.env.BACKEND_URL ?? 'http://localhost:3004',
        changeOrigin: true,
      },
      // Compatibilidad heredada: el antiguo backend PHP (localhost:8000).
      '/php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})

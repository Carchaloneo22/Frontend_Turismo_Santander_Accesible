# Santander Accesible — Frontend

Plataforma turística y de metaverso inclusivo del departamento de Santander.
Interfaz web en **React + TypeScript + Vite**, con módulo de metaverso/VR
(WebXR + Three.js) y accesibilidad como eje transversal (WCAG 2.2).

## Requisitos

- Node.js 20+ y npm.

## Puesta en marcha

```bash
npm install
cp .env.example .env      # ajusta las variables si hace falta
npm run dev               # servidor de desarrollo (Vite)
```

## Variables de entorno

Ver [`.env.example`](./.env.example). Las principales:

| Variable | Para qué |
|---|---|
| `VITE_API_BASE_URL` | URL del backend. Vacío en desarrollo (el proxy de Vite lo resuelve). |
| `VITE_SITE_URL` | Dominio oficial del sitio, para SEO/OpenGraph. **Placeholder por defecto — reemplazar al configurar el dominio.** |
| `VITE_APP_ENV` | Entorno (`development` / `production`). |

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR. |
| `npm run build` | Compilación de producción (typecheck + Vite build). |
| `npm run lint` | ESLint. |
| `npm run preview` | Sirve la compilación de producción localmente. |

## Modelo de ramas

| Rama | Rol |
|---|---|
| `main` | **Producción** (post-QA). Protegida: solo entra por PR aprobado y con checks en verde. |
| `release/development` | **Desarrollo** con dominio propio. Rama de integración; de aquí salen las promociones a `main`. |
| `feature/*`, `fix/*` | Trabajo del día a día. Se abren desde `release/development` y vuelven a ella por PR. |

Flujo: `feature/*` → PR → `release/development` → (QA) → PR → `main`.

## Estructura

```
src/
├─ components/   # ui, layout y secciones reutilizables
├─ pages/        # una carpeta por página (Home, Destino, Metaverso, …)
├─ features/     # dominios (destinos, …) con su modelo y repositorio
├─ services/     # cliente HTTP tipado por dominio
├─ hooks/        # hooks reutilizables (SEO, precarga, …)
└─ lib/          # utilidades (formato, assets, gcs, preload)
```

## Nota sobre el logo

El logotipo (`src/assets/logo.webp`) es provisional. Para reemplazarlo por el
oficial: deja el nuevo original en `src/assets/logo-original.png` y ejecuta
`node scripts/optimize-logo.mjs`, que regenera `logo.webp` optimizado.

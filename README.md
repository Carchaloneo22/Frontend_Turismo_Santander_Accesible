

# 🏔️ Santander Turismo Accesible e Imersiva

Un portal web interactivo e innovador diseñado para promocionar el turismo en la región de Santander, Colombia. Este proyecto integra una amplia plataforma de planes turísticos con un entorno virtual inmersivo (metaverso) centrado en Bucaramanga.

---

## 🚀 Enlaces del Proyecto servidores de prueba inicial

- **Planes Turísticos:** [dev.turismo-santander.desarrollos-pablo-carvajal.com/planes-turisticos](https://dev.turismo-santander.desarrollos-pablo-carvajal.com/planes-turisticos)
- **Metaverso Bucaramanga:** [dev.turismo-santander.desarrollos-pablo-carvajal.com/metaverso/bucaramanga](https://dev.turismo-santander.desarrollos-pablo-carvajal.com/metaverso/bucaramanga)

---

## 📌 Visión General del Proyecto

Esta plataforma fue desarrollada con el objetivo de impulsar y visibilizar la oferta turística, cultural y gastronómica del departamento de Santander. Permite a los usuarios tanto explorar y planificar sus viajes de forma convencional como vivenciar los destinos turísticos de manera virtual e interactiva.

---

## 🗺️ Módulos Principales

### 1. Planes Turísticos (`/planes-turisticos`)
Módulo dedicado a la exploración y reserva/consulta de experiencias y actividades turísticas en la región:
- **Catálogo de Experiencias:** Deportes de aventura (canotaje, parapente, ecorrutas), rutas gastronómicas y turismo cultural.
- **Filtros Dinámicos:** Búsqueda según ubicación (San Gil, Barichara, Bucaramanga, Chicamocha, entre otros), tipo de actividad o presupuesto.
- **Detalle del Plan:** Incluye itinerarios, recomendaciones, duración y mapa interactivo.

### 2. Metaverso de Bucaramanga (`/metaverso/bucaramanga`)
Una experiencia inmersiva basada en WebGL / 3D que permite recorrer la "Ciudad Bonita" de forma virtual:
- **Entorno 3D Interactivo:** Navegación en tiempo real por escenarios y sitios emblemáticos de la ciudad.
- **Puntos de Interés (Hotspots):** Información multimedia desplegable sobre parques, monumentos y oferta local.
- **Inmersión Digital:** Herramienta interactiva para que turistas potenciales descubran Bucaramanga antes de su viaje físico.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React / Vue.js (Next.js / Nuxt.js) o JavaScript Moderno (ES6+)
- **Estilos:** Tailwind CSS / CSS Modules
- **Motor 3D / Metaverso:** Three.js / Babylon.js / A-Frame (WebGL)
- **Optimización Multimedia:** Formatos de última generación (`.webp`, `.mp4` progresivo) para alto rendimiento de carga.

---

## 📦 Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/turismo-santander.git
   cd turismo-santander
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o bien
   yarn install
   ```

3. **Ejecutar en entorno de desarrollo:**
   ```bash
   npm run dev
   # o bien
   yarn dev
   ```

4. **Abrir en el navegador:**  
   Visita `http://localhost:3000` para ver la aplicación localmente.

---

## 🤝 Contribución

1. Haz un Fork del proyecto.
2. Crea una rama para tu nueva característica (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz Commit (`git commit -m 'Añade nueva característica'`).
4. Sube los cambios a tu rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

---

## 👤 Autores del proyecto

Coordinador del proyecto Carlos Chaparro Lopez/
Desarrollador Senior Full Stack Pablo Andres Carvajal/
Desarrollador 1 Javier Armando Sanchez/
Desarrollador 2 Sergio Andres Vázquez/
Desarrollador 3 David Ramirez/ 


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




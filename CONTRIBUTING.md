# Guía del equipo — Frontend Turismo Santander

Bienvenido/a. Esta guía te deja trabajando en minutos.

## 1. Requisitos

- **Node.js 22+** y npm. (El proyecto fija la versión en `.nvmrc`.)
- Git y una cuenta de GitHub con acceso al repositorio.

## 2. Puesta en marcha

```bash
git clone https://github.com/AndrewCarvajal97/frontend-turismo-santander.git
cd frontend-turismo-santander
npm install
cp .env.example .env      # ajusta si hace falta (en dev puede quedar vacío)
npm run dev               # servidor local con recarga en caliente
```

Abre la URL que imprime Vite (normalmente `https://localhost:5173`).

## 3. Modelo de ramas

| Rama | Rol | Despliegue automático |
|---|---|---|
| `main` | **Producción** (post-QA) | → `turismo-santander.desarrollos-pablo-carvajal.com` |
| `release/development` | **Desarrollo** / integración | → entorno de desarrollo (URL de dev) |
| `feature/<algo>`, `fix/<algo>` | Tu trabajo del día a día | → preview propio por cada PR |

## 4. Flujo de trabajo (IMPORTANTE)

**Nunca se hace `push` directo a `main` ni a `release/development`.** Todo entra por Pull Request.

```
1. Parte de la rama de desarrollo, siempre actualizada:
   git switch release/development
   git pull
   git switch -c feature/mi-cambio

2. Trabaja y commitea (mensajes en imperativo):
   git add .
   git commit -m "feat: agrega el filtro por modalidad"

3. Sube tu rama y abre un Pull Request HACIA release/development:
   git push -u origin feature/mi-cambio
   # luego, en GitHub, "Compare & pull request"

4. Espera a que el CI pase (lint + tipos + tests + build) y a la aprobación
   de un revisor. Cloudflare te crea un preview del PR para revisarlo.

5. Al fusionar en release/development, se despliega al entorno de desarrollo.
   Cuando esté validado, se promueve a main (producción) por otro PR.
```

## 5. Comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Compila producción (tipos + Vite). |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run test` | Corre los tests (Vitest). |
| `npm run format` | Formatea con Prettier. |

## 6. Antes de abrir un PR, revisa localmente

```bash
npm run lint
npm run test
npm run build
```

Si esos tres pasan en tu máquina, el CI también pasará. Así no rebotas el PR.

## 7. Convención de commits

`<tipo>: <resumen>` — tipos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`.

## 8. Estructura del código

```
src/
├─ components/   # ui, layout y secciones reutilizables
├─ pages/        # una carpeta por página (Home, Destino, Metaverso, …)
├─ features/     # dominios (destinos, …) con su modelo y repositorio
├─ services/     # cliente HTTP tipado por dominio (habla con el backend)
├─ hooks/        # hooks reutilizables (SEO, precarga, …)
└─ lib/          # utilidades (formato, assets, preload)
```

> **Nota:** el backend aún no está desplegado, así que las secciones que
> dependen de la API (catálogos, imágenes reales, videos del metaverso) se ven
> vacías o con datos de relleno en dev/producción. Es lo esperado hasta que el
> backend esté en línea.

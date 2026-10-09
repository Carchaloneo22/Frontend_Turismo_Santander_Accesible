import { useState, lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/Home'
import { IntroSplash } from './components/intro/IntroSplash'
import { NotFoundPage } from './pages/NotFound'
import { PoliticaCookiesPage, PoliticaDatosPage, TerminosPage } from './pages/Legal'
import { MapaSitioPage } from './pages/MapaSitio'
import { ScrollToTop } from './components/ScrollToTop'
import { LoginPage, RegistroPage, RecuperarPage } from './pages/Auth'
import { DashboardPage } from './pages/Dashboard'
import { ConsentGate } from './components/consent'

// Carga perezosa de los bundles pesados: el 3D/VR y el mapa (MapLibre) solo se
// descargan al entrar a esas rutas, no en el Home.
const MetaversoPage = lazy(() => import('./pages/Metaverso/MetaversoPage'))
const DestinoPage = lazy(() => import('./pages/Destino').then((m) => ({ default: m.DestinoPage })))

// Las cuatro páginas de catálogo comparten Hero + rejilla; van perezosas porque
// cada una arrastra su servicio y no se visitan desde el Home en frío.
const PlanesPage = lazy(() =>
  import('./pages/PlanesTuristicos/PlanesPage').then((m) => ({ default: m.PlanesPage })),
)
const HospePage = lazy(() =>
  import('./pages/Hospedaje/HospePage').then((m) => ({ default: m.HospePage })),
)
const TransPage = lazy(() =>
  import('./pages/Transporte/TransPage').then((m) => ({ default: m.TransPage })),
)
const EcoPage = lazy(() =>
  import('./pages/E-Commerce/EcoPage').then((m) => ({ default: m.EcoPage })),
)

/** Envuelve una página perezosa con su aviso de carga. */
const perezosa = (pagina: ReactNode, que: string) => (
  <Suspense fallback={<div style={{ padding: 40 }}>Cargando {que}…</div>}>{pagina}</Suspense>
)

const metaverso = (
  <Suspense fallback={<div style={{ padding: 40 }}>Cargando experiencia VR…</div>}>
    {/* La experiencia inmersiva puede cargar contenido desde CDN de terceros:
        se pide consentimiento de "experiencias" antes de entrar. */}
    <ConsentGate
      categoria="experiencias"
      titulo="Experiencia 360° / Realidad Virtual"
      descripcion="Esta experiencia inmersiva puede cargar contenido desde proveedores externos (CDN de A-Frame), que reciben tu dirección IP. Actívala para continuar; podrás revocarla cuando quieras desde el pie de página."
    >
      <MetaversoPage />
    </ConsentGate>
  </Suspense>
)

/**
 * La página del destino, con `key` = el municipio.
 *
 * El `key` no es decorativo: fuerza a React a REMONTAR la página al pasar de
 * /destinos/giron a /destinos/barichara. Sin él se reutiliza la misma instancia,
 * el estado de useRecurso sobrevive, y se ven los datos de Girón bajo el título
 * de Barichara hasta que llega la respuesta. Reiniciar ese estado desde un
 * efecto sería un setState en cascada, que es lo que el compilador de React
 * rechaza; remontar es la forma que la propia React recomienda.
 */
function DestinoRuta() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Cargando destino…</div>}>
      <DestinoPage key={slug} />
    </Suspense>
  )
}

function App() {
  // Estado para controlar la presentación inicial de bienvenida (Splash Screen)
  const [mostrarIntro, setMostrarIntro] = useState(true)

  // Si la intro está activa, se renderiza la vista de video + componentes superpuestos
  if (mostrarIntro) {
    return (
      <IntroSplash customVideoSrc="/video/Hero_Intro.mp4" onEnter={() => setMostrarIntro(false)} />
    )
  }

  return (
    <>
      {/* Al cambiar de ruta la página vuelve arriba (en una SPA no ocurre solo). */}
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinos/:slug" element={<DestinoRuta />} />
          <Route path="/planes-turisticos" element={perezosa(<PlanesPage />, 'planes')} />
          <Route path="/hospedaje" element={perezosa(<HospePage />, 'hospedajes')} />
          <Route path="/transporte" element={perezosa(<TransPage />, 'transporte')} />
          <Route path="/artesanias" element={perezosa(<EcoPage />, 'artesanías')} />

          {/* Páginas legales (cookies + tratamiento de datos, Ley 1581). */}
          <Route path="/politica-de-cookies" element={<PoliticaCookiesPage />} />
          <Route path="/politica-de-datos" element={<PoliticaDatosPage />} />
          <Route path="/terminos" element={<TerminosPage />} />
          <Route path="/mapa-del-sitio" element={<MapaSitioPage />} />

          {/* Alias heredados: el Home enlazaba a /planes y hubo /ecommerce por ahí.
            Redirigen en vez de romper, y así los enlaces viejos siguen valiendo. */}
          <Route path="/planes" element={<Navigate to="/planes-turisticos" replace />} />
          <Route path="/ecommerce" element={<Navigate to="/artesanias" replace />} />
          <Route path="/e-commerce" element={<Navigate to="/artesanias" replace />} />

          {/* 404: cualquier ruta no reconocida cae aquí, dentro del Layout (con
            navbar y footer) para que el usuario pueda seguir navegando. */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Experiencia VR a pantalla completa, FUERA del Layout */}
        {/* Sin destino → galería demo; con destino → sitios reales de ese lugar. */}
        <Route path="/metaverso" element={metaverso} />
        <Route path="/metaverso/:destinoSlug" element={metaverso} />

        {/* Autenticación y panel: a pantalla completa, FUERA del Layout. */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/recuperar-contrasena" element={<RecuperarPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  )
}

export default App

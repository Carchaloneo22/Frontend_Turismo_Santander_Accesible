import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Fuentes AUTO-HOSPEDADAS (@fontsource): se empaquetan con la app y se sirven
// desde nuestro propio dominio. Así NO se hace ninguna petición a Google Fonts
// (que enviaría la IP del usuario a un tercero) → no requieren consentimiento.
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/500.css'
import '@fontsource/open-sans/600.css'
import './styles/tokens.css'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

// `basename` sigue al `base` del build (Vite lo expone en BASE_URL). Sin esto, un
// despliegue en un subdirectorio —GitHub Pages sirve el sitio en /<repo>/—
// intentaría casar "/santander-accesible/metaverso" contra la ruta "/metaverso" y
// no encontraría ninguna. En la raíz vale '/' y no cambia nada.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)

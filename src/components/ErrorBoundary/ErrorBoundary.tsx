import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Límite de errores de React (WCAG/usabilidad: recuperación ante fallo). Si un
 * componente lanza durante el render, en vez de dejar la pantalla en blanco se
 * muestra un mensaje claro con `role="alert"` y opciones para continuar.
 *
 * Debe ser un componente de CLASE: React solo llama a `getDerivedStateFromError`
 * y `componentDidCatch` en clases. El fallback usa HTML plano y un `<a>` normal
 * (no el router) para no depender de nada que pueda estar roto.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En producción esto iría a un servicio de errores (p. ej. Sentry). Por
    // ahora se registra en consola para depuración.
    console.error('ErrorBoundary capturó un error de render:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Algo salió mal</h1>
        <p style={{ maxWidth: '52ch', color: '#4a4a4a' }}>
          Ocurrió un error inesperado al mostrar esta página. Puedes intentar recargar o volver al
          inicio. Si el problema continúa, inténtalo más tarde.
        </p>
        <div
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: 8,
              border: 'none',
              background: '#1a6b3c',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Recargar la página
          </button>
          <a
            href="/"
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: 8,
              border: '2px solid #1a6b3c',
              color: '#1a6b3c',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }
}

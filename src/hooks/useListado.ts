import { useEffect, useState } from 'react'

interface Estado<T> {
  datos: T[]
  cargando: boolean
  error: string | null
}

/**
 * useListado — carga una lista del backend y expone {datos, cargando, error}.
 *
 * Las páginas de catálogo (planes, hospedaje, transporte, artesanías) hacen
 * exactamente lo mismo: pedir, esperar, y o pintar o explicar por qué no. Esto
 * lo centraliza para que ninguna se invente su propio manejo de errores.
 *
 * `error` no es un detalle técnico: es lo que se le enseña al usuario. Los
 * mensajes del backend ya vienen saneados (no filtran el esquema), así que se
 * puede mostrar el suyo; si no hay, se usa el de respaldo.
 *
 * El estado es UN objeto y se asigna de una vez, en vez de tres `setState`
 * sueltos: poner `cargando` a true al entrar en el efecto es un setState
 * síncrono dentro de un efecto, que dispara renders en cascada (y el compilador
 * de React lo rechaza). Arrancando ya en `cargando: true` no hace falta.
 *
 * @param cargar  Función del servicio. Debe ser estable (memorizada con
 *                useCallback), o el efecto se repetiría sin fin.
 */
export function useListado<T>(cargar: () => Promise<T[]>, mensajeError: string): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({ datos: [], cargando: true, error: null })

  useEffect(() => {
    let vivo = true

    cargar()
      .then((datos) => {
        if (vivo) setEstado({ datos: Array.isArray(datos) ? datos : [], cargando: false, error: null })
      })
      .catch((e: unknown) => {
        if (!vivo) return
        const error = e instanceof Error && e.message ? e.message : mensajeError
        setEstado({ datos: [], cargando: false, error })
      })

    // Evita pintar la respuesta de una petición que ya no interesa (el usuario
    // cambió de página antes de que llegara).
    return () => {
      vivo = false
    }
  }, [cargar, mensajeError])

  return estado
}

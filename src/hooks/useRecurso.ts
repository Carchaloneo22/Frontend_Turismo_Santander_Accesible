import { useEffect, useState } from 'react'

interface Estado<T> {
  dato: T | null
  cargando: boolean
  error: string | null
}

/**
 * useRecurso — carga UN recurso del backend y expone {dato, cargando, error}.
 *
 * Es el hermano de `useListado` para cuando lo que se pide es uno y no muchos:
 * la página de un destino, la ficha de un operador. La diferencia importa,
 * porque con una lista el vacío es un estado normal ("no hay planes") y con un
 * recurso único es un 404 ("ese municipio no existe"), y no se cuentan igual.
 *
 * El estado es UN objeto y se asigna de una vez, por lo mismo que en
 * `useListado`: poner `cargando` a true dentro del efecto es un setState
 * síncrono que dispara renders en cascada, y el compilador de React lo rechaza.
 * Arrancando ya en `cargando: true` no hace falta.
 *
 * ── Ojo al cambiar de un recurso a otro ──
 * Este hook NO se reinicia solo. Si el mismo componente pasa de un recurso a
 * otro (de /destinos/giron a /destinos/barichara), enseñaría los datos de Girón
 * bajo el título de Barichara hasta que llegara la respuesta. Reiniciarlo desde
 * el efecto es justo el setState en cascada que no se puede hacer.
 *
 * La forma correcta es que React REMONTE el componente, dándole `key` con el
 * identificador del recurso (ver la ruta /destinos/:slug en App.tsx). Así el
 * estado nace limpio y aquí no hace falta reiniciar nada.
 *
 * @param cargar  Función del servicio. Debe ser estable (useCallback), o el
 *                efecto se repetiría sin fin.
 */
export function useRecurso<T>(cargar: () => Promise<T>, mensajeError: string): Estado<T> {
  const [estado, setEstado] = useState<Estado<T>>({ dato: null, cargando: true, error: null })

  useEffect(() => {
    let vivo = true

    cargar()
      .then((dato) => {
        if (vivo) setEstado({ dato, cargando: false, error: null })
      })
      .catch((e: unknown) => {
        if (!vivo) return
        // HttpServiceBase ya rechaza con el mensaje del backend cuando responde
        // ok:false. Ese texto está escrito para el usuario ("Ese municipio no
        // está publicado"), así que se usa tal cual.
        const error = e instanceof Error && e.message ? e.message : mensajeError
        setEstado({ dato: null, cargando: false, error })
      })

    return () => {
      vivo = false
    }
  }, [cargar, mensajeError])

  return estado
}

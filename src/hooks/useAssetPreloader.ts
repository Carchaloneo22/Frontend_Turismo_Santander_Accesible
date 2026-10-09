import { useEffect, useState } from 'react'
import { preloadAssets, type Asset } from '../lib/preload'

interface Options {
  /** Máximo a esperar antes de continuar igual (evita colgarse en redes lentas). */
  timeoutMs?: number
}

interface PreloadState {
  ready: boolean
  progress: number // 0..100
}

/**
 * useAssetPreloader — precarga una lista de assets y expone {ready, progress}.
 * Se usa para mostrar una pantalla de carga hasta que todo esté en caché, y así
 * el usuario no vea imágenes/videos apareciendo de golpe. SRP: solo orquesta la
 * precarga; la UI de carga la pone el consumidor (p. ej. <Loader/>).
 *
 * El avance viene ponderado por el peso de cada asset (ver `lib/preload`), no
 * por cuántos van: contándolos, un video se llevaba el último 1% de la barra y
 * varios segundos de reloj.
 */
export function useAssetPreloader(assets: Asset[], opts: Options = {}): PreloadState {
  const { timeoutMs = 7000 } = opts
  const total = assets.length
  const [fraccion, setFraccion] = useState(0)
  const [ready, setReady] = useState(total === 0)

  // Clave estable: la lista de assets cambia de identidad en cada render, pero su
  // contenido (las URLs) no; dependemos de las URLs, no de la referencia.
  const key = assets.map((a) => a.url).join('|')

  useEffect(() => {
    if (total === 0) {
      queueMicrotask(() => setReady(true))
      return
    }
    let active = true
    queueMicrotask(() => {
      if (active) {
        setReady(false)
        setFraccion(0)
      }
    })

    const timer = setTimeout(() => {
      if (active) setReady(true) // fallback: no bloquear indefinidamente
    }, timeoutMs)

    preloadAssets(assets, (f) => {
      if (active) setFraccion(f)
    }).then(() => {
      if (active) {
        setReady(true)
        clearTimeout(timer)
      }
    })

    return () => {
      active = false
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, timeoutMs])

  return { ready, progress: Math.round(fraccion * 100) }
}

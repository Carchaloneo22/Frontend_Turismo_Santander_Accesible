import { useState, useEffect, useCallback } from 'react'
import { BanderaHeader } from './BanderaHeader'
import { VideoBackground } from './VideoBackground'
import styles from './Intro.module.css'

interface IntroSplashProps {
  onEnter: () => void
  customVideoSrc?: string
  customBannerSrc?: string
  eyebrowText?: string
  mainTitleText?: string
  highlightText?: string
  subTitleText?: string
  buttonText?: string
  // Arreglo de rutas de recursos esenciales del sitio para precargar
  criticalAssets?: string[]
}

/**
 * PRECARGA SELECTIVA DE MÓDULOS LIVIANOS (SPA Prefetching)
 *
 * Se descargan en segundo plano los bundles de catálogo (Planes, Hospedaje, Transporte y E-Commerce)
 * mientras el usuario está en la pantalla de bienvenida.
 *
 * NOTA DE ARQUITECTURA: Excluimos deliberadamente 'MetaversoPage' y 'DestinoPage' de este listado
 * para no descargar previamente librerías pesadas (como A-Frame 3D o MapLibre) durante la Intro,
 * respetando la carga perezosa bajo demanda en esas rutas especificas.
 */
const PREFETCH_LIGHT_MODULES = [
  () => import('../../pages/PlanesTuristicos/PlanesPage'),
  () => import('../../pages/Hospedaje/HospePage'),
  () => import('../../pages/Transporte/TransPage'),
  () => import('../../pages/E-Commerce/EcoPage'),
]

export function IntroSplash({
  onEnter,
  customVideoSrc = '/video/Hero_Intro.mp4',
  customBannerSrc = '/img/Intro/introsplashgobernacion.webp',
  eyebrowText = 'TURISMO ACCESIBLE EN SANTANDER',
  mainTitleText = 'Turismo',
  highlightText = 'Inclusivo,',
  subTitleText = 'Ojos, Oídos y Pasos Libres',
  buttonText = 'Ingresar a Santander Accesible →',
  criticalAssets = ['/assets/logo.webp', '/img/hero-bg.webp'],
}: IntroSplashProps) {
  const [videoReady, setVideoReady] = useState<boolean>(false)
  const [assetsReady, setAssetsReady] = useState<boolean>(false)
  const [modulesReady, setModulesReady] = useState<boolean>(false)

  // 1. Precarga Asíncrona Segura de Assets Críticos del sitio (imágenes base)
  useEffect(() => {
    let isMounted = true

    const preloadImages = async () => {
      try {
        const promises = criticalAssets.map((src) => {
          return new Promise((resolve) => {
            const img = new Image()
            img.src = src
            img.onload = () => resolve(true)
            img.onerror = () => resolve(true) // No bloquea la UI si un recurso opcional falla
          })
        })
        await Promise.all(promises)
        if (isMounted) setAssetsReady(true)
      } catch {
        if (isMounted) setAssetsReady(true)
      }
    }

    preloadImages()

    return () => {
      isMounted = false
    }
  }, [criticalAssets])

  // 2. Prefetching de rutas de catálogo de alto tráfico (Hospedaje, Transporte, etc.)
  useEffect(() => {
    let isMounted = true

    const prefetchAppModules = async () => {
      try {
        // Ejecuta la descarga en paralelo de los scripts JS ligeros
        const modulePromises = PREFETCH_LIGHT_MODULES.map((importFn) => importFn())
        await Promise.all(modulePromises)
        if (isMounted) setModulesReady(true)
      } catch {
        // Si hay una falla de red puntual, no bloqueamos la experiencia de entrada del usuario
        if (isMounted) setModulesReady(true)
      }
    }

    prefetchAppModules()

    return () => {
      isMounted = false
    }
  }, [])

  // Callback seguro para controlar cuando la reproducción del video esté lista
  const handleVideoLoaded = useCallback(() => {
    setVideoReady(true)
  }, [])

  // El botón ÚNICAMENTE aparece cuando el Video, Imágenes y Módulos livianos están en memoria
  const isFullyLoaded = videoReady && assetsReady && modulesReady

  return (
    <section className={styles.splashContainer} aria-label="Pantalla de bienvenida e introducción">
      {/* Cabecera Responsiva con la Bandera */}
      <BanderaHeader src={customBannerSrc} />

      {/* Video de Fondo con Carga Segura */}
      <VideoBackground videoSrc={customVideoSrc} onVideoLoaded={handleVideoLoaded} />

      {/* Capa de Información Superpuesta */}
      <div className={styles.overlayUI}>
        <div className={styles.contentWrapper}>
          <span className={styles.eyebrow}>{eyebrowText}</span>

          <h1 className={styles.title}>
            {mainTitleText} <span className={styles.titleGreen}>{highlightText}</span>
            <br />
            {subTitleText}
          </h1>

          <div className={styles.colorLine} aria-hidden="true">
            <span className={styles.lineRed} />
            <span className={styles.lineYellow} />
            <span className={styles.lineGreen} />
          </div>

          {/* Botón condicional: Se habilita SOLO al terminar la precarga total */}
          {isFullyLoaded ? (
            <button
              type="button"
              className={styles.btnIngresar}
              onClick={onEnter}
              aria-label="Ingresar al portal de Santander Accesible"
            >
              {buttonText}
            </button>
          ) : (
            <div
              className={styles.loadingIndicator}
              style={{ marginTop: '1.25rem', color: '#ffffff', fontSize: '0.9rem' }}
            >
              <span>Preparando portal accesible…</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

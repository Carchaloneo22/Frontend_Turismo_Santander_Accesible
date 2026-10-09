import { useEffect, useRef } from 'react'
import styles from './Intro.module.css'

interface VideoBackgroundProps {
  videoSrc?: string
  onVideoLoaded?: () => void
}

/**
 * Reproductor de video parametrizado, full-screen y responsive.
 * Notifica al orquestador cuando los datos de video están listos.
 */
export function VideoBackground({
  videoSrc = '/video/Hero_Intro.mp4',
  onVideoLoaded,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      onVideoLoaded?.()
    }

    video.addEventListener('canplaythrough', handleCanPlay)
    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [onVideoLoaded])

  return (
    <div className={styles.videoContainer}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBg}
      />
      <div className={styles.overlayGradient} />
    </div>
  )
}

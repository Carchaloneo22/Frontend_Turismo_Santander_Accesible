import { useEffect } from 'react'
import { useAccessibilityStore } from '../store/accessibility.store'

export function useApplyAccessibility() {
  const contrast = useAccessibilityStore((s) => s.contrast)
  const fontScale = useAccessibilityStore((s) => s.fontScale)

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast ? 'high' : 'normal')
  }, [contrast])

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale))
  }, [fontScale])
}

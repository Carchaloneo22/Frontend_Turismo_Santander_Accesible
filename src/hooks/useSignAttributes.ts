import { useSignLanguageStore } from '../store/signLanguage.store'

/** Atributos que vuelven "señable" a un elemento (los detecta useSignLanguage). */
export interface SignAttributes {
  'data-sign'?: string
  'data-sign-label'?: string
  tabIndex?: number
}

/**
 * Fuente única de verdad para hacer señable cualquier elemento: emite los
 * atributos `data-sign` + foco por teclado SOLO cuando el modo Lengua de Señas
 * está activo. Cualquier átomo la reutiliza con una línea (DRY / SRP), en vez de
 * repetir la lógica de hover/foco uno por uno.
 *
 * @param signSrc URL del video/imagen de la seña. Sin ella el elemento no es señable.
 * @param label   Texto para el caption; si se omite, useSignLanguage usa el textContent.
 */
export function useSignAttributes(signSrc?: string, label?: string): SignAttributes {
  const enabled = useSignLanguageStore((s) => s.enabled)
  if (!signSrc || !enabled) return {}
  return { 'data-sign': signSrc, 'data-sign-label': label, tabIndex: 0 }
}

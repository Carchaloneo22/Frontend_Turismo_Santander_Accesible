// src/components/layout/SignPlayer/computePosition.ts

/** Rectángulo del texto señalado (coords de viewport, como getBoundingClientRect). */
export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface Viewport {
  width: number
  height: number
}

export interface Position {
  top: number
  left: number
  placement: 'above' | 'below'
}

export interface ComputeOptions {
  /** Separación entre el texto señalado y el reproductor (px). */
  gap?: number
  /** Margen mínimo respecto a los bordes de la pantalla (px). */
  margin?: number
}

/**
 * Calcula la posición del reproductor (coords de viewport, para `position: fixed`)
 * respecto al texto señalado (`anchor`).
 *
 * Reglas:
 *  - Se centra horizontalmente sobre el texto.
 *  - Prefiere colocarse ENCIMA del texto; si no cabe, se acomoda DEBAJO.
 *  - Nunca se sale de la pantalla: todo queda acotado por `margin`.
 *
 * Función pura (sin React/DOM) → fácil de testear y reutilizar (SRP).
 */
export function computePosition(
  anchor: Rect,
  player: Size,
  viewport: Viewport,
  { gap = 10, margin = 12 }: ComputeOptions = {},
): Position {
  // --- Horizontal: centrar sobre el ancla y acotar a la pantalla ---
  const anchorCenterX = anchor.left + anchor.width / 2
  const maxLeft = Math.max(margin, viewport.width - player.width - margin)
  const left = clamp(anchorCenterX - player.width / 2, margin, maxLeft)

  // --- Vertical: preferir arriba; si no cabe, abajo ---
  const roomAbove = anchor.top - gap - margin
  const placement: Position['placement'] = roomAbove >= player.height ? 'above' : 'below'

  const rawTop =
    placement === 'above' ? anchor.top - gap - player.height : anchor.top + anchor.height + gap

  const maxTop = Math.max(margin, viewport.height - player.height - margin)
  const top = clamp(rawTop, margin, maxTop)

  return { top, left, placement }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

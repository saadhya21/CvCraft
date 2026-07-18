export interface CursorState {
  x: number
  y: number
  targetX: number
  targetY: number
  isHovering: boolean
  hoverIntensity: number
  isTouchDevice: boolean
  prefersReducedMotion: boolean
}

export interface CursorContextType {
  state: CursorState
  registerHoverable: (el: HTMLElement) => () => void
  posRef: React.MutableRefObject<{ x: number; y: number; hoverIntensity: number }>
}

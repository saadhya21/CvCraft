import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { CursorState, CursorContextType } from './types'

const CursorContext = createContext<CursorContextType | null>(null)

const LERP = 0.1

function getInitialState(): CursorState {
  return {
    x: -200,
    y: -200,
    targetX: -200,
    targetY: -200,
    isHovering: false,
    hoverIntensity: 0,
    isTouchDevice: false,
    prefersReducedMotion: false,
  }
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorState>(getInitialState)
  const stateRef = useRef(state)
  const rafRef = useRef<number>(0)
  const hoverableElsRef = useRef<Set<HTMLElement>>(new Set())

  const checkDevice = useCallback(() => {
    const touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setState((s) => ({ ...s, isTouchDevice: touch, prefersReducedMotion: reduced }))
  }, [])

  const registerHoverable = useCallback((el: HTMLElement) => {
    hoverableElsRef.current.add(el)

    const onEnter = () => {
      stateRef.current = { ...stateRef.current, isHovering: true, hoverIntensity: 1 }
    }
    const onLeave = () => {
      stateRef.current = { ...stateRef.current, isHovering: false, hoverIntensity: 0 }
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      hoverableElsRef.current.delete(el)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    checkDevice()
    const mqlTouch = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqlTouch.addEventListener('change', checkDevice)
    mqlMotion.addEventListener('change', checkDevice)

    let targetX = -200
    let targetY = -200

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const animate = () => {
      const s = stateRef.current
      const lerp = s.isHovering ? LERP * 1.2 : LERP

      const nextX = s.x + (targetX - s.x) * lerp
      const nextY = s.y + (targetY - s.y) * lerp

      const hoverLerp = 0.08
      const currentHover = s.isHovering
        ? Math.min(1, s.hoverIntensity + hoverLerp)
        : Math.max(0, s.hoverIntensity - hoverLerp)

      stateRef.current = {
        ...s,
        x: nextX,
        y: nextY,
        targetX,
        targetY,
        hoverIntensity: currentHover,
      }

      setState(stateRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
      mqlTouch.removeEventListener('change', checkDevice)
      mqlMotion.removeEventListener('change', checkDevice)
    }
  }, [checkDevice])

  return (
    <CursorContext.Provider value={{ state, registerHoverable }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor(): CursorContextType {
  const ctx = useContext(CursorContext)
  if (!ctx) throw new Error('useCursor must be used within a CursorProvider')
  return ctx
}

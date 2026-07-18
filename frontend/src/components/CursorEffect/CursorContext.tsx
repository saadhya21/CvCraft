import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { CursorState, CursorContextType } from './types'

const CursorContext = createContext<CursorContextType | null>(null)

const LERP = 0.1

export function CursorProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState({ isTouchDevice: false, prefersReducedMotion: false, isHovering: false })
  const posRef = useRef({ x: -200, y: -200, hoverIntensity: 0 })
  const rafRef = useRef<number>(0)
  const hoverableElsRef = useRef<Set<HTMLElement>>(new Set())

  const checkDevice = useCallback(() => {
    const touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFlags((s) => ({ ...s, isTouchDevice: touch, prefersReducedMotion: reduced }))
  }, [])

  const registerHoverable = useCallback((el: HTMLElement) => {
    hoverableElsRef.current.add(el)

    const onEnter = () => { setFlags((s) => ({ ...s, isHovering: true })); posRef.current.hoverIntensity = 1 }
    const onLeave = () => { setFlags((s) => ({ ...s, isHovering: false })); posRef.current.hoverIntensity = 0 }

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
      const p = posRef.current
      const lerp = flags.isHovering ? LERP * 1.2 : LERP

      p.x += (targetX - p.x) * lerp
      p.y += (targetY - p.y) * lerp

      const hoverLerp = 0.08
      p.hoverIntensity += (flags.isHovering ? 1 : 0) * hoverLerp - p.hoverIntensity * hoverLerp

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
  }, [checkDevice, flags.isHovering])

  const state: CursorState = {
    x: posRef.current.x,
    y: posRef.current.y,
    targetX: posRef.current.x,
    targetY: posRef.current.y,
    isHovering: flags.isHovering,
    hoverIntensity: posRef.current.hoverIntensity,
    isTouchDevice: flags.isTouchDevice,
    prefersReducedMotion: flags.prefersReducedMotion,
  }

  return (
    <CursorContext.Provider value={{ state, registerHoverable, posRef }}>
      {children}
    </CursorContext.Provider>
  )
}

export function useCursor(): CursorContextType {
  const ctx = useContext(CursorContext)
  if (!ctx) throw new Error('useCursor must be used within a CursorProvider')
  return ctx
}

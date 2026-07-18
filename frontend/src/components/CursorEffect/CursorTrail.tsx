'use client'

import { useEffect, useRef } from 'react'
import { useCursor } from './CursorContext'

interface Fragment {
  el: HTMLDivElement
  x: number
  y: number
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  vx: number
  vy: number
}

const COLORS = [
  'rgba(221, 208, 200, 0.3)',
  'rgba(239, 230, 218, 0.25)',
  'rgba(111, 78, 55, 0.2)',
  'rgba(92, 64, 51, 0.15)',
  'rgba(221, 208, 200, 0.2)',
]

export default function CursorTrail() {
  const { state } = useCursor()
  const fragsRef = useRef<Fragment[]>([])
  const rafRef = useRef<number>(0)
  const cursorRef = useRef({ x: -200, y: -200 })
  const lastSpawnRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (state.isTouchDevice || state.prefersReducedMotion) return

    const spawnFragment = (cx: number, cy: number, isHovering: boolean) => {
      if (!containerRef.current) return

      const el = document.createElement('div')
      const w = Math.random() * 5 + 3
      const h = Math.random() * 4 + 2
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const spread = isHovering ? 4 : 8

      el.style.cssText = `
        position: fixed;
        width: ${w}px;
        height: ${h}px;
        background: ${color};
        border-radius: ${Math.random() * 2 + 1}px;
        pointer-events: none;
        z-index: 9999;
        will-change: transform, opacity;
      `

      document.body.appendChild(el)

      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.4 + 0.1

      fragsRef.current.push({
        el,
        x: cx + (Math.random() - 0.5) * spread,
        y: cy + (Math.random() - 0.5) * spread,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.2,
      })
    }

    const animate = () => {
      const cx = cursorRef.current.x
      const cy = cursorRef.current.y
      const isHovering = state.isHovering
      const hoverBias = isHovering ? 0.3 : 0

      const dist = Math.sqrt(
        (state.x - cx) ** 2 + (state.y - cy) ** 2
      )
      if (dist > 2) {
        lastSpawnRef.current++
        const spawnRate = isHovering ? 1 : 2
        if (lastSpawnRef.current >= spawnRate) {
          const count = isHovering ? 2 : 1
          for (let i = 0; i < count; i++) {
            spawnFragment(state.x, state.y, isHovering)
          }
          lastSpawnRef.current = 0
        }
      }

      cursorRef.current.x = state.x
      cursorRef.current.y = state.y

      const frags = fragsRef.current
      for (let i = frags.length - 1; i >= 0; i--) {
        const f = frags[i]
        f.life++

        if (f.life >= f.maxLife) {
          f.el.remove()
          frags.splice(i, 1)
          continue
        }

        const progress = f.life / f.maxLife

        f.x += f.vx
        f.y += f.vy

        if (isHovering) {
          f.vy += (state.y - f.y - f.vy * 5) * 0.008
        }

        f.rotation += f.rotationSpeed

        const opacity = Math.sin(progress * Math.PI) * (0.25 + hoverBias)
        const scale = 1 - progress * 0.4
        const stretchX = 1 + Math.abs(f.vx) * 0.5
        const stretchY = 1 + Math.abs(f.vy) * 0.5

        f.el.style.transform = `translate3d(${f.x}px, ${f.y}px, 0) scale(${scale * stretchX}, ${scale * stretchY}) rotate(${f.rotation}deg)`
        f.el.style.opacity = String(opacity)
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX
      cursorRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
      fragsRef.current.forEach((f) => f.el.remove())
      fragsRef.current = []
    }
  }, [state.isTouchDevice, state.prefersReducedMotion, state.x, state.y, state.isHovering])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999]" />
}

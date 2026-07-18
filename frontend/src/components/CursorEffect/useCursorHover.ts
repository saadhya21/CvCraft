import { useEffect, useRef } from 'react'
import { useCursor } from './CursorContext'

export function useCursorHover<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { registerHoverable } = useCursor()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const unregister = registerHoverable(el)
    return unregister
  }, [registerHoverable])

  return ref
}

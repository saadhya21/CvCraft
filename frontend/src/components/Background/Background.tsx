import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Square {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
  opacity: number
  rotation: number
}

export default function Background() {
  const squares = useMemo<Square[]>(() => {
    const items: Square[] = []
    const count = 18
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        size: Math.random() * 80 + 20,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 20,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.04 + 0.02,
        rotation: Math.random() * 360,
      })
    }
    return items
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {squares.map((sq) => (
        <motion.div
          key={sq.id}
          className="absolute bg-espresso"
          style={{
            width: sq.size,
            height: sq.size,
            left: `${sq.x}%`,
            top: `${sq.y}%`,
            opacity: sq.opacity,
            borderRadius: '2px',
            filter: 'blur(1px)',
            rotate: `${sq.rotation}deg`,
          }}
          animate={{
            y: [0, -20, -10, -25, 0],
            rotate: [sq.rotation, sq.rotation + 2, sq.rotation - 1, sq.rotation + 1, sq.rotation],
          }}
          transition={{
            duration: sq.duration,
            delay: sq.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {label && (
        <span className="inline-block text-coffee text-sm font-medium tracking-widest uppercase mb-4">
          {label}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-espresso leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-lg text-espresso/60 leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

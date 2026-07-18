import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-300 select-none'

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[44px]',
  }

  const variantStyles = {
    primary:
      'bg-espresso text-cream hover:bg-chocolate shadow-sm hover:shadow-md active:shadow-sm',
    secondary:
      'bg-white text-espresso border border-sand/50 hover:border-sand hover:shadow-sm active:shadow-sm',
    ghost:
      'text-espresso/70 hover:text-espresso hover:bg-espresso/5',
  }

  const MotionComponent = href ? motion.a : motion.button

  const props = {
    className: `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} rounded-xl ${className}`,
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.98 },
    ...(href ? { href } : {}),
    ...(onClick ? { onClick } : {}),
    ...(!href ? { type } : {}),
  }

  return <MotionComponent {...props}>{children}</MotionComponent>
}

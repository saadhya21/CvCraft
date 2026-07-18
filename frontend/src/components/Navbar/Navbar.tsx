import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/80 backdrop-blur-xl shadow-[0_1px_0_rgba(212,197,176,0.2)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-tight flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 -ml-2 transition-colors duration-300 active:scale-95 active:bg-espresso/5">
          <div className="w-8 h-8 rounded-lg bg-espresso flex items-center justify-center">
            <svg className="w-4 h-4 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          <span className="font-display text-xl text-espresso font-semibold">CvCraft</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-espresso/60 hover:text-espresso text-sm font-medium transition-colors duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-6 h-6 flex items-center justify-center"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <motion.div className="flex flex-col gap-1.5">
            <motion.span
              className="block w-5 h-[1.5px] bg-espresso rounded-full"
              animate={mobileOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-espresso rounded-full"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-[1.5px] bg-espresso rounded-full"
              animate={mobileOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 top-[72px] bg-cream z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center gap-8 h-full">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-2xl font-display text-espresso"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

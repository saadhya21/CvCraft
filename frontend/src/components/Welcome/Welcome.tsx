import { motion } from 'framer-motion'
import Background from '../Background/Background'

interface WelcomeProps {
  onGetStarted: () => void
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE4D4 40%, #F5F0E8 70%, #E8D5C9 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,197,176,0.15) 0%, transparent 60%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(111,78,55,0.06) 0%, transparent 55%)',
            filter: 'blur(120px)',
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(212,197,176,0.1) 0%, transparent 50%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(44,24,16,0.04) 0%, transparent 50%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(111,78,55,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(111,78,55,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <Background />

      <nav className="relative z-10 container-tight flex items-center px-4 sm:px-6 py-4 sm:py-5">
        <button onClick={onGetStarted} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 -ml-2 transition-colors duration-300 active:scale-95 active:bg-espresso/5">
          <div className="w-8 h-8 rounded-lg bg-espresso flex items-center justify-center">
            <svg className="w-4 h-4 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          <span className="font-display text-xl text-espresso font-semibold">CvCraft</span>
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-lg w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="font-display text-[clamp(28px,6vw,60px)] text-espresso leading-[1.1] tracking-tight whitespace-nowrap">
              Welcome back, Aadhya
            </h1>
          </motion.div>

          <motion.p
            className="mt-4 text-base sm:text-lg text-espresso/50 leading-relaxed font-display italic"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Your journey to the perfect resume starts here.
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-espresso text-cream text-base font-medium shadow-sm transition-all duration-300 hover:bg-chocolate hover:shadow-md active:shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

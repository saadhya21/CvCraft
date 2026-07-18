import { motion } from 'framer-motion'
import Button from '../ui/Button'

const easeOut = [0.25, 0.1, 0.25, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
}

interface HeroProps {
  onGetStarted?: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      <div className="container-tight">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative z-10">
            <motion.div variants={itemVariants}>
              <span className="inline-block text-coffee text-sm font-medium tracking-widest uppercase mb-6">
                AI-Powered Resume Builder
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-7xl text-espresso leading-[1.08] tracking-tight"
            >
              Craft Resumes
              <br />
              <span className="text-chocolate">That Open Doors</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-espresso/60 leading-relaxed max-w-lg"
            >
              Transform your career with AI-powered resumes tailored to every opportunity.
              Let your experience speak with the precision it deserves.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Button variant="primary" size="lg" onClick={onGetStarted}>
                Get Started
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 mt-12 pt-8 border-t border-sand/30"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-sand to-coffee border-2 border-cream"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-espresso">Trusted by</p>
                <p className="text-sm text-espresso/50">5,000+ professionals</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative hidden lg:block">
            <div className="relative w-full aspect-[3/4] max-w-[480px] mx-auto">
              <motion.div
                className="absolute -top-8 -right-8 w-64 h-64 bg-sand/20 rounded-3xl blur-3xl"
                animate={{
                  scale: [1, 1.1, 0.9, 1.05, 1],
                  rotate: [0, 2, -1, 1, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.div
                className="relative w-full h-full bg-white rounded-2xl shadow-[0_24px_64px_rgba(44,24,16,0.12),0_8px_24px_rgba(44,24,16,0.06)] overflow-hidden border border-sand/20"
                animate={{ y: [0, -12, -6, -18, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-espresso flex items-center justify-center">
                      <span className="text-cream font-display text-sm font-bold">JD</span>
                    </div>
                    <div>
                      <div className="h-3 w-32 bg-sand/30 rounded-full" />
                      <div className="h-2 w-24 bg-sand/20 rounded-full mt-2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="h-4 w-3/4 bg-sand/30 rounded-full" />
                    <div className="h-4 w-1/2 bg-sand/20 rounded-full" />

                    <div className="h-px bg-sand/20 my-6" />

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coffee/40 mt-1.5 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-48 bg-sand/30 rounded-full" />
                          <div className="h-2 w-full bg-sand/15 rounded-full" />
                          <div className="h-2 w-3/4 bg-sand/15 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coffee/40 mt-1.5 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-44 bg-sand/30 rounded-full" />
                          <div className="h-2 w-full bg-sand/15 rounded-full" />
                          <div className="h-2 w-2/3 bg-sand/15 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-coffee/40 mt-1.5 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-40 bg-sand/30 rounded-full" />
                          <div className="h-2 w-full bg-sand/15 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-sand/20 my-6" />

                    <div className="grid grid-cols-3 gap-3">
                      {[70, 85, 65].map((val, i) => (
                        <div key={i} className="text-center">
                          <div className="h-2 bg-sand/20 rounded-full mb-1.5 overflow-hidden">
                            <div
                              className="h-full bg-coffee/40 rounded-full"
                              style={{ width: `${val}%` }}
                            />
                          </div>
                          <div className="h-2 w-12 bg-sand/20 rounded-full mx-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-coffee/10 via-coffee/20 to-coffee/10" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-8 glass rounded-2xl p-4 shadow-lg"
                animate={{
                  y: [0, -6, -3, -9, 0],
                  x: [0, 3, -2, 4, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coffee/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-espresso">ATS Score</p>
                    <p className="text-lg font-bold text-coffee">92<span className="text-xs font-normal text-espresso/50">/100</span></p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -left-10 glass rounded-2xl p-3 shadow-lg"
                animate={{
                  y: [0, -8, -4, -12, 0],
                  x: [0, -2, 3, -4, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2C1810]/5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-espresso">AI Optimized</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-6 glass rounded-2xl p-3 shadow-lg"
                animate={{
                  y: [0, -10, -5, -14, 0],
                  x: [0, 2, -3, 5, 0],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-sand to-coffee"
                      />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-espresso">+3 reviews</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

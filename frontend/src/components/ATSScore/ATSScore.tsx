import { motion } from 'framer-motion'

const SCORE_CATEGORIES = [
  { label: 'Keywords', score: 94, color: 'bg-coffee' },
  { label: 'Formatting', score: 88, color: 'bg-chocolate' },
  { label: 'Experience', score: 76, color: 'bg-sand' },
  { label: 'Education', score: 82, color: 'bg-coffee/60' },
]

export default function ATSScore() {
  return (
    <section className="section-padding bg-cream/50">
      <div className="container-tight">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-coffee text-sm font-medium tracking-widest uppercase mb-4">
              ATS Intelligence
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-espresso leading-tight">
              Know your score before you submit
            </h2>
            <p className="mt-5 text-lg text-espresso/60 leading-relaxed max-w-lg">
              Over 75% of resumes are rejected by Applicant Tracking Systems before a human
              sees them. Get real-time scoring and optimization suggestions.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Real-time ATS compatibility scoring',
                'Job description keyword matching',
                'Industry-specific optimization',
                'Section-by-section breakdown',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <div className="w-5 h-5 rounded-full bg-coffee/10 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-espresso/70">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative max-w-[380px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-coffee/5 to-sand/20 rounded-3xl blur-2xl" />

              <motion.div
                className="relative bg-white rounded-2xl shadow-[0_16px_48px_rgba(44,24,16,0.1)] overflow-hidden border border-sand/20 p-8"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-3 w-20 bg-espresso/20 rounded-full mb-2" />
                    <div className="h-2 w-32 bg-sand/20 rounded-full" />
                  </div>
                  <motion.div
                    className="w-20 h-20 rounded-full bg-coffee/5 border-2 border-coffee/20 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 100 }}
                  >
                    <span className="text-2xl font-bold text-coffee">85</span>
                  </motion.div>
                </div>

                <div className="h-px bg-sand/20 mb-6" />

                <div className="space-y-4">
                  {SCORE_CATEGORIES.map((cat, i) => (
                    <motion.div
                      key={cat.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="h-2.5 w-16 bg-espresso/20 rounded-full" />
                        <div className="h-2.5 w-8 bg-espresso/20 rounded-full" />
                      </div>
                      <div className="h-2.5 bg-sand/20 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${cat.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${cat.score}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 pt-6 border-t border-sand/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-2.5 w-28 bg-espresso/20 rounded-full mb-2" />
                      <div className="h-2 w-20 bg-sand/20 rounded-full" />
                    </div>
                    <div className="px-4 py-2 bg-coffee/5 rounded-xl border border-coffee/10">
                      <div className="h-2.5 w-16 bg-coffee/30 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

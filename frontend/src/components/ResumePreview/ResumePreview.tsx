import { motion } from 'framer-motion'

export default function ResumePreview() {
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
              Professional Templates
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-espresso leading-tight">
              Resumes that look as good as they perform
            </h2>
            <p className="mt-5 text-lg text-espresso/60 leading-relaxed max-w-lg">
              Choose from expertly crafted templates designed by hiring professionals.
              Each template is ATS-optimized and beautifully formatted.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'ATS-compatible formatting',
                'Custom color schemes',
                'Multiple layout options',
                'Export to PDF, DOCX, TXT',
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
            <div className="relative w-full aspect-[4/5] max-w-[420px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-coffee/5 to-sand/20 rounded-3xl blur-2xl" />

              <motion.div
                className="relative w-full h-full bg-white rounded-2xl shadow-[0_16px_48px_rgba(44,24,16,0.1)] overflow-hidden border border-sand/20 p-8"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-espresso flex items-center justify-center">
                    <span className="text-cream font-display text-lg font-bold">AK</span>
                  </div>
                  <div>
                    <div className="h-4 w-40 bg-sand/30 rounded-full" />
                    <div className="h-3 w-28 bg-sand/20 rounded-full mt-2" />
                  </div>
                </div>

                <div className="h-px bg-sand/20 mb-6" />

                <div className="mb-6">
                  <div className="h-3 w-24 bg-coffee/30 rounded-full mb-3" />
                  <div className="space-y-2">
                    <div className="h-2.5 w-full bg-sand/20 rounded-full" />
                    <div className="h-2.5 w-5/6 bg-sand/20 rounded-full" />
                    <div className="h-2.5 w-4/6 bg-sand/20 rounded-full" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="h-3 w-20 bg-coffee/30 rounded-full mb-3" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-coffee/5 flex items-center justify-center shrink-0">
                          <div className="w-4 h-4 rounded bg-coffee/20" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2.5 w-3/4 bg-sand/25 rounded-full" />
                          <div className="h-2 w-full bg-sand/15 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="h-3 w-28 bg-coffee/30 rounded-full mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Python'].map((skill) => (
                      <div key={skill} className="h-6 px-3 bg-sand/15 rounded-full flex items-center">
                        <div className="h-2 w-12 bg-sand/30 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-coffee/5 rounded-2xl border border-sand/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <span className="text-2xl font-display text-coffee/60 font-bold">5</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

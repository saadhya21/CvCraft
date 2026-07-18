import { motion } from 'framer-motion'

const REVIEW_COMMENTS = [
  {
    type: 'improvement',
    text: 'Add more quantifiable achievements to demonstrate impact.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    type: 'suggestion',
    text: 'Consider leading with a professional summary.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    type: 'positive',
    text: 'Strong action verbs. Great use of industry keywords.',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function AIReview() {
  return (
    <section className="section-padding">
      <div className="container-tight">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="relative w-full aspect-[3/4] max-w-[400px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-coffee/5 to-sand/20 rounded-3xl blur-2xl" />

              <motion.div
                className="relative w-full h-full bg-white rounded-2xl shadow-[0_16px_48px_rgba(44,24,16,0.1)] overflow-hidden border border-sand/20 p-6"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-coffee/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-espresso/20 rounded-full" />
                      <div className="h-2 w-16 bg-sand/20 rounded-full mt-1.5" />
                    </div>
                  </div>
                  <div className="h-6 px-3 bg-coffee/10 rounded-full flex items-center">
                    <div className="h-2 w-12 bg-coffee/30 rounded-full" />
                  </div>
                </div>

                <div className="space-y-3">
                  {REVIEW_COMMENTS.map((comment, i) => (
                    <motion.div
                      key={i}
                      className={`p-4 rounded-xl ${
                        comment.type === 'positive'
                          ? 'bg-green-50/50'
                          : comment.type === 'improvement'
                            ? 'bg-amber-50/50'
                            : 'bg-coffee/[0.03]'
                      } border border-sand/20`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2, duration: 0.5 }}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-0.5 ${
                          comment.type === 'positive' ? 'text-green-600' : 'text-coffee'
                        }`}>
                          {comment.icon}
                        </span>
                        <div>
                          <div className="h-3 w-16 bg-espresso/20 rounded-full mb-2" />
                          <div className="h-2 w-full bg-sand/25 rounded-full" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-6 p-4 rounded-xl bg-coffee/[0.03] border border-sand/20"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-coffee/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div className="h-3 w-36 bg-coffee/30 rounded-full" />
                  </div>
                  <div className="h-2 w-full bg-sand/15 rounded-full" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-coffee text-sm font-medium tracking-widest uppercase mb-4">
              AI Review
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-espresso leading-tight">
              Expert feedback in seconds, not days
            </h2>
            <p className="mt-5 text-lg text-espresso/60 leading-relaxed max-w-lg">
              Our AI analyzes your resume with the same scrutiny as a senior recruiter,
              providing actionable feedback to strengthen every section.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Grammar and style optimization',
                'Keyword gap analysis',
                'Impact score assessment',
                'Personalized improvement suggestions',
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
        </div>
      </div>
    </section>
  )
}

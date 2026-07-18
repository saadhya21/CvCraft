import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const FAQ_ITEMS = [
  {
    q: 'How does the AI resume optimization work?',
    a: 'Our AI analyzes your resume against industry standards and specific job descriptions. It identifies gaps in keywords, formatting issues, and content weaknesses, then provides actionable suggestions to improve each section.',
  },
  {
    q: 'Is CvCraft ATS-friendly?',
    a: 'Yes. Every template is designed to be parseable by all major Applicant Tracking Systems. We also provide real-time ATS scoring so you can see exactly how your resume will perform.',
  },
  {
    q: 'Can I import my existing resume?',
    a: 'Absolutely. You can upload your current resume in PDF, DOCX, or TXT format, and our AI will parse and import your content. You can then optimize it using our tools.',
  },
  {
    q: 'What formats can I export to?',
    a: 'We support export to PDF, DOCX, TXT, and plain text. All exports maintain perfect formatting and ATS compatibility.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes, we offer a free tier that includes one template and basic AI suggestions. Our Professional plan comes with a 14-day free trial so you can experience all features before committing.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="section-padding bg-cream/30">
      <div className="container-tight">
        <SectionHeader
          label="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about CvCraft."
        />

        <div className="max-w-2xl mx-auto mt-16 space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              className="card !p-0 overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left min-h-[44px]"
              >
                <span className="text-sm font-medium text-espresso pr-4">{item.q}</span>
                <motion.svg
                  className="w-4 h-4 text-coffee shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm text-espresso/60 leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

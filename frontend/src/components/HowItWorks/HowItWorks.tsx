import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const STEPS = [
  {
    number: '01',
    title: 'Import or Start Fresh',
    description: 'Upload your existing resume or start from scratch with one of our professional templates. We support all major formats.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Analyzes Your Profile',
    description: 'Our AI scans your experience, skills, and education, comparing them against industry standards and job market trends.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Review & Optimize',
    description: 'Get detailed feedback and suggestions. Fine-tune your content with AI-powered recommendations for maximum impact.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Export & Apply',
    description: 'Download your optimized resume in any format and apply with confidence, knowing it will pass both ATS and human review.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-tight">
        <SectionHeader
          label="How It Works"
          title="Four steps to your next opportunity"
          subtitle="Getting started takes minutes. Your dream job is just a few clicks away."
        />

        <div className="relative mt-20">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sand/40 via-coffee/20 to-sand/40 -translate-x-1/2" />

          <div className="space-y-16 lg:space-y-24">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className={`relative flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="flex-1">
                  <div className={`max-w-md ${i % 2 === 0 ? 'lg:text-right lg:ml-auto' : ''}`}>
                    <span className="font-display text-6xl md:text-7xl text-sand/40 font-bold leading-none">
                      {step.number}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-espresso mt-4 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-espresso/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-white border border-sand/30 shadow-sm items-center justify-center text-coffee">
                  {step.icon}
                </div>

                <div className="flex-1 lg:hidden">
                  <div className="w-10 h-10 rounded-xl bg-white border border-sand/30 shadow-sm flex items-center justify-center text-coffee mb-4">
                    {step.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

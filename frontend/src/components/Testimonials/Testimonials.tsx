import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Stripe',
    quote: 'CvCraft transformed my resume entirely. The AI suggestions were incredibly insightful — I received interview calls from three top-tier companies within two weeks.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer at Google',
    quote: 'The ATS score feature is a game-changer. I had no idea my resume was being filtered out. After optimizing with CvCraft, my callback rate tripled.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director at HubSpot',
    quote: 'Ive used many resume builders, but nothing compares to this. The design templates are stunning and the AI review feels like having a personal career coach.',
    rating: 5,
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="section-padding bg-cream/30">
      <div className="container-tight">
        <SectionHeader
          label="Testimonials"
          title="Trusted by professionals at leading companies"
          subtitle="Hear from people who have transformed their careers with CvCraft."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {TESTIMONIALS.map((testimonial, i) => {
            const isActive = activeIndex === i

            return (
              <motion.div
                key={testimonial.name}
                className={`rounded-2xl p-8 flex flex-col cursor-pointer transition-all duration-500 border-2 ${
                  isActive
                    ? 'bg-white border-coffee shadow-lg scale-[1.02]'
                    : 'bg-white border-transparent shadow-sm hover:border-coffee hover:shadow-lg hover:scale-[1.02]'
                }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIndex(i)}
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <svg
                      key={j}
                      className={`w-4 h-4 text-coffee`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="flex-1">
                  <p className={`leading-relaxed text-sm text-espresso/70`}>
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-sand/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sand to-coffee flex items-center justify-center text-white text-sm font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-espresso">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-espresso/50">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

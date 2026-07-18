import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for exploring what CvCraft can do.',
    features: [
      '1 resume template',
      'Basic AI suggestions',
      'ATS score preview',
      'PDF export',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Professional',
    price: '$14',
    period: '/month',
    description: 'For professionals serious about their career.',
    features: [
      'All premium templates',
      'Advanced AI optimization',
      'Unlimited ATS scoring',
      'AI review & feedback',
      'Cover letter builder',
      'Multiple export formats',
      'Priority support',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    description: 'For teams and career growth at scale.',
    features: [
      'Everything in Professional',
      'Team collaboration',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'Bulk resume management',
      'Analytics & insights',
    ],
    cta: 'Contact Sales',
  },
]

export default function Pricing() {
  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <section id="pricing" className="section-padding">
      <div className="container-tight">
        <SectionHeader
          label="Pricing"
          title="Simple, transparent pricing"
          subtitle="Choose the plan that fits your needs. No hidden fees."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => {
            const isActive = activeIndex === i

            return (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl p-8 cursor-pointer transition-all duration-500 border-2 ${
                  isActive
                    ? 'bg-espresso text-creme border-coffee shadow-xl shadow-espresso/10 scale-105 md:scale-110'
                    : 'bg-white border-transparent shadow-sm hover:border-coffee hover:shadow-lg hover:scale-[1.02]'
                }`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveIndex(i)}
              >
                {isActive && (
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-coffee text-cream text-xs font-medium rounded-full"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Most Popular
                  </motion.div>
                )}

                <div className={isActive ? 'text-cream' : ''}>
                  <h3 className={`text-lg font-semibold ${isActive ? 'text-cream' : 'text-espresso'}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${isActive ? 'text-cream' : 'text-espresso'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${isActive ? 'text-cream/60' : 'text-espresso/50'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${isActive ? 'text-cream/70' : 'text-espresso/50'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-cream/70' : 'text-coffee'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className={`text-sm ${isActive ? 'text-cream/80' : 'text-espresso/70'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="#"
                  className={`mt-8 block w-full py-3 min-h-[44px] rounded-xl text-sm font-medium text-center transition-all duration-300 ${
                    isActive
                      ? 'bg-cream text-espresso hover:bg-cream/90 shadow-sm'
                      : 'bg-espresso text-cream hover:bg-chocolate shadow-sm'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

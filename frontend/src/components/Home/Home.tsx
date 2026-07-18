import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background from '../Background/Background'
import { getHistory, deleteHistory as deleteHistoryEntry, type HistoryEntry } from '../../utils/history'

interface HomeProps {
  onBack: () => void
  onNavigate?: (page: 'reviewer' | 'selector' | 'builder') => void
}

function getGreeting(): { text: string; quote: string | null } {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return { text: 'Good Morning', quote: null }
  if (h >= 12 && h < 17) return { text: 'Good Afternoon', quote: null }
  return { text: 'Good Evening', quote: h >= 22 || h < 5 ? 'Burning the midnight oil? Your dedication speaks volumes.' : null }
}

const CARDS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Resume Review',
    description:
      'Receive AI-powered resume analysis, ATS scoring, and personalized suggestions to improve your resume.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'Resume Selector',
    description:
      'Compare multiple resumes and instantly discover the strongest version for every opportunity.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Resume Builder',
    description:
      'Create beautiful, ATS-friendly resumes using professionally designed templates in minutes.',
  },
]

function InsightBlock({ items, onDelete }: { items: HistoryEntry[]; onDelete: (id: number) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className="w-full mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="rounded-2xl bg-white/70 backdrop-blur-sm border transition-all duration-300 cursor-pointer"
        style={{ borderWidth: open ? 2 : 1, borderColor: open ? '#2C1810' : 'rgba(212,197,176,0.4)' }}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ borderColor: open ? '#2C1810' : 'rgba(111,78,55,0.3)' }}
        layout
      >
        <div className="flex items-center gap-2.5 px-6 py-4">
          <div className="w-8 h-8 rounded-lg bg-coffee/10 flex items-center justify-center text-coffee">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-[15px] font-semibold text-espresso">History</h3>
          <span className="text-[12px] text-espresso/30 font-medium ml-auto">{items.length} entries</span>
          <motion.svg
            className="w-4 h-4 text-espresso/30"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </motion.svg>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              className="space-y-2 px-6 pb-6"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {items.length === 0 && (
                <p className="text-[13px] text-espresso/30 text-center py-6">No history yet</p>
              )}
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/50 border border-sand/20 group hover:border-coffee/20 transition-all duration-300"
                  layout
                  exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-espresso truncate">{item.type}</p>
                    <p className="text-[12px] text-espresso/40 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[11px] text-espresso/25 whitespace-nowrap hidden sm:block">{item.date}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-espresso/20 hover:text-red-500 hover:bg-red-50 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    aria-label="Delete entry"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function HomeCard({ icon, title, description, index, active, onClick }: {
  icon: React.ReactNode
  title: string
  description: string
  index: number
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.15, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-coffee/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <motion.div
        className="relative rounded-2xl bg-white/70 backdrop-blur-sm border p-7 h-full transition-all duration-400 group-hover:shadow-lg"
        style={{ borderWidth: active ? 2 : 1, borderColor: active ? '#2C1810' : 'rgba(212,197,176,0.4)' }}
        animate={active ? { scale: 1.03 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 24, mass: 0.8 }}
      >
        <div className="w-11 h-11 rounded-xl bg-coffee/10 flex items-center justify-center text-coffee mb-5 group-hover:bg-coffee/15 group-hover:text-espresso transition-all duration-400">
          {icon}
        </div>
        <h3 className="text-[17px] font-semibold text-espresso mb-2.5">{title}</h3>
        <p className="text-[14px] leading-relaxed text-espresso/50">{description}</p>
        <div className="mt-5 flex items-center gap-1.5 text-espresso/25 group-hover:text-coffee transition-all duration-400 text-[13px] font-medium">
          <span>Explore</span>
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Home({ onBack, onNavigate }: HomeProps) {
  const [greeting, setGreeting] = useState<{ text: string; quote: string | null }>({ text: '', quote: null })
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    setGreeting(getGreeting())
    setHistory(getHistory())
  }, [])

  const handleDelete = (id: number) => {
    deleteHistoryEntry(id)
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE4D4 40%, #F5F0E8 70%, #E8D5C9 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(212,197,176,0.15) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(111,78,55,0.06) 0%, transparent 55%)', filter: 'blur(120px)' }} />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(212,197,176,0.1) 0%, transparent 50%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(44,24,16,0.04) 0%, transparent 50%)', filter: 'blur(50px)' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(rgba(111,78,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(111,78,55,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <Background />

      <nav className="relative z-10 container-tight flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 -ml-2 transition-colors duration-300 active:scale-95 active:bg-espresso/5"
        >
          <div className="w-8 h-8 rounded-lg bg-espresso flex items-center justify-center">
            <svg className="w-4 h-4 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          <span className="font-display text-xl text-espresso font-semibold">CvCraft</span>
        </button>
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-espresso/5 text-espresso/30 hover:text-espresso/60" aria-label="Toggle theme">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-xl bg-coffee/10 flex items-center justify-center text-coffee text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-coffee/20">
            A
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col px-4 sm:px-8 py-8 sm:py-12 max-w-[1140px] w-full mx-auto">
        <div className="text-left">
          <motion.h1
            className="font-display text-[clamp(24px,3.5vw,40px)] font-semibold text-espresso leading-[1.15] tracking-tight whitespace-nowrap"
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.12, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Welcome back, Aadhya
          </motion.h1>

          {greeting.quote && (
            <motion.p
              className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-coffee/50 max-w-[420px] font-normal italic"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              &ldquo;{greeting.quote}&rdquo;
            </motion.p>
          )}
        </div>

        <div className="w-full mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5">
          {CARDS.map((card, i) => (
            <HomeCard key={card.title} icon={card.icon} title={card.title} description={card.description} index={i} active={activeCard === i} onClick={() => { if (activeCard === i) { if (i === 0 && onNavigate) onNavigate('reviewer'); else if (i === 1 && onNavigate) onNavigate('selector'); else if (i === 2 && onNavigate) onNavigate('builder'); } else { setActiveCard(i) } }} />
          ))}
        </div>

        <InsightBlock items={history} onDelete={handleDelete} />
      </div>
    </div>
  )
}

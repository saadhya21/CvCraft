import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background from '../Background/Background'
import { analyzeResume, type AnalysisResult } from './api'
import { addHistory } from '../../utils/history'

interface ResumeReviewerProps {
  onBack: () => void
}

type Phase = 'upload' | 'uploading' | 'analyzing' | 'done'

const categoryLabels: Record<keyof AnalysisResult['category_scores'], string> = {
  formatting: 'Formatting',
  content_clarity: 'Content Clarity',
  impact_metrics: 'Impact & Metrics',
  ats_compatibility: 'ATS Compatibility',
}

const categoryIcons: Record<keyof AnalysisResult['category_scores'], string> = {
  formatting: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  content_clarity: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
  impact_metrics: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  ats_compatibility: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z',
}

function scoreColor(score: number): string {
  return score >= 8 ? '#16A34A' : '#DC2626'
}

function starEmoji(score: number): string {
  if (score <= 2) return '😬'
  if (score <= 4) return '😕'
  if (score <= 6) return '🙂'
  if (score <= 8) return '😃'
  return '🤩'
}

function RatingPopup({ score, onDismiss }: { score: number; onDismiss: () => void }) {
  const stars = Math.round(score / 2)
  const emoji = starEmoji(score)
  const label = score <= 2 ? 'Needs significant improvement'
    : score <= 4 ? 'Below average'
    : score <= 6 ? 'Decent foundation'
    : score <= 8 ? 'Strong resume'
    : 'Outstanding!'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onDismiss}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl bg-white shadow-xl border border-sand/40 p-6 text-center"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">{emoji}</div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-6 h-6 ${i < stars ? 'text-[#C97E4B]' : 'text-sand/50'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <p className="text-[22px] font-semibold text-espresso">
          {score}/10
        </p>
        <p className="text-[14px] text-espresso/50 mt-1">{label}</p>
        <button
          onClick={onDismiss}
          className="mt-5 w-full py-3 rounded-xl bg-espresso text-cream text-sm font-medium transition-all duration-300 hover:bg-chocolate"
        >
          View Full Breakdown
        </button>
      </motion.div>
    </motion.div>
  )
}

function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          dragOver ? 'border-coffee bg-coffee/5' : 'border-sand/50 hover:border-coffee/40 hover:bg-coffee/[0.02]'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <p className="text-[15px] font-medium text-espresso mb-1.5">Upload your resume</p>
        <p className="text-[13px] text-espresso/40">PDF, PNG, JPG, or HEIC</p>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.heic,.heif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
    </motion.div>
  )
}

function ScoreRing({ score }: { score: number }) {
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 10)
  const color = scoreColor(score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[180px] h-[180px]">
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)` }} />
        <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 180 180">
          <defs>
            <linearGradient id={`ring-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
            <filter id={`ring-glow-${score}`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(212,197,176,0.2)" strokeWidth="8" />
          <circle cx="90" cy="90" r={radius - 8} fill="none" stroke="rgba(212,197,176,0.08)" strokeWidth="1" />
          <circle cx="90" cy="90" r={radius + 8} fill="none" stroke="rgba(212,197,176,0.08)" strokeWidth="1" />
          <motion.circle
            cx="90" cy="90" r={radius} fill="none"
            stroke={`url(#ring-grad-${score})`}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            filter={`url(#ring-glow-${score})`}
          />
          <motion.circle
            cx="90" cy="90" r={radius} fill="none"
            stroke={color} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            opacity="0.4"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-[44px] font-semibold leading-none font-fraunces tracking-tight"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {score}
          </motion.span>
          <motion.span
            className="text-[12px] text-espresso/30 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            / 10
          </motion.span>
        </div>
      </div>
    </div>
  )
}

function CategoryBar({ label, path, score }: { label: string; path: string; score: number }) {
  const pct = (score / 10) * 100
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-coffee/8 flex items-center justify-center shrink-0 text-coffee/60">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-[12px] mb-1">
          <span className="text-espresso/60 font-medium">{label}</span>
          <span className="text-espresso/40 font-mono">{score}/10</span>
        </div>
        <div className="h-1.5 rounded-full bg-sand/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: scoreColor(score) }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </div>
    </div>
  )
}

function CollapsibleSection({ title, icon, items, accent }: {
  title: string
  icon: React.ReactNode
  items: string[]
  accent: 'green' | 'red' | 'copper'
}) {
  const [open, setOpen] = useState(true)
  const [clicked, setClicked] = useState(false)

  const accentConfig = accent === 'green'
    ? { dot: 'bg-emerald-500', bg: 'bg-emerald-50/80', text: 'text-emerald-700', hover: 'hover:bg-emerald-100/50' }
    : accent === 'red'
    ? { dot: 'bg-red-400', bg: 'bg-red-50/80', text: 'text-red-600', hover: 'hover:bg-red-100/50' }
    : { dot: 'bg-[#C97E4B]', bg: 'bg-amber-50/80', text: 'text-amber-700', hover: 'hover:bg-amber-100/50' }

  const handleClick = () => {
    setClicked((c) => !c)
    setOpen((o) => !o)
  }

  return (
    <motion.div
      className="cursor-pointer"
      animate={clicked ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className={`${accentConfig.bg} rounded-xl overflow-hidden transition-all duration-300`}
        style={{ border: clicked ? '1px solid #2C1810' : '1px solid rgba(212,197,176,0.3)' }}
        onClick={handleClick}
      >
        <div className={`flex items-center gap-3 px-4 py-3.5 ${clicked ? '' : accentConfig.hover}`}>
          {icon}
          <span className="text-[14px] font-semibold text-espresso">{title}</span>
          <span className="text-[12px] text-espresso/30 ml-auto">{items.length}</span>
          <motion.svg
            className="w-3.5 h-3.5 text-espresso/30 shrink-0"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </motion.svg>
        </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="px-4 pb-4 space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: accent === 'green' ? '#065F46' : accent === 'red' ? '#991B1B' : '#78350F' }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${accentConfig.dot} mt-[6px] shrink-0`} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </motion.div>
  )
}

function ScoreBox({ result }: { result: AnalysisResult }) {
  const [clicked, setClicked] = useState(false)

  return (
    <motion.div
      className="rounded-2xl bg-white/70 backdrop-blur-sm p-6 flex flex-col items-center justify-center cursor-pointer"
      style={{ border: clicked ? '1px solid #2C1810' : '1px solid rgba(111,78,55,0.25)' }}
      animate={clicked ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => setClicked((c) => !c)}
    >
      <ScoreRing score={result.overall_score} />
      <p className="mt-4 text-[13px] text-espresso/50 text-center leading-relaxed max-w-xs">
        {result.summary}
      </p>
    </motion.div>
  )
}

function CategoryBox({ result }: { result: AnalysisResult }) {
  const [clicked, setClicked] = useState(false)

  return (
    <motion.div
      className="rounded-2xl bg-white/70 backdrop-blur-sm p-6 space-y-3.5 cursor-pointer"
      style={{ border: clicked ? '1px solid #2C1810' : '1px solid rgba(212,197,176,0.4)' }}
      animate={clicked ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => setClicked((c) => !c)}
    >
      <p className="text-[13px] font-semibold text-espresso/50 tracking-wide uppercase">Category Scores</p>
      {(Object.keys(result.category_scores) as Array<keyof typeof result.category_scores>).map((key) => (
        <CategoryBar key={key} label={categoryLabels[key]} path={categoryIcons[key]} score={result.category_scores[key]} />
      ))}
    </motion.div>
  )
}

export default function ResumeReviewer({ onBack }: ResumeReviewerProps) {
  const [phase, setPhase] = useState<Phase>('upload')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [showPopup, setShowPopup] = useState(true)

  const handleFile = async (file: File) => {
    setPhase('uploading')
    setError(null)

    try {
      await new Promise((r) => setTimeout(r, 800))
      setPhase('analyzing')
      const res = await analyzeResume(file)
      setResult(res.analysis)
      setPhase('done')
      setShowPopup(true)
      addHistory('Resume Review', file.name.replace(/\.[^.]+$/, '') + ' — scored ' + (res.analysis?.overall_score ?? '?'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPhase('upload')
    }
  }

  const handleRetry = () => {
    setError(null)
    setPhase('upload')
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE4D4 40%, #F5F0E8 70%, #E8D5C9 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(212,197,176,0.15) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(111,78,55,0.06) 0%, transparent 55%)', filter: 'blur(120px)' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(rgba(111,78,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(111,78,55,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <Background />

      <nav className="relative z-10 container-tight flex items-center px-4 sm:px-6 py-4 sm:py-5">
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
      </nav>

      <div className="flex-1 flex flex-col px-4 sm:px-8 py-6 sm:py-10 max-w-[800px] w-full mx-auto">
        <motion.div className="text-left" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[13px] font-medium tracking-wide text-coffee/60">AI Resume Review</p>
          <h1 className="mt-2 font-display text-[clamp(24px,3.5vw,40px)] font-semibold text-espresso leading-[1.15] tracking-tight">
            Resume Reviewer
          </h1>
          <p className="mt-1.5 text-[13px] text-espresso/40">Upload your resume for an expert AI analysis</p>
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center py-8">
          {phase === 'upload' && !error && <UploadZone onFile={handleFile} />}

          {phase === 'uploading' && (
            <div className="text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto mb-4"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </motion.div>
              <p className="text-[15px] font-medium text-espresso">Uploading...</p>
              <div className="mt-4 w-48 h-1.5 rounded-full bg-sand/30 mx-auto overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-coffee"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </motion.div>
              <p className="text-[15px] font-medium text-espresso">Analyzing...</p>
              <p className="text-[13px] text-espresso/40 mt-1">AI is reviewing your resume</p>
              <div className="mt-4 flex gap-1.5 items-center justify-center">
                {[0, 0.15, 0.3].map((d) => (
                  <motion.div
                    key={d}
                    className="w-2 h-2 rounded-full bg-coffee"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-red-500">Analysis failed</p>
              <p className="text-[13px] text-espresso/40 mt-1 max-w-sm">{error}</p>
              <button onClick={handleRetry} className="mt-4 px-6 py-2.5 rounded-xl bg-espresso text-cream text-sm font-medium transition-all duration-300 hover:bg-chocolate">
                Try Again
              </button>
            </div>
          )}
        </div>

        {phase === 'done' && result && (
          <motion.div
            className="w-full pb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid sm:grid-cols-[1fr_1.5fr] gap-6 mb-6">
              <ScoreBox result={result} />
              <CategoryBox result={result} />
            </div>

            <div className="space-y-2.5">
              <CollapsibleSection
                title="Strengths"
                accent="green"
                icon={<div className="w-7 h-7 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-600"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>}
                items={result.strengths}
              />
              <CollapsibleSection
                title="Flaws"
                accent="red"
                icon={<div className="w-7 h-7 rounded-xl bg-red-100/80 flex items-center justify-center text-red-400"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></div>}
                items={result.flaws}
              />
              <CollapsibleSection
                title="Recommendations"
                accent="copper"
                icon={<div className="w-7 h-7 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-600"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg></div>}
                items={result.recommendations}
              />
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {phase === 'done' && showPopup && result && (
          <RatingPopup score={result.overall_score} onDismiss={() => setShowPopup(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

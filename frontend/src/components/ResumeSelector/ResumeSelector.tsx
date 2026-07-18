import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background from '../Background/Background'
import { compareResumes, compareSavedResumes, categoryLabels, scoreColor, type CompareResponse, type ResumeComparisonEntry } from './api'
import { addHistory } from '../../utils/history'

interface Props {
  onBack: () => void
}

type Phase = 'input' | 'loading' | 'done'

interface SavedResume {
  id: string
  name: string
  date: string
  score: number
}

const STORAGE_KEY = 'cvcraft_saved_resumes'

function getSavedResumes(): SavedResume[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveResumesToStorage(resumes: { name: string; score: number }[]) {
  const existing = getSavedResumes()
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const newEntries: SavedResume[] = resumes.map((r) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: r.name,
    date: now,
    score: r.score,
  }))
  const merged = [...newEntries, ...existing].slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}

function UploadBox({ onFiles, onSelectSaved }: { onFiles: (files: File[]) => void; onSelectSaved: (resumes: SavedResume[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedRef = useRef<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [selected, setSelected] = useState<File[]>([])
  const [tab, setTab] = useState<'upload' | 'saved'>('upload')
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [selectedSaved, setSelectedSaved] = useState<string[]>([])

  useEffect(() => { setSavedResumes(getSavedResumes()) }, [])

  const addFiles = useCallback((list: FileList) => {
    const current = selectedRef.current
    const incoming = Array.from(list)
    const merged = [...current, ...incoming].slice(0, 5)
    selectedRef.current = merged
    setSelected(merged)
    onFiles(merged)
  }, [onFiles])

  const removeFile = (i: number) => {
    const updated = selected.filter((_, idx) => idx !== i)
    selectedRef.current = updated
    setSelected(updated)
    onFiles(updated)
  }

  const toggleSaved = (id: string) => {
    setSelectedSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    )
  }

  const useSaved = () => {
    const picked = savedResumes.filter((r) => selectedSaved.includes(r.id))
    if (picked.length >= 2) {
      const fakeFiles = picked.map((r) => new File([''], r.name, { type: 'application/pdf' }))
      selectedRef.current = fakeFiles
      setSelected(fakeFiles)
      onFiles(fakeFiles)
      onSelectSaved(picked)
    }
  }

  const deleteSaved = (id: string) => {
    const updated = savedResumes.filter((r) => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSavedResumes(updated)
    setSelectedSaved((prev) => prev.filter((x) => x !== id))
  }

  return (
    <div>
      <div className="flex rounded-xl overflow-hidden border border-sand/30 p-1 bg-white/70 mb-4">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${tab === 'upload' ? 'bg-espresso text-cream shadow-sm' : 'text-espresso/50 hover:text-espresso'}`}
          onClick={() => setTab('upload')}
        >
          Upload New
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${tab === 'saved' ? 'bg-espresso text-cream shadow-sm' : 'text-espresso/50 hover:text-espresso'}`}
          onClick={() => { setTab('saved'); setSavedResumes(getSavedResumes()) }}
        >
          Saved Resumes
        </button>
      </div>

      {tab === 'upload' ? (
        <>
          <div
            className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
              selected.length > 0 ? 'border-coffee/30 bg-coffee/[0.02]' : dragOver ? 'border-coffee bg-coffee/5' : 'border-sand/50 hover:border-coffee/40 hover:bg-coffee/[0.02]'
            }`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files) }}
          >
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-2xl bg-coffee/10" />
              <svg className="w-6 h-6 text-coffee relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {selected.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-espresso text-cream text-[10px] font-bold flex items-center justify-center shadow-sm z-20">{selected.length}</span>
              )}
            </div>
            <p className="text-[15px] font-medium text-espresso mb-1">
              {selected.length > 0 ? `${selected.length} of 5 selected — add more` : 'Upload 2–5 resumes to compare'}
            </p>
            <p className="text-[13px] text-espresso/40">Click to browse & select multiple files (Ctrl+click) &middot; or drag & drop</p>
            <p className="text-[11px] text-espresso/20 mt-0.5">PDF, PNG, JPG, or HEIC</p>
          </div>
          <input ref={inputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.heic,.heif" className="hidden" onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }} />
          {selected.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {selected.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/70 border border-sand/30 text-[13px] text-espresso/50">
                  <svg className="w-4 h-4 text-coffee shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span className="truncate flex-1">{f.name}</span>
                  <span className="text-espresso/20 text-[11px]">{(f.size / 1024).toFixed(0)} KB</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    className="w-5 h-5 rounded-md flex items-center justify-center text-espresso/20 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              {selected.length < 5 && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-sand/30 text-[13px] text-espresso/30 hover:text-espresso/50 hover:border-coffee/30 transition-all duration-300"
                >
                  + Add more resumes ({5 - selected.length} left)
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div>
          {savedResumes.length === 0 ? (
            <div className="rounded-2xl border border-sand/30 p-10 text-center">
              <p className="text-[14px] text-espresso/40">No saved resumes yet. Complete a comparison to save them.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {savedResumes.map((r) => {
                const picked = selectedSaved.includes(r.id)
                return (
                  <div
                    key={r.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                      picked ? 'border-coffee bg-coffee/5' : 'border-sand/30 bg-white/70 hover:border-coffee/30'
                    }`}
                    onClick={() => toggleSaved(r.id)}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${picked ? 'bg-espresso border-espresso' : 'border-sand/50'}`}>
                      {picked && <svg className="w-3 h-3 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-espresso truncate">{r.name}</p>
                      <p className="text-[11px] text-espresso/30">{r.date} · Score: {r.score}/100</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSaved(r.id) }}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-espresso/20 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                      aria-label="Delete saved resume"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
              <button
                onClick={useSaved}
                disabled={selectedSaved.length < 2}
                className="w-full mt-2 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                style={{ backgroundColor: selectedSaved.length >= 2 ? '#2C1810' : 'rgba(212,197,176,0.3)', color: selectedSaved.length >= 2 ? '#F5F0E8' : 'rgba(44,24,16,0.25)' }}
              >
                {selectedSaved.length >= 2 ? `Compare ${selectedSaved.length} Resumes` : 'Select at least 2 resumes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = scoreColor(score)
  return (
    <div className="h-2 rounded-full bg-sand/30 overflow-hidden flex-1">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(score, 4)}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  )
}

function CategoryMiniRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] text-espresso/40 w-[90px] shrink-0">{label}</span>
      <ScoreBar score={score} />
      <span className="text-[11px] font-mono text-espresso/30 w-8 text-right">{score}</span>
    </div>
  )
}

function DetailCard({ entry, rank, isWinner }: { entry: ResumeComparisonEntry; rank: number; isWinner: boolean }) {
  const [open, setOpen] = useState(true)

  return (
    <motion.div
      className="rounded-2xl overflow-hidden border bg-white/70 backdrop-blur-sm"
      style={{ borderColor: isWinner ? '#16A34A' : 'rgba(220,38,38,0.15)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-white/30"
        onClick={() => setOpen((o) => !o)}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: isWinner ? '#16A34A' : '#DC2626' }}
        >
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-semibold text-espresso truncate">{entry.name}</span>
            {isWinner && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-green-600">
                Best Fit
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[13px] font-semibold font-fraunces" style={{ color: isWinner ? '#16A34A' : '#DC2626' }}>{entry.overall_score}</span>
            <ScoreBar score={entry.overall_score} />
          </div>
        </div>
        <motion.svg className="w-4 h-4 text-espresso/20 shrink-0" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="px-5 pb-5 space-y-4">
              <p className="text-[13px] text-espresso/50 leading-relaxed">{entry.summary}</p>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-espresso/40 uppercase tracking-wide">Category Scores</p>
                {(Object.keys(entry.category_scores) as Array<keyof typeof entry.category_scores>).map((k) => (
                  <CategoryMiniRow key={k} label={categoryLabels[k]} score={entry.category_scores[k]} />
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/60 p-3.5">
                  <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-2">Strengths</p>
                  <ul className="space-y-1.5">
                    {entry.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[12px] text-emerald-600/80">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mt-[5px] shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-red-50/80 border border-red-200/60 p-3.5">
                  <p className="text-[11px] font-semibold text-red-700 uppercase tracking-wide mb-2">Gaps</p>
                  <ul className="space-y-1.5">
                    {entry.gaps.map((g, i) => (
                      <li key={i} className="flex gap-2 text-[12px] text-red-600/80">
                        <span className="w-1 h-1 rounded-full bg-red-400 mt-[5px] shrink-0" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ResumeSelector({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('input')
  const [files, setFiles] = useState<File[]>([])
  const [jd, setJd] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CompareResponse | null>(null)
  const [savedResumesSelected, setSavedResumesSelected] = useState<SavedResume[] | null>(null)

  const canCompare = files.length >= 2 && jd.trim().length > 0

  const handleCompare = async () => {
    if (!canCompare) return
    setPhase('loading')
    setError(null)
    try {
      const res = savedResumesSelected
        ? await compareSavedResumes(savedResumesSelected, jd)
        : await compareResumes(files, jd)
      setData(res)
      setPhase('done')
      if (res.comparison) {
        saveResumesToStorage(res.comparison.resumes.map((r) => ({ name: r.name, score: r.overall_score })))
        const top = res.comparison.resumes[res.comparison.verdict.winner_index]
        addHistory('Resume Selector', `Compared ${res.comparison.resumes.length} resumes for "${jd.slice(0, 40)}..." — Best fit: ${top.name}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPhase('input')
    }
  }

  const handleSavedSelected = (picked: SavedResume[]) => {
    setSavedResumesSelected(picked)
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
        <button onClick={onBack} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 -ml-2 transition-colors duration-300 active:scale-95 active:bg-espresso/5">
          <div className="w-8 h-8 rounded-lg bg-espresso flex items-center justify-center">
            <svg className="w-4 h-4 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          <span className="font-display text-xl text-espresso font-semibold">CvCraft</span>
        </button>
      </nav>

      <div className="flex-1 flex flex-col px-4 sm:px-8 py-6 sm:py-8 max-w-[900px] w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[13px] font-medium tracking-wide text-coffee/60">AI Resume Comparison</p>
          <h1 className="mt-2 font-display text-[clamp(24px,3.5vw,40px)] font-semibold text-espresso leading-[1.15] tracking-tight">
            Resume Selector
          </h1>
          <p className="mt-1.5 text-[13px] text-espresso/40">Upload 2–5 resumes and a target role to find the best fit</p>
        </motion.div>

        {phase === 'input' && (
          <div className="flex-1 flex flex-col py-8 space-y-6 max-w-[600px] mx-auto w-full">
            <UploadBox onFiles={(f) => { setFiles(f); setSavedResumesSelected(null) }} onSelectSaved={handleSavedSelected} />

            <div>
              <label className="block text-[13px] font-medium text-espresso/50 mb-2">Job Description or Target Role</label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste a job description, or enter a role title + key requirements..."
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl bg-white/70 border border-sand/40 text-espresso placeholder:text-espresso/25 text-[13px] outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 resize-none"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200/60 p-3.5 flex items-center gap-3">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-[13px] text-red-600">{error}</span>
              </div>
            )}

            <motion.button
              onClick={handleCompare}
              disabled={!canCompare}
              className="w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm"
              style={{ backgroundColor: canCompare ? '#2C1810' : 'rgba(212,197,176,0.3)', color: canCompare ? '#F5F0E8' : 'rgba(44,24,16,0.25)' }}
              whileHover={canCompare ? { scale: 1.015 } : {}}
              whileTap={canCompare ? { scale: 0.985 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
            >
              {canCompare ? (savedResumesSelected ? `Compare ${savedResumesSelected.length} Saved Resumes` : `Compare ${files.length} Resumes`) : files.length < 2 ? 'Upload at least 2 resumes' : 'Enter a job description'}
            </motion.button>
          </div>
        )}

        {phase === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </motion.div>
              <p className="text-[15px] font-medium text-espresso">Analyzing & Comparing</p>
              <p className="text-[13px] text-espresso/40 mt-1">AI is evaluating all resumes against the target role</p>
              <div className="mt-5 flex gap-1.5 items-center justify-center">
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
          </div>
        )}

        {phase === 'done' && data && (
          <motion.div
            className="flex-1 py-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="rounded-2xl p-5 bg-white/70 backdrop-blur-sm border border-green-500/30"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-espresso">
                    Best Fit: <span className="text-green-600">{data.comparison.resumes[data.comparison.verdict.winner_index].name}</span>
                  </p>
                  <p className="text-[12px] text-espresso/40">Score: {data.comparison.resumes[data.comparison.verdict.winner_index].overall_score}/100</p>
                </div>
              </div>
              <p className="text-[13px] text-espresso/50 leading-relaxed">{data.comparison.verdict.reasoning}</p>
            </motion.div>

            <div className="rounded-2xl overflow-hidden border border-sand/30 bg-white/70 backdrop-blur-sm">
              <div className="px-5 py-3 border-b border-sand/30">
                <p className="text-[12px] font-semibold text-espresso/40 uppercase tracking-wide">Score Comparison</p>
              </div>
              <div className="divide-y divide-sand/20">
                {data.comparison.ranking.map((idx, rank) => {
                  const entry = data.comparison.resumes[idx]
                  const isWinner = idx === data.comparison.verdict.winner_index
                  return (
                    <div key={idx} className="flex items-center gap-4 px-5 py-3" style={{ background: isWinner ? 'rgba(22,163,74,0.04)' : 'rgba(220,38,38,0.02)' }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: isWinner ? '#16A34A' : '#DC2626' }}>
                        {rank + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-espresso/80 truncate">{entry.name}</span>
                          {isWinner && <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded text-white bg-green-600">Best</span>}
                        </div>
                        <ScoreBar score={entry.overall_score} />
                      </div>
                      <span className="text-[15px] font-semibold font-fraunces w-10 text-right" style={{ color: isWinner ? '#16A34A' : '#DC2626' }}>{entry.overall_score}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              {data.comparison.ranking.map((idx, rank) => (
                <DetailCard key={idx} entry={data.comparison.resumes[idx]} rank={rank + 1} isWinner={idx === data.comparison.verdict.winner_index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

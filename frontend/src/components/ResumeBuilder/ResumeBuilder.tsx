import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background from '../Background/Background'
import { generateResume, type BuilderFormData, type ResumeData } from './api'
import { addHistory } from '../../utils/history'

interface Props {
  onBack: () => void
}

type Phase = 'form' | 'generating' | 'preview'

const STEPS = ['Personal Info', 'Summary & Role', 'Skills', 'Experience', 'Education & Languages', 'Certifications & Projects', 'Review']

const INITIAL_FORM: BuilderFormData = {
  fullName: '',
  title: '',
  location: '',
  phone: '',
  email: '',
  website: '',
  linkedin: '',
  github: '',
  photo: '',
  summary: '',
  targetRole: '',
  skills: '',
  experience: '',
  education: '',
  languages: '',
  certifications: '',
  projects: '',
}

function FormInput({ label, value, onChange, placeholder, multiline, optional }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; optional?: boolean
}) {
  const Comp = multiline ? 'textarea' : 'input'
  return (
    <div>
      <label className="block text-[12px] font-medium text-espresso/40 mb-1.5 tracking-wide uppercase">
        {label} {optional && <span className="text-espresso/20">(optional)</span>}
      </label>
      <Comp
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-sand/40 text-espresso placeholder:text-espresso/20 text-[13px] outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 resize-none"
      />
    </div>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: i <= current ? '#2C1810' : 'rgba(212,197,176,0.3)' }} />
      ))}
      <span className="text-[11px] text-espresso/30 font-mono ml-1">{current + 1}/{total}</span>
    </div>
  )
}

function ResumePreview({ data, photo }: { data: ResumeData; photo?: string }) {
  const NAVY = '#1a2340'
  const BLUE = '#2b5aa6'

  return (
    <div className="bg-white" style={{ padding: '10px', border: `10px solid ${NAVY}` }}>
      <div className="text-[11px] leading-normal" style={{ color: '#222' }}>
        {/* HEADER */}
        <div className="flex gap-4 mb-3">
          {photo && (
            <div className="shrink-0" style={{ width: 90, height: 112, overflow: 'hidden' }}>
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-bold tracking-wide leading-tight" style={{ color: BLUE, fontFamily: 'serif' }}>{data.fullName.toUpperCase()}</h1>
            <div className="mt-1.5 space-y-0.5">
              {data.contact.location && (
                <div className="flex items-center gap-1.5" style={{ color: NAVY }}>
                  <svg className="w-[7px] h-[7px] shrink-0" viewBox="0 0 10 10" fill={BLUE}><circle cx="5" cy="5" r="4" /></svg>
                  <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={BLUE} strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  <span className="text-[10px]">{data.contact.location}</span>
                </div>
              )}
              {data.contact.phone && (
                <div className="flex items-center gap-1.5" style={{ color: NAVY }}>
                  <svg className="w-[7px] h-[7px] shrink-0" viewBox="0 0 10 10" fill={BLUE}><circle cx="5" cy="5" r="4" /></svg>
                  <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={BLUE} strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  <span className="text-[10px]">{data.contact.phone}</span>
                </div>
              )}
              {data.contact.email && (
                <div className="flex items-center gap-1.5" style={{ color: NAVY }}>
                  <svg className="w-[7px] h-[7px] shrink-0" viewBox="0 0 10 10" fill={BLUE}><circle cx="5" cy="5" r="4" /></svg>
                  <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={BLUE} strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  <span className="text-[10px]" style={{ textDecoration: 'underline' }}>{data.contact.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: `2px solid ${BLUE}`, margin: '0 0 3px 0' }} />

        {/* SUMMARY */}
        {data.summary && (
          <>
            <div className="flex gap-3 py-1">
              <div className="w-[100px] shrink-0">
                <span className="text-[10px] font-bold uppercase" style={{ color: NAVY }}>Summary</span>
              </div>
              <div className="flex-1 text-[10px] leading-relaxed" style={{ color: '#333' }}>{data.summary}</div>
            </div>
            <hr style={{ border: 'none', borderTop: `2px solid ${BLUE}`, margin: '1px 0' }} />
          </>
        )}

        {/* SKILLS */}
        {data.skills.length > 0 && (
          <>
            <div className="flex gap-3 py-1">
              <div className="w-[100px] shrink-0">
                <span className="text-[10px] font-bold uppercase" style={{ color: NAVY }}>Skills</span>
              </div>
              <div className="flex-1 text-[10px] leading-relaxed columns-2 gap-4" style={{ color: '#333' }}>
                {data.skills.flatMap((g, gi) => {
                  const items = g.items.map((s, si) => (
                    <span key={`${gi}-${si}`}>{si > 0 || gi > 0 ? '  •  ' : ''}{s}</span>
                  ))
                  if (g.label && gi === 0) {
                    return [<span key={`label-${gi}`} className="font-semibold">{g.label}: </span>, ...items]
                  }
                  if (g.label) {
                    return [<span key={`sep-${gi}`}><br /></span>, <span key={`label-${gi}`} className="font-semibold">{g.label}: </span>, ...items]
                  }
                  return items
                })}
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: `2px solid ${BLUE}`, margin: '1px 0' }} />
          </>
        )}

        {/* EXPERIENCE */}
        {data.experience.length > 0 && (
          <>
            <div className="flex gap-3 py-1">
              <div className="w-[100px] shrink-0">
                <span className="text-[10px] font-bold uppercase" style={{ color: NAVY }}>Experience</span>
              </div>
              <div className="flex-1 space-y-2">
                {data.experience.map((exp, ei) => (
                  <div key={ei}>
                    <p className="text-[10px] font-bold uppercase leading-tight" style={{ color: '#111' }}>{exp.role}</p>
                    <p className="text-[9px] italic leading-tight" style={{ color: '#555' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''} {exp.startDate && `| ${exp.startDate} – ${exp.endDate || 'Present'}`}</p>
                    <ul className="mt-0.5 space-y-0.5">
                      {exp.bullets.map((b, bi) => (
                        <li key={bi} className="flex gap-1.5 text-[9.5px]" style={{ color: '#333' }}>
                          <span className="mt-[3px] w-[3px] h-[3px] rounded-full shrink-0" style={{ backgroundColor: NAVY }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: `2px solid ${BLUE}`, margin: '1px 0' }} />
          </>
        )}

        {/* EDUCATION AND TRAINING */}
        {data.education.length > 0 && (
          <>
            <div className="flex gap-3 py-1">
              <div className="w-[100px] shrink-0">
                <span className="text-[10px] font-bold uppercase" style={{ color: NAVY }}>Education and Training</span>
              </div>
              <div className="flex-1 space-y-2">
                {data.education.map((edu, ei) => (
                  <div key={ei}>
                    <p className="text-[10px] font-bold leading-tight" style={{ color: '#111' }}>{edu.degree}</p>
                    <p className="text-[9.5px] font-semibold" style={{ color: NAVY }}>{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                    <div className="flex gap-2 text-[8.5px] uppercase tracking-wide" style={{ color: '#666' }}>
                      {edu.startDate && <span>{edu.startDate} – {edu.endDate || 'Present'}</span>}
                      {edu.gpa && <span>| GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr style={{ border: 'none', borderTop: `2px solid ${BLUE}`, margin: '1px 0' }} />
          </>
        )}

        {/* LANGUAGES */}
        {data.languages.length > 0 && (
          <div className="flex gap-3 py-1">
            <div className="w-[100px] shrink-0">
              <span className="text-[10px] font-bold uppercase" style={{ color: NAVY }}>Languages</span>
            </div>
            <div className="flex-1 text-[10px]" style={{ color: '#333' }}>
              {data.languages.map((l, li) => (
                <span key={li}>{li > 0 ? '  •  ' : ''}{l.name}{l.level ? ` (${l.level})` : ''}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResumeBuilder({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('form')
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<BuilderFormData>(INITIAL_FORM)
  const [result, setResult] = useState<ResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [step])

  const update = (key: keyof BuilderFormData) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  const canAdvance = () => {
    if (step === 0) return form.fullName.trim().length > 0 && form.email.trim().length > 0
    if (step === 6) return true
    return true
  }

  const handleGenerate = async () => {
    setPhase('generating')
    setError(null)
    try {
      const res = await generateResume(form)
      if ('error' in res && res.error) {
        setError(res.error)
        setPhase('form')
        return
      }
      setResult(res as ResumeData)
      setPhase('preview')
      addHistory('Resume Builder', `Created resume for "${form.targetRole || form.fullName}"`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPhase('form')
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE4D4 40%, #F5F0E8 70%, #E8D5C9 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(212,197,176,0.15) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(111,78,55,0.06) 0%, transparent 55%)', filter: 'blur(120px)' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(rgba(111,78,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(111,78,55,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <Background />
      <div ref={topRef} />

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

      <div className="flex-1 flex flex-col px-4 sm:px-8 py-6 sm:py-8 max-w-[700px] w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[13px] font-medium tracking-wide text-coffee/60">AI-Powered Resume Builder</p>
          <h1 className="mt-2 font-display text-[clamp(24px,3.5vw,40px)] font-semibold text-espresso leading-[1.15] tracking-tight">
            {phase === 'form' ? 'Tell Us About Yourself' : phase === 'generating' ? 'Crafting Your Resume' : 'Your Polished Resume'}
          </h1>
          <p className="mt-1.5 text-[13px] text-espresso/40">
            {phase === 'form' ? 'Answer a few questions and our AI will craft a professional, ATS-friendly resume' : phase === 'generating' ? 'Please wait while we analyze your background...' : 'Review your AI-generated resume below'}
          </p>
        </motion.div>

        {phase === 'form' && (
          <div className="flex-1 flex flex-col py-6 space-y-5">
            <StepIndicator current={step} total={STEPS.length} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <FormInput label="Full Name" value={form.fullName} onChange={update('fullName')} placeholder="e.g. Priya Sharma" />
                    <FormInput label="Professional Title" value={form.title} onChange={update('title')} placeholder="e.g. Senior Frontend Engineer" optional />
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className="flex-1 space-y-4 min-w-0">
                        <FormInput label="Email" value={form.email} onChange={update('email')} placeholder="priya@email.com" />
                        <FormInput label="Phone" value={form.phone} onChange={update('phone')} placeholder="(415) 555-0198" optional />
                        <FormInput label="Location" value={form.location} onChange={update('location')} placeholder="e.g. San Francisco, CA" optional />
                      </div>
                      <div className="shrink-0 flex flex-col items-center gap-2 pt-1">
                        <div
                          className="w-20 h-20 rounded-2xl border-2 border-dashed border-sand/40 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-coffee/40 hover:bg-coffee/[0.02]"
                          onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                          {form.photo ? (
                            <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-6 h-6 text-coffee/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                            </svg>
                          )}
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = () => update('photo')(reader.result as string)
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        <span className="text-[10px] text-espresso/25 text-center leading-tight">Photo</span>
                      </div>
                    </div>
                    <FormInput label="Website" value={form.website} onChange={update('website')} placeholder="priyasharma.dev" optional />
                    <FormInput label="LinkedIn" value={form.linkedin} onChange={update('linkedin')} placeholder="linkedin.com/in/priyasharma" optional />
                    <FormInput label="GitHub" value={form.github} onChange={update('github')} placeholder="github.com/priyasharma" optional />
                  </>
                )}

                {step === 1 && (
                  <>
                    <FormInput label="Target Role / Job Title" value={form.targetRole} onChange={update('targetRole')} placeholder="e.g. Senior Frontend Engineer at Google" />
                    <FormInput label="Professional Summary" value={form.summary} onChange={update('summary')} placeholder="Describe your background, key achievements, and career goals in a few sentences..." multiline optional />
                  </>
                )}

                {step === 2 && (
                  <FormInput label="Skills & Technologies" value={form.skills} onChange={update('skills')} placeholder="List your skills, tools, and technologies (e.g. React, TypeScript, AWS, Docker, Figma...)" multiline />
                )}

                {step === 3 && (
                  <FormInput label="Work Experience" value={form.experience} onChange={update('experience')} placeholder="Describe each role: company, title, dates, and 3-5 key achievements with impact..." multiline />
                )}

                {step === 4 && (
                  <>
                    <FormInput label="Education" value={form.education} onChange={update('education')} placeholder="Institution, degree, dates, GPA (if applicable)..." multiline />
                    <FormInput label="Languages" value={form.languages} onChange={update('languages')} placeholder="e.g. English (Native), Spanish (Conversational)" multiline optional />
                  </>
                )}

                {step === 5 && (
                  <>
                    <FormInput label="Certifications" value={form.certifications} onChange={update('certifications')} placeholder="List your certifications (e.g. AWS Certified Developer...)" multiline optional />
                    <FormInput label="Projects" value={form.projects} onChange={update('projects')} placeholder="Notable projects with descriptions and links..." multiline optional />
                  </>
                )}

                {step === 6 && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <p className="text-[15px] font-medium text-espresso">Ready to generate your resume?</p>
                    <p className="text-[13px] text-espresso/40">Our AI will transform your answers into a polished, ATS-friendly resume tailored to your target role.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200/60 p-3.5 flex items-center gap-3">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span className="text-[13px] text-red-600">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <motion.button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium border border-sand/40 text-espresso/50 hover:bg-white/50 transition-all duration-300"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                >
                  Back
                </motion.button>
              )}
              {step < STEPS.length - 1 ? (
                <motion.button
                  onClick={() => canAdvance() && setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{ backgroundColor: canAdvance() ? '#2C1810' : 'rgba(212,197,176,0.3)', color: canAdvance() ? '#F5F0E8' : 'rgba(44,24,16,0.25)' }}
                  whileHover={canAdvance() ? { scale: 1.015 } : {}}
                  whileTap={canAdvance() ? { scale: 0.985 } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                >
                  Continue
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleGenerate}
                  className="flex-1 py-3 rounded-xl text-sm font-medium shadow-sm"
                  style={{ backgroundColor: '#2C1810', color: '#F5F0E8' }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, mass: 0.8 }}
                >
                  Generate Resume
                </motion.button>
              )}
            </div>
          </div>
        )}

        {phase === 'generating' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </motion.div>
              <p className="text-[15px] font-medium text-espresso">Crafting Your Resume</p>
              <p className="text-[13px] text-espresso/40 mt-1">AI is analyzing your background and generating ATS-optimized content</p>
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

        {phase === 'preview' && result && (
          <motion.div
            className="flex-1 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResumePreview data={result} photo={form.photo || undefined} />

            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={() => { setPhase('form'); setResult(null); setStep(0); setForm(INITIAL_FORM) }}
                className="flex-1 py-3 rounded-xl text-sm font-medium border border-sand/40 text-espresso/50 hover:bg-white/50 transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Start Over
              </motion.button>
              <motion.button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm"
                style={{ backgroundColor: '#2C1810', color: '#F5F0E8' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Export / Print
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

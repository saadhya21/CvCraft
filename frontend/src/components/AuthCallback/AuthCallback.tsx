import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

interface Props {
  onComplete: () => void
}

export default function AuthCallback({ onComplete }: Props) {
  const [status, setStatus] = useState<'processing' | 'done' | 'error'>('processing')

  useEffect(() => {
    if (!supabase) {
      setStatus('error')
      return
    }
    supabase!.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStatus('done')
        setTimeout(onComplete, 500)
      } else {
        supabase!.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setStatus('done')
            setTimeout(onComplete, 500)
          } else {
            setStatus('error')
          }
        })
      }
    })
  }, [onComplete])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F0E8 0%, #EDE4D4 50%, #F5F0E8 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(212,197,176,0.15) 0%, transparent 60%)', filter: 'blur(100px)' }} />
      </div>
      <div className="relative text-center">
        {status === 'processing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="w-14 h-14 rounded-2xl bg-coffee/10 flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <svg className="w-6 h-6 text-coffee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </motion.div>
            <p className="text-[15px] font-medium text-espresso">Completing sign in...</p>
          </motion.div>
        )}
        {status === 'done' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-[15px] font-medium text-espresso">Signed in successfully!</p>
          </motion.div>
        )}
        {status === 'error' && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-[15px] font-medium text-espresso">Sign in failed</p>
            <p className="text-[13px] text-espresso/40 mt-1">Please try again or use another method.</p>
          </div>
        )}
      </div>
    </div>
  )
}

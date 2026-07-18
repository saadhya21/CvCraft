import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Background from '../Background/Background'
import { signInWithGoogle, signInWithGithub, isSupabaseConfigured } from '../../lib/supabase'

interface SignInProps {
  onBack: () => void
  onSignIn: () => void
}

export default function SignIn({ onBack, onSignIn }: SignInProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email')
  const [oauthError, setOauthError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setOauthError(null)
    if (isSupabaseConfigured()) {
      try {
        await signInWithGoogle()
      } catch (err) {
        setOauthError(err instanceof Error ? err.message : 'Google sign-in failed')
      }
    } else {
      onSignIn()
    }
  }

  const handleGithubLogin = async () => {
    setOauthError(null)
    if (isSupabaseConfigured()) {
      try {
        await signInWithGithub()
      } catch (err) {
        setOauthError(err instanceof Error ? err.message : 'GitHub sign-in failed')
      }
    } else {
      onSignIn()
    }
  }

  const handleSendOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setGeneratedOtp(code)
    setOtpSent(true)
    setOtp('')
  }

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
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

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="text-center mb-10">
            <motion.span
              className="inline-block text-coffee text-sm font-medium tracking-widest uppercase mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
            </motion.span>
            <motion.h1
              className="font-display text-4xl text-espresso leading-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {mode === 'signin' ? 'Sign in to CvCraft' : 'Create your account'}
            </motion.h1>
            <motion.p
              className="mt-3 text-espresso/50 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {mode === 'signin' ? 'Enter your credentials to access your account' : 'Start building your perfect resume today'}
            </motion.p>
          </div>

          <motion.form
            className="space-y-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={(e) => { e.preventDefault(); onSignIn() }}
          >
            <div className="flex rounded-xl overflow-hidden border border-sand/30 p-1 bg-white">
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'email'
                    ? 'bg-espresso text-cream shadow-sm'
                    : 'text-espresso/50 hover:text-espresso'
                }`}
                onClick={() => setActiveTab('email')}
              >
                Email
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'phone'
                    ? 'bg-espresso text-cream shadow-sm'
                    : 'text-espresso/50 hover:text-espresso'
                }`}
                onClick={() => setActiveTab('phone')}
              >
                Phone
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'email' ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {mode === 'signup' && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-espresso/70 mb-2">
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-sand/40 text-espresso placeholder:text-espresso/25 text-sm outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 focus:shadow-sm"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-espresso/70 mb-2">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-sand/40 text-espresso placeholder:text-espresso/25 text-sm outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 focus:shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-medium text-espresso/70">
                        Password
                      </label>
                      {mode === 'signin' && (
                        <a href="#" className="text-xs text-coffee hover:text-espresso transition-colors">
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                        className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white border border-sand/40 text-espresso placeholder:text-espresso/25 text-sm outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 focus:shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso/30 hover:text-espresso/60 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {mode === 'signup' && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-espresso/70 mb-2">
                        Confirm password
                      </label>
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-sand/40 text-espresso placeholder:text-espresso/25 text-sm outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 focus:shadow-sm"
                        required
                      />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-espresso/70 mb-2">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-sand/40 text-espresso placeholder:text-espresso/25 text-sm outline-none transition-all duration-300 focus:border-coffee focus:ring-2 focus:ring-coffee/10 focus:shadow-sm"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 rounded-xl border border-coffee/30 text-coffee text-sm font-medium transition-all duration-300 hover:bg-coffee/5 hover:border-coffee"
                  >
                    Send OTP
                  </button>

                  {otpSent && (
                    <motion.div
                      className="p-4 rounded-xl bg-coffee/5 border border-coffee/20 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs text-espresso/50 text-center">
                        OTP sent to {phone || 'your phone'}
                      </p>

                      <div className="text-center">
                        <span className="text-2xl font-mono font-bold text-coffee tracking-[0.25em]">
                          {generatedOtp}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs text-espresso/50 mb-1.5">
                          Enter OTP to verify
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-sand/30 text-espresso text-sm text-center font-mono tracking-widest outline-none focus:border-coffee focus:ring-2 focus:ring-coffee/10"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-4 py-2.5 rounded-lg bg-espresso text-cream text-sm font-medium hover:bg-chocolate transition-colors"
                          >
                            Verify
                          </button>
                        </div>
                      </div>

                      {otpVerified && (
                        <motion.p
                          className="text-xs text-center text-green-600 font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Phone verified successfully
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-espresso text-cream text-sm font-medium shadow-sm transition-all duration-300 hover:bg-chocolate hover:shadow-md"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </motion.form>

          {oauthError && (
            <motion.div
              className="mt-4 rounded-xl bg-red-50 border border-red-200/60 p-3 flex items-center gap-2.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="text-[13px] text-red-600">{oauthError}</span>
            </motion.div>
          )}

          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-sand/30" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#F5F0E8] text-espresso/40">or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-white border border-sand/30 text-sm font-medium text-espresso/70 transition-all duration-300 hover:border-coffee/30 hover:shadow-sm min-h-[48px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-white border border-sand/30 text-sm font-medium text-espresso/70 transition-all duration-300 hover:border-coffee/30 hover:shadow-sm min-h-[48px]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </motion.div>

          <motion.p
            className="mt-8 text-center text-sm text-espresso/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {mode === 'signin' ? (
              <>Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setMode('signup')} className="text-coffee hover:text-espresso font-medium transition-colors">
                  Create one
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" onClick={() => setMode('signin')} className="text-coffee hover:text-espresso font-medium transition-colors">
                  Sign in
                </button>
              </>
            )}
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

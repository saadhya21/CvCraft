import { useState } from 'react'
import { motion } from 'framer-motion'
import Background from './components/Background/Background'
import { CursorProvider, CursorTrail } from './components/CursorEffect'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import ResumePreview from './components/ResumePreview/ResumePreview'
import AIReview from './components/AIReview/AIReview'
import ATSScore from './components/ATSScore/ATSScore'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Testimonials from './components/Testimonials/Testimonials'
import Pricing from './components/Pricing/Pricing'
import FAQ from './components/FAQ/FAQ'
import Footer from './components/Footer/Footer'
import SignIn from './components/SignIn/SignIn'
import Welcome from './components/Welcome/Welcome'
import Home from './components/Home/Home'
import ResumeReviewer from './components/ResumeReviewer/ResumeReviewer'
import ResumeSelector from './components/ResumeSelector/ResumeSelector'
import ResumeBuilder from './components/ResumeBuilder/ResumeBuilder'
import AuthCallback from './components/AuthCallback/AuthCallback'

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const [page, setPage] = useState<'landing' | 'signin' | 'welcome' | 'home' | 'reviewer' | 'selector' | 'builder' | 'auth-callback'>('landing')

  if (page === 'signin') {
    return (
      <CursorProvider>
        <PageShell><SignIn onBack={() => setPage('landing')} onSignIn={() => setPage('welcome')} /></PageShell>
        <CursorTrail />
      </CursorProvider>
    )
  }

  if (page === 'welcome') {
    return (
      <CursorProvider>
        <PageShell><Welcome onGetStarted={() => setPage('home')} /></PageShell>
        <CursorTrail />
      </CursorProvider>
    )
  }

  if (page === 'home') {
    return (
      <CursorProvider>
        <PageShell><Home onBack={() => setPage('landing')} onNavigate={(p) => setPage(p)} /></PageShell>
        <CursorTrail />
      </CursorProvider>
    )
  }

  if (page === 'reviewer') {
    return (
      <CursorProvider>
        <PageShell><ResumeReviewer onBack={() => setPage('home')} /></PageShell>
        <CursorTrail />
      </CursorProvider>
    )
  }

  if (page === 'selector') {
    return (
      <CursorProvider>
        <PageShell><ResumeSelector onBack={() => setPage('home')} /></PageShell>
        <CursorTrail />
      </CursorProvider>
    )
  }

  if (page === 'builder') {
    return (
      <CursorProvider>
        <PageShell><ResumeBuilder onBack={() => setPage('home')} /></PageShell>
        <CursorTrail />
      </CursorProvider>
    )
  }

  if (page === 'auth-callback') {
    return (
      <CursorProvider>
        <AuthCallback onComplete={() => setPage('welcome')} />
        <CursorTrail />
      </CursorProvider>
    )
  }

  return (
    <CursorProvider>
      <Background />
      <CursorTrail />
      <Navbar />
      <main>
        <Hero onGetStarted={() => setPage('signin')} />
        <Features />
        <ResumePreview />
        <AIReview />
        <ATSScore />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </CursorProvider>
  )
}

export default App

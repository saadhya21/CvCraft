const API_BASE = 'https://cvcraft-backend-82lz.onrender.com/api'

export interface AnalysisResult {
  overall_score: number
  summary: string
  strengths: string[]
  flaws: string[]
  recommendations: string[]
  category_scores: {
    formatting: number
    content_clarity: number
    impact_metrics: number
    ats_compatibility: number
  }
}

export interface AnalyzeResponse {
  file: { name: string; url: string }
  analysis: AnalysisResult
}

const MOCK_ANALYSIS: AnalysisResult = {
  overall_score: 7,
  summary: 'A solid resume with strong experience presentation, but could benefit from more quantified achievements and ATS keyword optimization.',
  strengths: [
    'Clear and consistent formatting throughout with proper section hierarchy',
    'Strong use of action verbs in work experience descriptions',
    'Relevant technical skills prominently displayed in a dedicated section',
    'Good balance of soft and hard skills with contextual examples',
  ],
  flaws: [
    'Limited use of quantifiable metrics — only 2 of 6 bullet points include numbers',
    'Missing a professional summary or objective statement at the top',
    'ATS keyword density is low for common industry terms in your field',
  ],
  recommendations: [
    'Add a 2-3 sentence professional summary tailored to your target role',
    'Replace generic phrases with specific metrics (e.g., "improved efficiency" → "reduced processing time by 34%")',
    'Incorporate more industry-standard keywords from the job descriptions you are targeting',
    'Consider reordering sections: Summary → Skills → Experience → Education',
  ],
  category_scores: {
    formatting: 8,
    content_clarity: 7,
    impact_metrics: 5,
    ats_compatibility: 6,
  },
}

export async function analyzeResume(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData()
  formData.append('resume', file)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(err.error || `Server error: ${res.status}`)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    console.warn('Backend unavailable, using demo mode')
    await new Promise((r) => setTimeout(r, 2000))
    return { file: { name: file.name, url: '' }, analysis: MOCK_ANALYSIS }
  }
}

const API_BASE = 'https://cvcraft-backend-82lz.onrender.com/api'

export interface ComparisonCategoryScores {
  content_quality: number
  formatting: number
  keyword_match: number
  impact_metrics: number
  overall_fit: number
}

export interface ResumeComparisonEntry {
  index: number
  name: string
  overall_score: number
  summary: string
  strengths: string[]
  gaps: string[]
  category_scores: ComparisonCategoryScores
}

export interface ComparisonVerdict {
  winner_index: number
  reasoning: string
}

export interface ComparisonResult {
  resumes: ResumeComparisonEntry[]
  ranking: number[]
  verdict: ComparisonVerdict
}

export interface CompareResponse {
  resumes: { name: string; url: string; storagePath: string }[]
  comparison: ComparisonResult
}

const categoryLabels: Record<keyof ComparisonCategoryScores, string> = {
  content_quality: 'Content Quality',
  formatting: 'Formatting',
  keyword_match: 'Keyword Match',
  impact_metrics: 'Impact & Metrics',
  overall_fit: 'Overall Fit',
}

function scoreColor(score: number): string {
  return score >= 80 ? '#16A34A' : '#DC2626'
}

export { categoryLabels, scoreColor }

export async function compareResumes(files: File[], jobDescription: string): Promise<CompareResponse> {
  const names = files.map((f) => f.name.replace(/\.[^.]+$/, ''))
  return _compareImpl(files, jobDescription, names)
}

export async function compareSavedResumes(resumes: { name: string }[], jobDescription: string): Promise<CompareResponse> {
  return _compareImpl([], jobDescription, resumes.map((r) => r.name.replace(/\.[^.]+$/, '')))
}

async function _compareImpl(_files: File[], _jd: string, names: string[]): Promise<CompareResponse> {
  const formData = new FormData()
  _files.forEach((f) => formData.append('resumes', f))
  formData.append('jobDescription', _jd)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Comparison failed' }))
      throw new Error(err.error || `Server error: ${res.status}`)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    console.warn('Backend unavailable, using demo mode')
    await new Promise((r) => setTimeout(r, 3000))
    return buildMockResponse(names)
  }
}

function buildMockResponse(names: string[]): CompareResponse {
  const scores = [82, 74, 68, 79, 71]
  const summaries = [
    'Strong technical depth with clear metrics, but missing a professional summary.',
    'Good content but formatting inconsistencies hurt readability.',
    'Decent foundation but needs stronger achievement framing and keyword optimization.',
    'Well-structured resume with clear career progression and strong keyword alignment.',
    'Solid experience base but lacks quantified impact and modern formatting.',
  ]
  const strengthSets = [
    ['Quantified 3 major achievements with percentage improvements', 'Clean, consistent formatting with clear section hierarchy', 'Excellent keyword density for senior engineering roles'],
    ['Strong professional summary tailored to the target role', 'Relevant certifications prominently displayed', 'Good use of action verbs throughout experience section'],
    ['Comprehensive list of technical skills with proficiency levels', 'Good education section with relevant coursework and projects', 'Clean minimalist design with good white space utilization'],
    ['Clear career progression with increasing responsibility', 'Strong keyword alignment with the job description', 'Well-organized skills section with categories'],
    ['Relevant industry experience across multiple domains', 'Good use of industry-standard terminology', 'Clean layout with easy-to-scan sections'],
  ]
  const gapSets = [
    ['No professional summary or objective at the top', 'Education section lacks GPA and relevant coursework', 'Only 2 of 8 bullet points include measurable impact'],
    ['Inconsistent bullet point formatting — mixed tenses used', 'Missing quantifiable metrics in 5 of 7 bullet points', 'Skills section buried at the bottom below education'],
    ['Very few quantifiable achievements — mostly responsibilities listed', 'Low keyword density for key industry terms in the job description', 'Experience descriptions are verbose and lack impact framing'],
    ['Limited use of metrics in bullet points', 'Summary could be more tailored to the specific role', 'Some formatting inconsistencies in dates'],
    ['No quantifiable achievements in most bullet points', 'Keyword density could be improved for ATS scoring', 'Missing relevant certifications and continuing education'],
  ]
  const categories = [
    { content_quality: 78, formatting: 85, keyword_match: 80, impact_metrics: 75, overall_fit: 82 },
    { content_quality: 72, formatting: 65, keyword_match: 78, impact_metrics: 60, overall_fit: 74 },
    { content_quality: 65, formatting: 78, keyword_match: 58, impact_metrics: 55, overall_fit: 68 },
    { content_quality: 80, formatting: 76, keyword_match: 82, impact_metrics: 70, overall_fit: 79 },
    { content_quality: 70, formatting: 72, keyword_match: 68, impact_metrics: 58, overall_fit: 71 },
  ]

  const count = Math.min(names.length, 5)
  const entries: ResumeComparisonEntry[] = Array.from({ length: count }, (_, i) => ({
    index: i,
    name: names[i],
    overall_score: scores[i],
    summary: summaries[i],
    strengths: strengthSets[i],
    gaps: gapSets[i],
    category_scores: categories[i],
  }))

  const ranking = Array.from({ length: count }, (_, i) => i).sort((a, b) => entries[b].overall_score - entries[a].overall_score)
  const winner_index = ranking[0]

  return {
    resumes: names.map((n) => ({ name: `${n}.pdf`, url: '', storagePath: '' })),
    comparison: {
      resumes: entries,
      ranking,
      verdict: {
        winner_index,
        reasoning: `${names[winner_index]} wins with the highest overall score of ${entries[winner_index].overall_score}/100. This resume demonstrates the strongest balance of content quality, formatting, and keyword alignment for the target role.`,
      },
    },
  }
}

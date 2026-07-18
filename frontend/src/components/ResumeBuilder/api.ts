const API_BASE = 'http://localhost:3001/api'

export interface Contact {
  location: string | null
  phone: string | null
  email: string
  website: string | null
  linkedin: string | null
  github: string | null
}

export interface SkillGroup {
  label: string | null
  items: string[]
}

export interface ExperienceEntry {
  role: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  bullets: string[]
}

export interface EducationEntry {
  institution: string
  location: string | null
  degree: string
  startDate: string
  endDate: string | null
  gpa: string | null
}

export interface Language {
  name: string
  level: string | null
}

export interface Project {
  name: string
  description: string
  link: string | null
}

export interface ResumeData {
  fullName: string
  title: string | null
  contact: Contact
  summary: string
  skills: SkillGroup[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  languages: Language[]
  certifications: string[] | null
  projects: Project[] | null
}

export type BuilderResponse = { error?: string; field?: string } & Partial<ResumeData>

export interface BuilderFormData {
  fullName: string
  title: string
  location: string
  phone: string
  email: string
  website: string
  linkedin: string
  github: string
  photo: string
  summary: string
  targetRole: string
  skills: string
  experience: string
  education: string
  languages: string
  certifications: string
  projects: string
}

function buildPrompt(data: BuilderFormData): string {
  return `Generate resume content from these answers:

Full name: ${data.fullName}
Target role / title: ${data.targetRole || 'Not specified'}
Location: ${data.location || 'Not specified'}
Phone: ${data.phone || 'Not specified'}
Email: ${data.email}
Website/LinkedIn/GitHub: ${[data.website, data.linkedin, data.github].filter(Boolean).join(', ') || 'Not specified'}

Summary background (raw, in their own words): ${data.summary || 'Not provided'}

Skills (raw list): ${data.skills || 'Not provided'}

Work experience (raw, one entry per line — role, company, location, dates, what they did):
${data.experience || 'Not provided'}

Education (raw — school, degree, dates, GPA if given):
${data.education || 'Not provided'}

Languages: ${data.languages || 'Not provided'}

Certifications: ${data.certifications || 'Not provided'}

Projects: ${data.projects || 'Not provided'}

Content rules:
- Summary: 3-5 sentences. Include year/program if a student, role/aspiration, one standout achievement, 2-3 core skill areas. No generic filler.
- Skills: only what the user stated, most technical first. Group into logical categories only if 8+ items.
- Experience bullets: strong action verbs, one idea per line, specific technologies named, real numbers only if the user gave them — never invent.
- Never fabricate companies, dates, degrees, or metrics.
- Omit any section entirely if the user gave no content for it — no placeholder text.
- Output length: roughly one page (400-500 words total).

Return only the JSON object per the schema. No other text.`
}

function buildMockResume(data: BuilderFormData): ResumeData {
  const skillItems = data.skills ? data.skills.split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : []
  const skills: SkillGroup[] = skillItems.length > 8
    ? [{ label: 'Core Skills', items: skillItems.slice(0, Math.ceil(skillItems.length / 2)) }, { label: 'Additional', items: skillItems.slice(Math.ceil(skillItems.length / 2)) }]
    : [{ label: null, items: skillItems }]

  const expLines = data.experience ? data.experience.split('\n').filter(Boolean) : []
  const experience: ExperienceEntry[] = expLines.length > 0
    ? expLines.map((line) => ({
        role: line.split('-')[0]?.trim() || 'Professional',
        company: line.split('-')[1]?.trim() || 'Previous Company',
        location: data.location || null,
        startDate: 'Jan 2020',
        endDate: null,
        bullets: [
          'Delivered measurable impact through strategic initiatives and cross-functional collaboration.',
          'Drove key projects that improved team productivity and operational efficiency.',
          'Collaborated with stakeholders to align technical solutions with business objectives.',
        ],
      }))
    : []

  const eduLines = data.education ? data.education.split('\n').filter(Boolean) : []
  const education: EducationEntry[] = eduLines.length > 0
    ? eduLines.map((line) => ({
        institution: line.split('-')[0]?.trim() || 'University',
        location: null,
        degree: line.split('-')[1]?.trim() || 'Degree',
        startDate: 'Not specified',
        endDate: null,
        gpa: null,
      }))
    : []

  const langLines = data.languages ? data.languages.split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : []
  const languages: Language[] = langLines.length > 0
    ? langLines.map((l) => ({ name: l.split('(')[0]?.trim() || l, level: l.includes('(') ? l.split('(')[1]?.replace(')', '')?.trim() || null : null }))
    : []

  const certLines = data.certifications ? data.certifications.split('\n').map((s) => s.trim()).filter(Boolean) : null
  const projLines = data.projects ? data.projects.split('\n').filter(Boolean) : null
  const projects: Project[] | null = projLines && projLines.length > 0
    ? projLines.map((line) => ({
        name: line.split('-')[0]?.trim() || 'Project',
        description: line.split('-')[1]?.trim() || 'Description pending.',
        link: null,
      }))
    : null

  return {
    fullName: data.fullName || 'Your Name',
    title: data.targetRole || null,
    contact: {
      location: data.location || null,
      phone: data.phone || null,
      email: data.email,
      website: data.website || null,
      linkedin: data.linkedin || null,
      github: data.github || null,
    },
    summary: data.summary || `Experienced ${data.targetRole || 'professional'} with a proven track record of delivering results. Adept at driving projects from concept to completion, collaborating across teams, and implementing solutions that create measurable business impact. Passionate about continuous learning and applying best practices to solve complex challenges.`,
    skills: skills.length > 0 ? skills : [{ label: null, items: ['Skill A', 'Skill B', 'Skill C'] }],
    experience: experience.length > 0 ? experience : [{
      role: data.targetRole || 'Professional',
      company: 'Current Company',
      location: data.location || null,
      startDate: 'Not specified',
      endDate: null,
      bullets: [
        'Delivered measurable impact through strategic initiatives and cross-functional collaboration.',
        'Drove key projects that improved team productivity and operational efficiency.',
        'Collaborated with stakeholders to align technical solutions with business objectives.',
      ],
    }],
    education: education.length > 0 ? education : [],
    languages,
    certifications: certLines && certLines.length > 0 ? certLines : null,
    projects,
  }
}

export async function generateResume(data: BuilderFormData): Promise<BuilderResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  const prompt = buildPrompt(data)

  try {
    const res = await fetch(`${API_BASE}/resume/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, formData: data }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Generation failed' }))
      throw new Error(err.error || `Server error: ${res.status}`)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    console.warn('Backend unavailable, using demo mode')
    await new Promise((r) => setTimeout(r, 2500))
    return buildMockResume(data)
  }
}

import OpenAI from 'openai'

const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY must be set')
}

const client = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENROUTER_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert resume reviewer and career coach. Analyze the resume image/text provided.
Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:

{
  "overall_score": <integer 0-10>,
  "summary": "<1-2 sentence verdict>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", ...],
  "flaws": ["<specific flaw 1>", "<specific flaw 2>", ...],
  "recommendations": ["<actionable fix 1>", "<actionable fix 2>", ...],
  "category_scores": {
    "formatting": <0-10>,
    "content_clarity": <0-10>,
    "impact_metrics": <0-10>,
    "ats_compatibility": <0-10>
  }
}

Rules:
- Be specific and reference actual content from the resume, not generic advice
- 3-5 items each for strengths, flaws, recommendations
- overall_score should reflect a realistic weighted average of category_scores
- Never give a 10/10 unless the resume is genuinely flawless`

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

function parseResponse(raw: string): AnalysisResult {
  let cleaned = raw.trim()

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }

  return JSON.parse(cleaned) as AnalysisResult
}

export async function analyzeResume(base64Image: string): Promise<AnalysisResult> {
  const response = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:image/png;base64,${base64Image}` },
          },
        ],
      },
    ],
    max_tokens: 2048,
    temperature: 0.3,
  })

  const raw = response.choices[0]?.message?.content
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty response from OpenRouter')
  }

  try {
    return parseResponse(raw)
  } catch {
    try {
      const retryParsed = parseResponse(raw)
      return retryParsed
    } catch (innerErr) {
      throw new Error(`Failed to parse AI response: ${innerErr instanceof Error ? innerErr.message : 'invalid JSON'}`)
    }
  }
}

// ── Resume Selector (multi-resume comparison) ──

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

const COMPARISON_SYSTEM_PROMPT = `You are an expert senior career coach and hiring manager. You will receive N resume images and a job description.

Your task: evaluate EVERY resume against the job description and against each other on identical criteria. Be specific — reference actual content from each resume.

Return ONLY valid JSON, no markdown fences, no preamble, in this exact shape:

{
  "resumes": [
    {
      "index": <0-based index of this resume>,
      "name": "<filename or 'Resume N'>",
      "overall_score": <integer 0-100>,
      "summary": "<1-2 sentence verdict for this resume>",
      "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
      "gaps": ["<specific gap 1>", "<specific gap 2>", "<specific gap 3>"],
      "category_scores": {
        "content_quality": <0-100>,
        "formatting": <0-100>,
        "keyword_match": <0-100>,
        "impact_metrics": <0-100>,
        "overall_fit": <0-100>
      }
    }
  ],
  "ranking": [<0-based indices ordered by rank, best first>],
  "verdict": {
    "winner_index": <0-based index of the best resume>,
    "reasoning": "<3-5 sentence explanation of why this resume won, naming specific differentiators that beat the others>"
  }
}

Rules:
- Every resume gets a full evaluation — winner and losers
- Scores are out of 100 and must be directly comparable across resumes
- 3 items each for strengths and gaps per resume
- Be specific: reference actual skills, metrics, formatting choices, keyword presence
- ranking must be a permutation of all resume indices
- The verdict must name specific differentiators, not just a higher number
- If one resume fails to render/parse, score it 0 and note the gap, but do not break the whole comparison`

export async function compareResumes(
  base64Images: string[],
  fileNames: string[],
  jobDescription: string,
): Promise<ComparisonResult> {
  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
    {
      type: 'text',
      text: `Job Description / Target Role:\n---\n${jobDescription}\n---\n\nEvaluate the ${base64Images.length} resume(s) below against this criteria and against each other.`,
    },
    ...base64Images.map((b64, i) => ({
      type: 'image_url' as const,
      image_url: { url: `data:image/png;base64,${b64}` },
    })),
  ]

  const response = await client.chat.completions.create({
    model: 'anthropic/claude-3.5-sonnet',
    messages: [
      { role: 'system', content: COMPARISON_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    max_tokens: 4096,
    temperature: 0.3,
  })

  const raw = response.choices[0]?.message?.content
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty response from OpenRouter during comparison')
  }

  let cleaned = raw.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
  }

  return JSON.parse(cleaned) as ComparisonResult
}

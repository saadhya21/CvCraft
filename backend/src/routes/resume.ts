import { Router } from 'express'
import sharp from 'sharp'
import { upload } from '../middleware/upload.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { uploadFile } from '../services/supabase.js'
import { analyzeResume } from '../services/openrouter.js'

const router = Router()

router.post(
  '/analyze',
  upload.single('resume'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const { buffer, originalname, mimetype } = req.file
    const timestamp = Date.now()
    const safeName = `${timestamp}-${originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    let imageBuffer: Buffer

    if (mimetype === 'application/pdf') {
      imageBuffer = await sharp(buffer, { page: 0, pages: 1 }).png().toBuffer()
    } else {
      imageBuffer = buffer
    }

    let storageUrl = ''
    try { storageUrl = await uploadFile(buffer, safeName, mimetype) } catch { /* storage optional */ }

    const pngBuffer = await sharp(imageBuffer)
      .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()

    const base64Image = pngBuffer.toString('base64')
    const analysis = await analyzeResume(base64Image)

    res.json({ file: { name: originalname, url: storageUrl }, analysis })
  })
)

router.post(
  '/generate',
  asyncHandler(async (req, res) => {
    const { prompt } = req.body
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' })
      return
    }

    const { default: OpenAI } = await import('openai')
    const key = process.env.OPENROUTER_API_KEY
    if (!key) { res.status(500).json({ error: 'AI not configured' }); return }

    const client = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: key,
    })

    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert resume writer. Return ONLY valid JSON matching the requested resume structure.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0.3,
    })

    const raw = response.choices[0]?.message?.content
    if (!raw) { res.status(500).json({ error: 'Empty AI response' }); return }

    let cleaned = raw.trim()
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')

    res.json(JSON.parse(cleaned))
  })
)

export default router

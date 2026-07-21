import { Router } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { uploadFile } from '../services/supabase.js'
import { compareResumes } from '../services/openrouter.js'

const MEGABYTE = 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * MEGABYTE, files: 5 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/heic',
      'image/heif',
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Unsupported file type. Only PDF, PNG, JPG, and HEIC are allowed.'))
    }
  },
})

const router = Router()

router.post(
  '/compare',
  upload.array('resumes', 5),
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined
    const jobDescription = (req.body.jobDescription || '').trim()

    if (!files || files.length < 2) {
      res.status(400).json({ error: 'Upload at least 2 resumes' })
      return
    }

    if (!jobDescription) {
      res.status(400).json({ error: 'Job description is required' })
      return
    }

    const timestamp = Date.now()
    const uploadPromises = files.map(async (file) => {
      const safeName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      try { const url = await uploadFile(file.buffer, safeName, file.mimetype); return { name: file.originalname, url, storagePath: safeName } }
      catch { return { name: file.originalname, url: '', storagePath: safeName } }
    })

    const uploaded = await Promise.all(uploadPromises)

    const pngPromises = files.map(async (file) => {
      let imgBuffer = file.buffer

      if (file.mimetype === 'application/pdf') {
        imgBuffer = await sharp(imgBuffer, { page: 0, pages: 1 }).png().toBuffer()
      }

      return sharp(imgBuffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer()
    })

    const pngBuffers = await Promise.all(pngPromises)
    const base64Images = pngBuffers.map((b) => b.toString('base64'))
    const fileNames = files.map((f) => f.originalname)

    console.log(`Comparing ${base64Images.length} resumes, images total size: ${(base64Images.reduce((s, b) => s + b.length, 0) / 1024).toFixed(0)}KB`)
    let comparisonResult
    try {
      comparisonResult = await compareResumes(base64Images, fileNames, jobDescription)
    } catch (err) {
      console.error('AI comparison error:', err)
      res.status(500).json({ error: `AI comparison failed: ${err instanceof Error ? err.message : 'unknown error'}` })
      return
    }

    res.json({
      resumes: uploaded,
      comparison: comparisonResult,
    })
  }),
)

export default router

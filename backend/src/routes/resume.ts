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
    let storageMime: string

    if (mimetype === 'application/pdf') {
      const page = await sharp(buffer, { page: 0, pages: 1 })
        .png()
        .toBuffer()
      imageBuffer = page
      storageMime = 'image/png'
    } else {
      imageBuffer = buffer
      storageMime = mimetype
    }

    const storageUrl = await uploadFile(buffer, safeName, mimetype)

    const pngBuffer = await sharp(imageBuffer)
      .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()

    const base64Image = pngBuffer.toString('base64')
    const analysis = await analyzeResume(base64Image)

    res.json({
      file: { name: originalname, url: storageUrl },
      analysis,
    })
  })
)

export default router

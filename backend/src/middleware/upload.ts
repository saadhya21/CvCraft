import multer from 'multer'

const MEGABYTE = 1024 * 1024

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * MEGABYTE, files: 1 },
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

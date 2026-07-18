import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import resumeRouter from './routes/resume.js'
import compareRouter from './routes/compare.js'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.use('/api/resume', resumeRouter)
app.use('/api', compareRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`CvCraft backend running on http://localhost:${PORT}`)
})

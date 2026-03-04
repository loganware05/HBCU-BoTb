import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import router from './routes/index.js'
import { errorMiddleware } from './middleware/error.js'
import { errorResponse } from '@repo/shared'

export function createServer() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  )
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (env.isDev) {
    app.use(morgan('dev'))
  } else {
    app.use(morgan('combined'))
  }

  app.use('/api', router)

  app.use((_req, res) => {
    res.status(404).json(errorResponse('NOT_FOUND', 'Route not found'))
  })

  app.use(errorMiddleware)

  return app
}

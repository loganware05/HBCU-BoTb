import { Router } from 'express'
import { successResponse } from '@repo/shared'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'

const router = Router()

router.get('/', async (_req, res) => {
  let dbStatus = 'ok'
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    dbStatus = 'error'
  }

  res.json(
    successResponse({
      status: 'ok',
      env: env.nodeEnv,
      demoMode: env.demoMode,
      db: dbStatus,
      timestamp: new Date().toISOString(),
    })
  )
})

export default router

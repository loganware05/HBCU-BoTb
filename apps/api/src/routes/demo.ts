import { Router } from 'express'
import { successResponse, errorResponse } from '@repo/shared'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import { requireAuth } from '../middleware/auth.js'
import { seedDemoEntities } from '../services/entity.service.js'

const router = Router()

router.post('/reset', requireAuth, async (req, res, next) => {
  if (!env.demoMode) {
    res.status(403).json(errorResponse('FORBIDDEN', 'Demo mode is not enabled'))
    return
  }
  try {
    await prisma.entity.deleteMany({ where: { ownerId: req.auth!.userId } })
    await seedDemoEntities(req.auth!.userId)
    res.json(successResponse({ message: 'Demo data reset successfully' }))
  } catch (err) {
    next(err)
  }
})

export default router

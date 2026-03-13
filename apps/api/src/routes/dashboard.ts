import { Router } from 'express'
import { successResponse } from '@repo/shared'
import { requireAuth } from '../middleware/auth.js'
import { generateDashboardData } from '../services/dashboard.service.js'

const router = Router()

router.get('/data', requireAuth, (_req, res) => {
  res.json(successResponse(generateDashboardData()))
})

export default router

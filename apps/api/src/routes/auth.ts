import { Router } from 'express'
import { LoginRequestSchema, successResponse } from '@repo/shared'
import { validateBody } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import { login, getMe } from '../services/auth.service.js'

const router = Router()

router.post('/login', validateBody(LoginRequestSchema), async (req, res, next) => {
  try {
    const session = await login(req.body.email, req.body.password)
    res.json(successResponse(session))
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (_req, res) => {
  res.json(successResponse({ message: 'Logged out successfully' }))
})

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await getMe(req.auth!.userId)
    res.json(successResponse(user))
  } catch (err) {
    next(err)
  }
})

export default router

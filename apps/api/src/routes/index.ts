import { Router } from 'express'
import healthRouter from './health.js'
import authRouter from './auth.js'
import entitiesRouter from './entities.js'
import demoRouter from './demo.js'

const router = Router()

router.use('/health', healthRouter)
router.use('/v1/auth', authRouter)
router.use('/v1/entities', entitiesRouter)
router.use('/v1/demo', demoRouter)

export default router

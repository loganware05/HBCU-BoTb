import { Router } from 'express'
import healthRouter from './health.js'
import authRouter from './auth.js'
import entitiesRouter from './entities.js'
import demoRouter from './demo.js'
import dashboardRouter from './dashboard.js'

const router = Router()

router.use('/health', healthRouter)
router.use('/v1/auth', authRouter)
router.use('/v1/entities', entitiesRouter)
router.use('/v1/demo', demoRouter)
router.use('/v1/dashboard', dashboardRouter)

export default router

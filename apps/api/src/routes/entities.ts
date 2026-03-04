import { Router } from 'express'
import {
  CreateEntitySchema,
  UpdateEntitySchema,
  ListEntitiesQuerySchema,
  successResponse,
} from '@repo/shared'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  getEntityStats,
} from '../services/entity.service.js'

const router = Router()

router.use(requireAuth)

router.get('/stats', async (req, res, next) => {
  try {
    const stats = await getEntityStats(req.auth!.userId)
    res.json(successResponse(stats))
  } catch (err) {
    next(err)
  }
})

router.get(
  '/',
  validateQuery(ListEntitiesQuerySchema),
  async (req, res, next) => {
    try {
      // @ts-expect-error parsedQuery attached by validateQuery
      const { items, meta } = await listEntities(req.parsedQuery, req.auth!.userId)
      res.json(successResponse(items, meta))
    } catch (err) {
      next(err)
    }
  }
)

router.get('/:id', async (req, res, next) => {
  try {
    const entity = await getEntity(req.params.id!, req.auth!.userId)
    res.json(successResponse(entity))
  } catch (err) {
    next(err)
  }
})

router.post('/', validateBody(CreateEntitySchema), async (req, res, next) => {
  try {
    const entity = await createEntity(req.body, req.auth!.userId)
    res.status(201).json(successResponse(entity))
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', validateBody(UpdateEntitySchema), async (req, res, next) => {
  try {
    const entity = await updateEntity(req.params.id!, req.body, req.auth!.userId)
    res.json(successResponse(entity))
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteEntity(req.params.id!, req.auth!.userId)
    res.json(successResponse({ deleted: true }))
  } catch (err) {
    next(err)
  }
})

export default router

import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema } from 'zod'

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      next(result.error)
      return
    }
    req.body = result.data
    next()
  }
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      next(result.error)
      return
    }
    // @ts-expect-error attaching parsed query
    req.parsedQuery = result.data
    next()
  }
}

import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { errorResponse } from '@repo/shared'
import { env } from '../config/env.js'

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(422).json(
      errorResponse('VALIDATION_ERROR', 'Validation failed', err.flatten().fieldErrors)
    )
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message, err.details))
    return
  }

  console.error(err)

  const message = env.isDev && err instanceof Error ? err.message : 'Internal server error'
  res.status(500).json(errorResponse('INTERNAL_ERROR', message))
}

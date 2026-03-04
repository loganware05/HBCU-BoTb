import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AppError } from './error.js'

export interface AuthPayload {
  userId: string
  email: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'))
    return
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload
    req.auth = payload
    next()
  } catch {
    next(new AppError(401, 'TOKEN_INVALID', 'Invalid or expired token'))
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication required'))
      return
    }
    if (!roles.includes(req.auth.role)) {
      next(new AppError(403, 'FORBIDDEN', 'Insufficient permissions'))
      return
    }
    next()
  }
}

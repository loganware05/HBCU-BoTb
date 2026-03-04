import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import { AppError } from '../middleware/error.js'
import type { AuthPayload } from '../middleware/auth.js'

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password')

  const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role }
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt.toISOString(),
    },
    token,
    expiresAt: expiresAt.toISOString(),
  }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User not found')

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as 'admin' | 'user',
    createdAt: user.createdAt.toISOString(),
  }
}

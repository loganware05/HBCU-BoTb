import { z } from 'zod';
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['admin', 'user']).default('user'),
    createdAt: z.string().datetime(),
});
export const AuthSessionSchema = z.object({
    user: UserSchema,
    token: z.string(),
    expiresAt: z.string().datetime(),
});
export const LoginRequestSchema = z.object({
    email: z.string().email({ message: 'Valid email required' }),
    password: z.string().min(1, { message: 'Password required' }),
});
export const LoginResponseSchema = AuthSessionSchema;

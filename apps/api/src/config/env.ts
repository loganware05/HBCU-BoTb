function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const env = {
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
  port: parseInt(process.env['PORT'] ?? '4000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  isDev: (process.env['NODE_ENV'] ?? 'development') === 'development',
  isProd: process.env['NODE_ENV'] === 'production',
  demoMode: process.env['DEMO_MODE'] === 'true',
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
} as const

import 'dotenv/config'
import { createServer } from './server.js'
import { env } from './config/env.js'
import { prisma } from './lib/prisma.js'

const app = createServer()

async function main() {
  try {
    await prisma.$connect()
    console.info(`✓ Database connected`)
  } catch (err) {
    console.error('✗ Database connection failed:', err)
    process.exit(1)
  }

  app.listen(env.port, () => {
    console.info(`✓ API listening on http://localhost:${env.port}`)
    console.info(`  ENV: ${env.nodeEnv} | Demo mode: ${env.demoMode}`)
  })
}

main()

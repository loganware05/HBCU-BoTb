import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedDemoEntities } from '../src/services/entity.service.js'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@pitch.dev'
const DEMO_PASSWORD = 'demo1234'

async function main() {
  console.info('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10)

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      name: 'Demo User',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.info(`✓ Demo user: ${user.email} / ${DEMO_PASSWORD}`)

  await prisma.entity.deleteMany({ where: { ownerId: user.id } })
  await seedDemoEntities(user.id)

  console.info(`✓ Seeded 10 demo entities`)
  console.info('✓ Seed complete')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

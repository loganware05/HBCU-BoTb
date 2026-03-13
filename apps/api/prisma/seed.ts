import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { seedDemoEntities } from '../src/services/entity.service.js'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'homedepot@pitch.dev'
const OLD_DEMO_EMAIL = 'demo@pitch.dev'
const DEMO_PASSWORD = 'demo1234'

async function main() {
  console.info('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10)

  // Migrate old demo user to new credentials if it exists
  const oldUser = await prisma.user.findUnique({ where: { email: OLD_DEMO_EMAIL } })
  if (oldUser) {
    await prisma.user.update({
      where: { email: OLD_DEMO_EMAIL },
      data: {
        email: DEMO_EMAIL,
        name: 'Home Depot User',
        password: hashedPassword,
      },
    })
    console.info(`✓ Migrated ${OLD_DEMO_EMAIL} → ${DEMO_EMAIL}`)
  }

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: 'Home Depot User', password: hashedPassword },
    create: {
      email: DEMO_EMAIL,
      name: 'Home Depot User',
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

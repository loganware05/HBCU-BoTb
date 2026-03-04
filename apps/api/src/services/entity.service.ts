import { prisma } from '../lib/prisma.js'
import { AppError } from '../middleware/error.js'
import type {
  CreateEntityInput,
  UpdateEntityInput,
  ListEntitiesQuery,
  EntityStatus,
  EntityPriority,
} from '@repo/shared'

function formatEntity(e: {
  id: string
  title: string
  status: string
  priority: string
  tags: string[]
  description: string | null
  score: number | null
  deadline: Date | null
  ownerId: string
  owner: { name: string }
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: e.id,
    title: e.title,
    status: e.status as EntityStatus,
    priority: e.priority as EntityPriority,
    tags: e.tags,
    description: e.description,
    score: e.score,
    deadline: e.deadline?.toISOString() ?? null,
    ownerId: e.ownerId,
    ownerName: e.owner.name,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }
}

export async function listEntities(query: ListEntitiesQuery, userId: string) {
  const { page, pageSize, status, priority, search, sortBy, sortDir } = query

  const where = {
    ownerId: userId,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [total, items] = await Promise.all([
    prisma.entity.count({ where }),
    prisma.entity.findMany({
      where,
      include: { owner: { select: { name: true } } },
      orderBy: { [sortBy]: sortDir },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return {
    items: items.map(formatEntity),
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

export async function getEntity(id: string, userId: string) {
  const entity = await prisma.entity.findFirst({
    where: { id, ownerId: userId },
    include: { owner: { select: { name: true } } },
  })
  if (!entity) throw new AppError(404, 'NOT_FOUND', 'Entity not found')
  return formatEntity(entity)
}

export async function createEntity(input: CreateEntityInput, userId: string) {
  const entity = await prisma.entity.create({
    data: {
      title: input.title,
      status: input.status ?? 'active',
      priority: input.priority ?? 'medium',
      tags: input.tags ?? [],
      description: input.description ?? null,
      score: input.score ?? null,
      deadline: input.deadline ? new Date(input.deadline) : null,
      ownerId: userId,
    },
    include: { owner: { select: { name: true } } },
  })
  return formatEntity(entity)
}

export async function updateEntity(id: string, input: UpdateEntityInput, userId: string) {
  const existing = await prisma.entity.findFirst({ where: { id, ownerId: userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Entity not found')

  const entity = await prisma.entity.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.score !== undefined ? { score: input.score } : {}),
      ...(input.deadline !== undefined ? { deadline: new Date(input.deadline) } : {}),
    },
    include: { owner: { select: { name: true } } },
  })
  return formatEntity(entity)
}

export async function deleteEntity(id: string, userId: string) {
  const existing = await prisma.entity.findFirst({ where: { id, ownerId: userId } })
  if (!existing) throw new AppError(404, 'NOT_FOUND', 'Entity not found')
  await prisma.entity.delete({ where: { id } })
}

const DEMO_ENTITY_DATA = [
  { title: 'Launch community outreach program', status: 'active', priority: 'high', tags: ['community', 'outreach', 'strategy'], description: 'Build partnerships with 5 local organizations to expand reach by Q3.', score: 87, deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { title: 'Develop MVP feature set', status: 'in_progress', priority: 'critical', tags: ['product', 'mvp', 'dev'], description: 'Core CRUD operations, auth, and demo mode ready for pitch.', score: 92, deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { title: 'Finalize pitch deck slides', status: 'in_progress', priority: 'high', tags: ['pitch', 'design', 'slides'], description: 'Problem, solution, market size, traction, and ask slides.', score: 74, deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { title: 'User interview research synthesis', status: 'completed', priority: 'medium', tags: ['research', 'ux', 'interviews'], description: 'Synthesized findings from 12 user interviews into actionable insights.', score: 95, deadline: null },
  { title: 'Set up analytics dashboard', status: 'active', priority: 'medium', tags: ['analytics', 'metrics', 'data'], description: 'Track key activation and retention metrics post-launch.', score: 60, deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  { title: 'Recruit founding team members', status: 'active', priority: 'high', tags: ['team', 'hiring', 'founding'], description: 'Looking for a designer and a backend engineer with startup experience.', score: 55, deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
  { title: 'Apply for HBCU startup grants', status: 'in_progress', priority: 'critical', tags: ['funding', 'grants', 'hbcu'], description: 'Applications open for three relevant grant programs this semester.', score: 80, deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
  { title: 'Competitive landscape analysis', status: 'completed', priority: 'medium', tags: ['research', 'competitive', 'market'], description: 'Identified 8 direct competitors and our key differentiators.', score: 88, deadline: null },
  { title: 'Build waitlist landing page', status: 'completed', priority: 'high', tags: ['marketing', 'landing', 'waitlist'], description: 'Collected 340 signups in first week.', score: 91, deadline: null },
  { title: 'Legal entity formation', status: 'archived', priority: 'low', tags: ['legal', 'admin', 'setup'], description: 'LLC registered. Revisit for C-Corp conversion before Series A.', score: 70, deadline: null },
] as const

export async function seedDemoEntities(userId: string) {
  await prisma.entity.createMany({
    data: DEMO_ENTITY_DATA.map(e => ({
      title: e.title,
      status: e.status,
      priority: e.priority,
      tags: [...e.tags],
      description: e.description,
      score: e.score,
      deadline: e.deadline,
      ownerId: userId,
    })),
  })
}

export async function getEntityStats(userId: string) {
  const entities = await prisma.entity.findMany({ where: { ownerId: userId } })

  const total = entities.length
  const byStatus = entities.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1
    return acc
  }, {})
  const avgScore =
    entities.filter(e => e.score !== null).length > 0
      ? Math.round(
          entities.filter(e => e.score !== null).reduce((s, e) => s + (e.score ?? 0), 0) /
            entities.filter(e => e.score !== null).length
        )
      : null
  const highPriority = entities.filter(e => e.priority === 'high' || e.priority === 'critical').length

  return { total, byStatus, avgScore, highPriority }
}

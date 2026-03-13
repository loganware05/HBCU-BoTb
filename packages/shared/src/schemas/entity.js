import { z } from 'zod';
// ─── Status and Priority enums (customise values in app.config.ts display) ───
export const EntityStatusSchema = z.enum(['active', 'in_progress', 'completed', 'archived']);
export const EntityPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
// ─── Core Entity ─────────────────────────────────────────────────────────────
export const EntitySchema = z.object({
    id: z.string(),
    title: z.string(),
    status: EntityStatusSchema,
    priority: EntityPrioritySchema,
    tags: z.array(z.string()),
    description: z.string().nullable(),
    score: z.number().min(0).max(100).nullable(),
    deadline: z.string().datetime().nullable(),
    ownerId: z.string(),
    ownerName: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
// ─── CRUD request schemas ────────────────────────────────────────────────────
export const CreateEntitySchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    status: EntityStatusSchema.optional().default('active'),
    priority: EntityPrioritySchema.optional().default('medium'),
    tags: z.array(z.string()).optional().default([]),
    description: z.string().max(2000).optional(),
    score: z.number().min(0).max(100).optional(),
    deadline: z.string().datetime().optional(),
});
export const UpdateEntitySchema = CreateEntitySchema.partial();
export const ListEntitiesQuerySchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    pageSize: z.coerce.number().min(1).max(100).optional().default(20),
    status: EntityStatusSchema.optional(),
    priority: EntityPrioritySchema.optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'score']).optional().default('createdAt'),
    sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
});

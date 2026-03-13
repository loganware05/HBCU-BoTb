import { z } from 'zod'

// ─── Dashboard (Business / AI Visibility / Competitor) ───────────────────────

export const KPISchema = z.object({
  label: z.string(),
  value: z.string(),
  sub: z.string(),
  trend: z.enum(['up', 'down', 'neutral']),
  accent: z.string(),
})
export type KPI = z.infer<typeof KPISchema>

export const PlatformSchema = z.object({
  name: z.string(),
  mentions: z.number(),
  color: z.string(),
  ctr: z.string(),
  rank: z.string(),
})
export type Platform = z.infer<typeof PlatformSchema>

export const ConvPageSchema = z.object({
  name: z.string(),
  rate: z.number(),
  color: z.string(),
})
export type ConvPage = z.infer<typeof ConvPageSchema>

export const CompetitorSchema = z.object({
  rank: z.number(),
  name: z.string(),
  pct: z.number(),
  avgRank: z.string(),
  color: z.string(),
})
export type Competitor = z.infer<typeof CompetitorSchema>

export const DashboardDataSchema = z.object({
  // Business overview
  kpis: z.array(KPISchema),
  days: z.array(z.string()),
  revenueTrend: z.array(z.number()),
  weekLabels: z.array(z.string()),
  roasByWeek: z.array(z.number()),
  cpaByWeek: z.array(z.number()),
  // AI Visibility
  visibilityMetrics: z.array(KPISchema),
  topLinks: z.array(z.object({ name: z.string(), clicks: z.number() })),
  promptTriggers: z.array(
    z.object({ label: z.string(), mentions: z.number(), clicks: z.number() })
  ),
  conversionPages: z.array(ConvPageSchema),
  // Competitor
  platforms: z.array(PlatformSchema),
  competitors: z.array(CompetitorSchema),
  trendWeeks: z.array(z.string()),
  trendGPT: z.array(z.number()),
  trendGemini: z.array(z.number()),
  trendClaude: z.array(z.number()),
  trendPerplexity: z.array(z.number()),
  generatedAt: z.string(),
})
export type DashboardData = z.infer<typeof DashboardDataSchema>

// ─── Share of Voice ───────────────────────────────────────────────────────────

export const SOVSnapshotSchema = z.object({
  brand: z.string(),
  category: z.string(),
  appearances: z.number(),
  totalQueries: z.number(),
  sovPct: z.number(),
  deltaVsLastWindow: z.number(),
  topTriggerAttribute: z.string(),
  timestamp: z.number(),
})
export type SOVSnapshot = z.infer<typeof SOVSnapshotSchema>

export const ResponseEntrySchema = z.object({
  queryId: z.string(),
  queryText: z.string(),
  category: z.string(),
  rawAiResponse: z.string(),
  brandsMentioned: z.array(z.string()),
  attributesMentioned: z.array(z.string()),
  isoTime: z.string(),
})
export type ResponseEntry = z.infer<typeof ResponseEntrySchema>

export const QueryEventSchema = z.object({
  queryId: z.string(),
  queryText: z.string(),
  category: z.string(),
  timestamp: z.number(),
  brandsMentioned: z.array(z.string()),
  attributesMentioned: z.array(z.string()),
  rawAiResponse: z.string(),
})
export type QueryEvent = z.infer<typeof QueryEventSchema>

export const FeedPayloadSchema = z.object({
  event: QueryEventSchema,
  snapshot: SOVSnapshotSchema,
  isoTime: z.string(),
})
export type FeedPayload = z.infer<typeof FeedPayloadSchema>

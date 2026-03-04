import { z } from 'zod'

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

export const ApiMetaSchema = z.object({
  total: z.number().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  totalPages: z.number().optional(),
})

export type ApiMeta = z.infer<typeof ApiMetaSchema>

export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: ApiErrorSchema.nullable(),
    meta: ApiMetaSchema.optional(),
  })
}

export type ApiResponse<T> = {
  success: boolean
  data: T | null
  error: ApiError | null
  meta?: ApiMeta
}

export function successResponse<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
  return { success: true, data, error: null, meta }
}

export function errorResponse(code: string, message: string, details?: unknown): ApiResponse<null> {
  return { success: false, data: null, error: { code, message, details } }
}

import { z } from 'zod';
export const ApiErrorSchema = z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
});
export const ApiMetaSchema = z.object({
    total: z.number().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
    totalPages: z.number().optional(),
});
export function createApiResponseSchema(dataSchema) {
    return z.object({
        success: z.boolean(),
        data: dataSchema.nullable(),
        error: ApiErrorSchema.nullable(),
        meta: ApiMetaSchema.optional(),
    });
}
export function successResponse(data, meta) {
    return { success: true, data, error: null, meta };
}
export function errorResponse(code, message, details) {
    return { success: false, data: null, error: { code, message, details } };
}

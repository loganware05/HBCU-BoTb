import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authStore } from '../lib/auth-store'
import { createApiClient } from '../lib/api'
import type {
  Entity,
  CreateEntityInput,
  UpdateEntityInput,
  ListEntitiesQuery,
} from '@repo/shared'

const api = createApiClient(authStore.getToken)

export const entityKeys = {
  all: ['entities'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  list: (params: Partial<ListEntitiesQuery>) => [...entityKeys.lists(), params] as const,
  detail: (id: string) => [...entityKeys.all, 'detail', id] as const,
  stats: () => [...entityKeys.all, 'stats'] as const,
}

type StatsResponse = {
  total: number
  byStatus: Record<string, number>
  avgScore: number | null
  highPriority: number
}

export function useEntityStats() {
  return useQuery({
    queryKey: entityKeys.stats(),
    queryFn: () => api.get<StatsResponse>('/v1/entities/stats'),
    staleTime: 30_000,
  })
}

export function useEntities(params: Partial<ListEntitiesQuery> = {}) {
  const qs = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)])
  ).toString()

  return useQuery({
    queryKey: entityKeys.list(params),
    queryFn: () => api.get<Entity[]>(`/v1/entities${qs ? `?${qs}` : ''}`),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}

export function useEntity(id: string) {
  return useQuery({
    queryKey: entityKeys.detail(id),
    queryFn: () => api.get<Entity>(`/v1/entities/${id}`),
    enabled: !!id,
  })
}

export function useCreateEntity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEntityInput) => api.post<Entity>('/v1/entities', input),
    onSuccess: entity => {
      qc.invalidateQueries({ queryKey: entityKeys.lists() })
      qc.invalidateQueries({ queryKey: entityKeys.stats() })
      toast.success(`"${entity.title}" created!`)
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateEntity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEntityInput }) =>
      api.patch<Entity>(`/v1/entities/${id}`, input),
    onSuccess: entity => {
      qc.invalidateQueries({ queryKey: entityKeys.lists() })
      qc.invalidateQueries({ queryKey: entityKeys.detail(entity.id) })
      qc.invalidateQueries({ queryKey: entityKeys.stats() })
      toast.success('Changes saved')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteEntity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.del<{ deleted: boolean }>(`/v1/entities/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: entityKeys.lists() })
      qc.invalidateQueries({ queryKey: entityKeys.stats() })
      toast.success('Deleted')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

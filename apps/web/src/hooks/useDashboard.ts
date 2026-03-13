import { useQuery } from '@tanstack/react-query'
import { authStore } from '../lib/auth-store'
import { createApiClient } from '../lib/api'
import type { DashboardData } from '@repo/shared'

const api = createApiClient(authStore.getToken)

export const dashboardKeys = {
  data: ['dashboard', 'data'] as const,
}

export function useDashboardData() {
  return useQuery({
    queryKey: dashboardKeys.data,
    queryFn: () => api.get<DashboardData>('/v1/dashboard/data'),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })
}

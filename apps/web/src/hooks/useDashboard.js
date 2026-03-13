import { useQuery } from '@tanstack/react-query';
import { authStore } from '../lib/auth-store';
import { createApiClient } from '../lib/api';
const api = createApiClient(authStore.getToken);
export const dashboardKeys = {
    data: ['dashboard', 'data'],
};
export function useDashboardData() {
    return useQuery({
        queryKey: dashboardKeys.data,
        queryFn: () => api.get('/v1/dashboard/data'),
        staleTime: 30000,
        refetchOnWindowFocus: false,
    });
}

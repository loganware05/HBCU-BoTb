import { useQuery, useMutation, useQueryClient, keepPreviousData, } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authStore } from '../lib/auth-store';
import { createApiClient } from '../lib/api';
const api = createApiClient(authStore.getToken);
export const entityKeys = {
    all: ['entities'],
    lists: () => [...entityKeys.all, 'list'],
    list: (params) => [...entityKeys.lists(), params],
    detail: (id) => [...entityKeys.all, 'detail', id],
    stats: () => [...entityKeys.all, 'stats'],
};
export function useEntityStats() {
    return useQuery({
        queryKey: entityKeys.stats(),
        queryFn: () => api.get('/v1/entities/stats'),
        staleTime: 30000,
    });
}
export function useEntities(params = {}) {
    const qs = new URLSearchParams(Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)])).toString();
    return useQuery({
        queryKey: entityKeys.list(params),
        queryFn: () => api.get(`/v1/entities${qs ? `?${qs}` : ''}`),
        placeholderData: keepPreviousData,
        staleTime: 15000,
    });
}
export function useEntity(id) {
    return useQuery({
        queryKey: entityKeys.detail(id),
        queryFn: () => api.get(`/v1/entities/${id}`),
        enabled: !!id,
    });
}
export function useCreateEntity() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (input) => api.post('/v1/entities', input),
        onSuccess: entity => {
            qc.invalidateQueries({ queryKey: entityKeys.lists() });
            qc.invalidateQueries({ queryKey: entityKeys.stats() });
            toast.success(`"${entity.title}" created!`);
        },
        onError: (err) => toast.error(err.message),
    });
}
export function useUpdateEntity() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }) => api.patch(`/v1/entities/${id}`, input),
        onSuccess: entity => {
            qc.invalidateQueries({ queryKey: entityKeys.lists() });
            qc.invalidateQueries({ queryKey: entityKeys.detail(entity.id) });
            qc.invalidateQueries({ queryKey: entityKeys.stats() });
            toast.success('Changes saved');
        },
        onError: (err) => toast.error(err.message),
    });
}
export function useDeleteEntity() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.del(`/v1/entities/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: entityKeys.lists() });
            qc.invalidateQueries({ queryKey: entityKeys.stats() });
            toast.success('Deleted');
        },
        onError: (err) => toast.error(err.message),
    });
}

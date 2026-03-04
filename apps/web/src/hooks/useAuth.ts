import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSyncExternalStore } from 'react'
import toast from 'react-hot-toast'
import { authStore } from '../lib/auth-store'
import { createApiClient } from '../lib/api'
import type { LoginRequest, AuthSession, User } from '@repo/shared'

const api = createApiClient(authStore.getToken)

export function useAuthSession(): AuthSession | null {
  return useSyncExternalStore(authStore.subscribe, authStore.getSession, authStore.getSession)
}

export function useCurrentUser(): User | null {
  const session = useAuthSession()
  return session?.user ?? null
}

export function useIsAuthenticated(): boolean {
  return useAuthSession() !== null
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (creds: LoginRequest) => api.post<AuthSession>('/v1/auth/login', creds),
    onSuccess: session => {
      authStore.setSession(session)
      queryClient.clear()
      toast.success(`Welcome back, ${session.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    authStore.clearSession()
    queryClient.clear()
    navigate('/')
    toast.success('Logged out')
  }
}

export function useMe() {
  const isAuthenticated = useIsAuthenticated()
  return useQuery({
    queryKey: ['me'],
    queryFn: () => api.get<User>('/v1/auth/me'),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

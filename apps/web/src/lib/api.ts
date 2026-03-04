import type { ApiResponse } from '@repo/shared'

const BASE = import.meta.env.VITE_API_URL ?? ''

class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> ?? {}),
  }

  const res = await fetch(`${BASE}/api${path}`, { ...init, headers })
  const json: ApiResponse<T> = await res.json()

  if (!json.success || json.data === null) {
    throw new ApiError(
      json.error?.code ?? 'UNKNOWN',
      json.error?.message ?? 'Request failed',
      res.status
    )
  }

  return json.data as T
}

export function createApiClient(getToken: () => string | null) {
  const get = <T>(path: string) => request<T>(path, { method: 'GET' }, getToken())
  const post = <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, getToken())
  const patch = <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, getToken())
  const del = <T>(path: string) => request<T>(path, { method: 'DELETE' }, getToken())

  return { get, post, patch, del }
}

export { ApiError }

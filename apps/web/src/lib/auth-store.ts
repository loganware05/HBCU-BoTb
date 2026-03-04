import type { AuthSession, User } from '@repo/shared'

const STORAGE_KEY = 'auth_session'

type Listener = () => void

let session: AuthSession | null = null
const listeners = new Set<Listener>()

function loadFromStorage(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: AuthSession = JSON.parse(raw)
    if (new Date(parsed.expiresAt) < new Date()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

session = loadFromStorage()

function notify() {
  listeners.forEach(fn => fn())
}

export const authStore = {
  getSession: (): AuthSession | null => session,
  getToken: (): string | null => session?.token ?? null,
  getUser: (): User | null => session?.user ?? null,

  setSession: (s: AuthSession) => {
    session = s
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    notify()
  },

  clearSession: () => {
    session = null
    localStorage.removeItem(STORAGE_KEY)
    notify()
  },

  subscribe: (fn: Listener) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { appConfig } from '../config/app.config'
import { useLogin, useIsAuthenticated } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DemoBanner } from '../components/DemoBanner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  // Auto-fill in demo mode
  useEffect(() => {
    if (appConfig.demoMode.enabled) {
      setEmail(appConfig.demoMode.email)
      setPassword(appConfig.demoMode.password)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xl font-bold shadow-lg">
              {appConfig.logoText}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in to {appConfig.productName}</h1>
            <p className="mt-1 text-sm text-gray-500">{appConfig.tagline}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
              autoFocus={!appConfig.demoMode.enabled}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={login.isPending}
            >
              Sign in
            </Button>

            {appConfig.demoMode.enabled && (
              <p className="text-center text-xs text-amber-600 bg-amber-50 rounded-lg py-2">
                Demo credentials pre-filled — just click Sign in
              </p>
            )}
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            <Link to="/" className="text-indigo-600 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

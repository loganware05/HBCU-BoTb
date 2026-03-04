import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { appConfig } from '../config/app.config'
import { useLogin } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

const iconMap: Record<string, LucideIcon> = { AlertCircle, Lightbulb, TrendingUp }

export default function Landing() {
  const navigate = useNavigate()
  const login = useLogin()

  function handleStartDemo() {
    login.mutate({
      email: appConfig.demoMode.email,
      password: appConfig.demoMode.password,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
            {appConfig.logoText}
          </div>
          <span className="font-bold text-gray-900 text-lg">{appConfig.productName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Sign in
          </Button>
          {appConfig.demoMode.enabled && (
            <Button size="sm" onClick={handleStartDemo} loading={login.isPending}>
              {appConfig.demoMode.ctaLabel}
            </Button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-24 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Built at HBCU Battle of the Brains
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] sm:text-6xl">
          {appConfig.landing.headline.split('\n').map((line, i) => (
            <span key={i} className={i === 1 ? 'text-indigo-600' : ''}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>

        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {appConfig.landing.subheadline}
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          {appConfig.demoMode.enabled ? (
            <Button size="lg" onClick={handleStartDemo} loading={login.isPending}>
              {appConfig.landing.ctaPrimary}
              <ArrowRight size={18} className="ml-1" />
            </Button>
          ) : (
            <Button size="lg" onClick={() => navigate('/login')}>
              Get started
              <ArrowRight size={18} className="ml-1" />
            </Button>
          )}
          <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
            {appConfig.landing.ctaSecondary}
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-sm text-gray-400">
          340+ founders on the waitlist · Built in 24 hours
        </p>
      </section>

      {/* Feature sections */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {appConfig.landing.sections.map(section => {
              const Icon = iconMap[section.icon] ?? TrendingUp
              return (
                <div key={section.id} className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{section.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to take this to market?
          </h2>
          <p className="mt-4 text-gray-500">
            All the infrastructure is here. Edit{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-indigo-600">
              app.config.ts
            </code>{' '}
            and the whole product updates.
          </p>
          <div className="mt-8">
            {appConfig.demoMode.enabled ? (
              <Button size="lg" onClick={handleStartDemo} loading={login.isPending}>
                {appConfig.landing.ctaPrimary}
                <ArrowRight size={18} className="ml-1" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/login')}>
                Sign in to get started
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <p className="text-center text-sm text-gray-400">
          © 2026 {appConfig.productName} · {appConfig.tagline}
        </p>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import toast from 'react-hot-toast'
import { RotateCcw, User, Shield, Info } from 'lucide-react'
import { appConfig } from '../config/app.config'
import { useCurrentUser, useLogout } from '../hooks/useAuth'
import { authStore } from '../lib/auth-store'
import { createApiClient } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Card, CardBody, CardHeader } from '../components/ui/Card'

const api = createApiClient(authStore.getToken)

export default function Settings() {
  const user = useCurrentUser()
  const logout = useLogout()
  const [resetting, setResetting] = useState(false)

  async function handleResetDemo() {
    if (!confirm('Reset demo data? This will wipe your current items and reseed.')) return
    setResetting(true)
    try {
      await api.post('/v1/demo/reset')
      toast.success('Demo data reset! Refreshing...')
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account and application preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User size={16} />
            Profile
          </div>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-lg font-bold">
              {user?.name.slice(0, 2).toUpperCase() ?? '??'}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role} account</p>
            </div>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* App info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Info size={16} />
            Application
          </div>
        </CardHeader>
        <CardBody>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Product</dt>
              <dd className="font-medium text-gray-900">{appConfig.productName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Entity label</dt>
              <dd className="font-medium text-gray-900">{appConfig.entity.singular}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Demo mode</dt>
              <dd className={appConfig.demoMode.enabled ? 'text-amber-600 font-medium' : 'text-gray-900'}>
                {appConfig.demoMode.enabled ? 'Enabled' : 'Disabled'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">API</dt>
              <dd className="font-medium text-gray-900 font-mono text-xs">
                {import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      {/* Feature flags */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Shield size={16} />
            Feature Flags
          </div>
        </CardHeader>
        <CardBody>
          <dl className="space-y-2 text-sm">
            {Object.entries(appConfig.features).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <dt className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      value
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-500',
                    ].join(' ')}
                  >
                    {value ? 'On' : 'Off'}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-gray-400">
            Edit <code className="font-mono">app.config.ts → features</code> to toggle flags.
          </p>
        </CardBody>
      </Card>

      {/* Demo reset */}
      {appConfig.features.demoReset && appConfig.demoMode.enabled && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <RotateCcw size={16} />
              Demo Controls
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <p className="text-sm text-gray-500">
              Reset all demo data back to the original 10 seeded items. Useful before a judge demo.
            </p>
            <Button
              variant="outline"
              onClick={handleResetDemo}
              loading={resetting}
              leftIcon={<RotateCcw size={14} />}
            >
              Reset Demo Data
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

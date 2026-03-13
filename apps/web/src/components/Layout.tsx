import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  Settings,
  LogOut,
  Layers,
  Flame,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { appConfig } from '../config/app.config'
import { useCurrentUser, useLogout } from '../hooks/useAuth'
import { initials } from '../lib/utils'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Target,
  Settings,
  Layers,
  Flame,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Zap,
}

function NavIcon({ name }: { name: string }) {
  const Icon = iconMap[name] ?? Target
  return <Icon size={18} />
}

const clientBrand = appConfig.clientBrand

export function AppLayout() {
  const user = useCurrentUser()
  const logout = useLogout()
  const navigate = useNavigate()
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <div className={`flex h-screen overflow-hidden ${isDashboard ? 'bg-[#0A1120]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className="flex w-60 flex-shrink-0 flex-col bg-gray-900 text-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: clientBrand.primaryHex }}
          >
            {clientBrand.logoText}
          </div>
          <span className="font-semibold text-white tracking-tight">{clientBrand.productName}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {appConfig.nav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100',
                  isActive ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                  isActive && '!bg-[#F96302]',
                ].filter(Boolean).join(' ')
              }
            >
              <NavIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-800 px-3 py-4">
          {user && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                style={{ background: clientBrand.primaryHex }}
              >
                {initials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar — hidden on Dashboard to remove white space above Visibility dashboard */}
        {!isDashboard && (
          <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 flex-shrink-0">
            <div />
            <div className="flex items-center gap-3">
              {appConfig.demoMode.enabled && (
                <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  <Zap size={10} />
                  {appConfig.demoMode.badgeText}
                </span>
              )}
              <button
                onClick={() => navigate('/settings')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold transition-colors hover:opacity-90"
                style={{ background: clientBrand.primaryHex }}
              >
                {user ? initials(user.name) : '?'}
              </button>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

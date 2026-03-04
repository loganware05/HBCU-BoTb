import { Link } from 'react-router-dom'
import { Layers, Flame, TrendingUp, ArrowRight, type LucideIcon } from 'lucide-react'
import { appConfig } from '../config/app.config'
import { useCurrentUser } from '../hooks/useAuth'
import { useEntityStats, useEntities } from '../hooks/useEntities'
import { StatCard, Card, CardHeader, CardBody } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { SkeletonStatCard, SkeletonList } from '../components/ui/Skeleton'
import { formatRelative } from '../lib/utils'

const iconMap: Record<string, LucideIcon> = { Layers, Flame, TrendingUp }

export default function Dashboard() {
  const user = useCurrentUser()
  const { data: stats, isLoading: statsLoading } = useEntityStats()
  const { data: recent, isLoading: recentLoading } = useEntities({ pageSize: 5 })

  const firstName = user?.name.split(' ')[0] ?? 'there'

  function getMetricValue(key: string): string | number {
    if (!stats) return '—'
    if (key === 'total') return stats.total
    if (key === 'highPriority') return stats.highPriority
    if (key === 'avgScore') return stats.avgScore ?? '—'
    return '—'
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good {getGreeting()}, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's a snapshot of your {appConfig.entity.plural.toLowerCase()}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statsLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)
          : appConfig.dashboard.metrics.map(metric => {
              const Icon = iconMap[metric.icon] ?? Layers
              return (
                <StatCard
                  key={metric.key}
                  label={metric.label}
                  value={getMetricValue(metric.key)}
                  suffix={'suffix' in metric ? metric.suffix as string : undefined}
                  icon={<Icon size={20} />}
                />
              )
            })}
      </div>

      {/* Status breakdown */}
      {stats && !statsLoading && (
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-700">
              {appConfig.entity.plural} by Status
            </h2>
          </CardHeader>
          <CardBody className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Object.entries(appConfig.entity.statusLabels).map(([key, label]) => {
              const count = stats.byStatus[key] ?? 0
              const color = appConfig.entity.statusColors[key] ?? 'gray'
              return (
                <div key={key} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <Badge label={label} color={color} className="mt-1" />
                </div>
              )
            })}
          </CardBody>
        </Card>
      )}

      {/* Recent entities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Recent {appConfig.entity.plural}</h2>
            <Link to="/entities" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {recentLoading ? (
            <div className="p-5">
              <SkeletonList count={3} />
            </div>
          ) : recent && recent.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {recent.map(entity => (
                <li key={entity.id}>
                  <Link
                    to={`/entities/${entity.id}`}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{entity.title}</p>
                      <p className="text-xs text-gray-400">{formatRelative(entity.updatedAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge
                        label={appConfig.entity.statusLabels[entity.status] ?? entity.status}
                        color={appConfig.entity.statusColors[entity.status] ?? 'gray'}
                        dot
                      />
                      <Badge
                        label={appConfig.entity.priorityLabels[entity.priority] ?? entity.priority}
                        color={appConfig.entity.priorityColors[entity.priority] ?? 'gray'}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center text-sm text-gray-400">
              No {appConfig.entity.plural.toLowerCase()} yet.{' '}
              <Link to="/entities" className="text-indigo-600 hover:underline">
                Create one →
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        hover && 'hover:shadow-md hover:border-indigo-200 transition-all duration-150 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-b border-gray-100', className)}>{children}</div>
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl', className)}>{children}</div>
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  suffix?: string
  trend?: { value: number; label: string }
  className?: string
}

export function StatCard({ label, value, icon, suffix, trend, className }: StatCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight">
            {value ?? '—'}
            {suffix && <span className="text-base font-medium text-gray-500 ml-0.5">{suffix}</span>}
          </p>
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
        )}
      </div>
    </Card>
  )
}

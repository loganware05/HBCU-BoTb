import { Zap } from 'lucide-react'
import { appConfig } from '../config/app.config'

export function DemoBanner() {
  if (!appConfig.demoMode.enabled) return null

  return (
    <div className="flex items-center gap-2 bg-amber-400 px-3 py-1.5 text-amber-900 text-xs font-semibold">
      <Zap size={12} className="shrink-0" />
      <span>{appConfig.demoMode.badgeText} — credentials auto-filled</span>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { Send, TrendingUp, Activity } from 'lucide-react'
import { appConfig } from '../config/app.config'
import { cn } from '../lib/utils'

// ─── Mock data pools (Home Depot–centric demo mode) ────────────────────────────

const MOCK_QUERIES = [
  'best cordless drill for DIY',
  'pressure washer under $300',
  'paint for kitchen cabinets',
  'ceiling fan with remote',
  'lawn mower for small yard',
  'kitchen faucet with pull-down sprayer',
  'smart thermostat installation',
  'garage door opener belt drive',
  'outdoor string lights',
  'storage shed 8x10',
]

const MOCK_BRANDS = [
  ['The Home Depot', 'Lowe\'s'],
  ['DeWalt', 'Milwaukee', 'Ryobi'],
  ['Sherwin-Williams', 'Behr', 'Valspar'],
  ['GE', 'Samsung', 'LG'],
  ['Husqvarna', 'Toro', 'Greenworks'],
  ['The Home Depot', 'Ace Hardware'],
]

const MOCK_AI_RESPONSES = [
  'For cordless drills, DeWalt DCD771 and Milwaukee M18 are top picks. The Home Depot carries both with same-day delivery.',
  'The Home Depot offers a wide selection of pressure washers. Consider the Ryobi 3000 PSI or Greenworks Pro for under $300.',
  'Behr and Sherwin-Williams are recommended for cabinet paint. The Home Depot stocks Behr Cabinet & Trim Enamel.',
]

// ─── Small stat card ──────────────────────────────────────────────────────────

function SOVStat({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string
  value: string | number
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        highlight ? 'border-emerald-500/40 bg-emerald-950/30' : 'border-gray-800 bg-gray-900'
      )}
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p
        className={cn(
          'mt-1 text-2xl font-bold',
          highlight ? 'text-emerald-400' : 'text-white'
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

// ─── Feed event row ───────────────────────────────────────────────────────────

function FeedRow({
  queryText,
  brandsDetected,
  isoTime,
  isNew = false,
}: {
  queryText: string
  brandsDetected: string[]
  isoTime: string
  isNew?: boolean
}) {
  const time = new Date(isoTime)
  const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 transition-all',
        isNew
          ? 'border-emerald-500/50 bg-emerald-950/20'
          : 'border-gray-800 bg-gray-900/50'
      )}
    >
      <Activity
        size={14}
        className={cn('mt-0.5 flex-shrink-0', isNew ? 'text-emerald-400' : 'text-gray-600')}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-300 truncate">{queryText}</p>
        {brandsDetected.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {brandsDetected.map(b => (
              <span
                key={b}
                className="rounded-full bg-indigo-900/50 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-700/50"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className="flex-shrink-0 text-[10px] text-gray-600 font-mono">{label}</span>
    </div>
  )
}

// ─── Main component (fully self-contained demo mode) ───────────────────────────

export function SOVSection({ compact = false }: { compact?: boolean }) {
  const brand = appConfig.clientBrand.productName

  // Hardcoded snapshot stats
  const snapshot = {
    sovPct: 34.2,
    deltaVsLastWindow: 2.1,
    appearances: 1847,
    totalQueries: 5401,
    topTriggerAttribute: 'for DIY',
  }

  const [feedEvents, setFeedEvents] = useState<{ queryText: string; brandsMentioned: string[]; isoTime: string }[]>([])
  const [query, setQuery] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<{
    rawAiResponse: string
    brandsDetected: string[]
  } | null>(null)

  // Simulated live feed: append new event every 4–6 seconds
  useEffect(() => {
    const addSimulatedEvent = () => {
      const q = MOCK_QUERIES[Math.floor(Math.random() * MOCK_QUERIES.length)]!
      const brands = MOCK_BRANDS[Math.floor(Math.random() * MOCK_BRANDS.length)]!
      setFeedEvents(prev => [
        { queryText: q, brandsMentioned: brands, isoTime: new Date().toISOString() },
        ...prev.slice(0, 19),
      ])
    }

    // Seed a few initial events
    addSimulatedEvent()
    addSimulatedEvent()

    const interval = setInterval(addSimulatedEvent, 4000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!query.trim() || submitting) return
      setSubmitting(true)
      setLastResult(null)

      // Simulate 1.5s delay
      await new Promise(r => setTimeout(r, 1500))

      const mockResponse =
        MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)]!
      const mockBrands = MOCK_BRANDS[Math.floor(Math.random() * MOCK_BRANDS.length)]!

      setFeedEvents(prev => [
        { queryText: query.trim(), brandsMentioned: mockBrands, isoTime: new Date().toISOString() },
        ...prev,
      ])
      setLastResult({ rawAiResponse: mockResponse, brandsDetected: mockBrands })
      setQuery('')
      setSubmitting(false)
    },
    [query, submitting]
  )

  return (
    <section className={compact ? 'bg-transparent py-0' : 'bg-gray-950 border-t border-gray-800 py-20'}>
      <div className={compact ? 'mx-auto max-w-5xl' : 'mx-auto max-w-5xl px-6'}>
        {/* Header */}
        <div className={compact ? 'mb-6 flex items-start justify-between gap-4' : 'mb-10 flex items-start justify-between gap-4'}>
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-[2px] text-emerald-400">
                Share of Voice
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Live AI Brand Visibility
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Real-time tracking of how often{' '}
              <span className="font-medium text-gray-300">{brand}</span> appears
              in AI-generated shopping responses across platforms.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-950/30 px-3 py-1.5 text-xs font-medium flex-shrink-0 text-emerald-400">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ animation: 'sov-pulse 1.5s infinite' }}
            />
            Demo mode
          </div>
        </div>

        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SOVStat
              label="Share of Voice"
              value={`${snapshot.sovPct}%`}
              sub={`+${snapshot.deltaVsLastWindow}% vs last window`}
              highlight
            />
            <SOVStat
              label="Appearances"
              value={snapshot.appearances}
              sub="In current window"
            />
            <SOVStat
              label="Total Queries"
              value={snapshot.totalQueries}
              sub="Processed"
            />
            <SOVStat
              label="Top Trigger"
              value={snapshot.topTriggerAttribute}
              sub="Most associated attribute"
            />
          </div>

          {/* Try it input */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
            <p className="mb-3 text-sm font-medium text-gray-300">
              Submit a shopping query
            </p>
            <p className="mb-4 text-xs text-gray-500">
              Add a query to the simulated feed below. No server required — demo mode.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`e.g. "best cordless drill for DIY"`}
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !query.trim()}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Send size={14} />
                )}
                Submit
              </button>
            </form>

            {lastResult && (
              <div className="mt-4 rounded-lg border border-gray-700 bg-gray-800/60 p-4">
                <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-500 font-medium">
                  AI Response (simulated)
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {lastResult.rawAiResponse}
                </p>
                {lastResult.brandsDetected.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs text-gray-500">Brands detected:</span>
                    {lastResult.brandsDetected.map(b => (
                      <span
                        key={b}
                        className="rounded-full bg-indigo-900/50 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-700/50"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live feed */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-400">Live query feed (simulated)</p>
              <span className="text-xs text-gray-600">
                {feedEvents.length} event{feedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
            {feedEvents.length === 0 ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900/30 py-12 text-center">
                <Activity size={24} className="mx-auto mb-2 text-gray-700" />
                <p className="text-sm text-gray-600">
                  Waiting for queries… Submit one above or watch the simulated feed.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {feedEvents.map((ev, i) => (
                  <FeedRow
                    key={`${ev.isoTime}-${i}`}
                    queryText={ev.queryText}
                    brandsDetected={ev.brandsMentioned}
                    isoTime={ev.isoTime}
                    isNew={i === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sov-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </section>
  )
}

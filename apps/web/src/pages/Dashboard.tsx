import { useState } from 'react'
import { SOVSection } from '../components/SOVSection'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { RefreshCw } from 'lucide-react'
import { appConfig } from '../config/app.config'

const clientBrand = appConfig.clientBrand
import { useDashboardData } from '../hooks/useDashboard'
import { useQueryClient } from '@tanstack/react-query'
import { dashboardKeys } from '../hooks/useDashboard'
import type { DashboardData } from '@repo/shared'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

// ─── Shared chart defaults ────────────────────────────────────────────────────
const GRID = 'rgba(37,51,80,0.6)'
const MUTED = '#5A6D8A'
const DIM = '#8899BB'

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
    y: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
  },
} as const

// ─── Panels & KPI helpers ─────────────────────────────────────────────────────

function Panel({
  title,
  children,
  className = '',
}: {
  title?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${className}`}
      style={{ background: '#161E2E', borderColor: '#253350' }}
    >
      {title && (
        <p
          className="mb-3 text-[9px] font-medium uppercase tracking-[1.5px]"
          style={{ color: '#8899BB' }}
        >
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

function KPICard({
  label,
  value,
  sub,
  trend,
  accent,
  small = false,
}: {
  label: string
  value: string
  sub: string
  trend: 'up' | 'down' | 'neutral'
  accent: string
  small?: boolean
}) {
  const subColor =
    trend === 'up' ? '#00C9A7' : trend === 'down' ? '#F75F5F' : '#8899BB'
  return (
    <div
      className="rounded-lg border p-3"
      style={{
        background: '#161E2E',
        borderColor: '#253350',
        borderTop: `3px solid ${accent}`,
      }}
    >
      <p
        className="mb-1 text-[9px] font-medium uppercase tracking-[1.5px]"
        style={{ color: accent }}
      >
        {label}
      </p>
      <p
        className="font-semibold leading-tight text-white"
        style={{ fontSize: small ? 16 : 22 }}
      >
        {value}
      </p>
      <p className="mt-1 text-[10px]" style={{ color: subColor }}>
        {sub}
      </p>
    </div>
  )
}

function HorizBar({
  name,
  value,
  max,
  color,
  suffix = '',
}: {
  name: string
  value: number
  max: number
  color: string
  suffix?: string
}) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex justify-between">
        <span className="text-[10px]" style={{ color: '#8899BB' }}>
          {name}
        </span>
        <span className="text-[10px] font-medium" style={{ color }}>
          {typeof value === 'number' && value > 100
            ? value.toLocaleString()
            : value}
          {suffix}
        </span>
      </div>
      <div className="h-[7px] rounded-sm" style={{ background: '#253350' }}>
        <div
          className="h-full rounded-sm"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Tab pages ────────────────────────────────────────────────────────────────

function BusinessTab({ data }: { data: DashboardData }) {
  const revData = {
    labels: data.days,
    datasets: [
      {
        label: 'Revenue',
        data: data.revenueTrend,
        borderColor: '#4F8EF7',
        backgroundColor: 'rgba(79,142,247,0.08)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const roasData = {
    labels: data.weekLabels,
    datasets: [
      {
        label: 'ROAS',
        data: data.roasByWeek,
        backgroundColor: '#4F8EF7',
        borderRadius: 4,
        yAxisID: 'yR',
      },
      {
        label: 'CPA ($)',
        data: data.cpaByWeek,
        backgroundColor: '#F96302',
        borderRadius: 4,
        yAxisID: 'yC',
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {data.kpis.map(k => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Panel title="Revenue trend — daily (30 days)">
          <div className="h-56">
            <Line
              data={revData}
              options={{
                ...baseOptions,
                scales: {
                  x: {
                    ticks: { color: MUTED, font: { size: 9 } },
                    grid: { color: GRID },
                  },
                  y: {
                    ticks: {
                      color: MUTED,
                      font: { size: 9 },
                      callback: v => '$' + (Number(v) / 1000).toFixed(1) + 'k',
                    },
                    grid: { color: GRID },
                  },
                },
              }}
            />
          </div>
        </Panel>
        <Panel title="ROAS & CPA by week">
          <div className="h-56">
            <Bar
              data={roasData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 10 },
                  },
                },
                scales: {
                  x: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
                  yR: {
                    position: 'left' as const,
                    ticks: {
                      color: '#4F8EF7',
                      font: { size: 9 },
                      callback: v => v + '×',
                    },
                    grid: { color: GRID },
                  },
                  yC: {
                    position: 'right' as const,
                    ticks: {
                      color: '#F75F5F',
                      font: { size: 9 },
                      callback: v => '$' + v,
                    },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}

function VisibilityTab({ data }: { data: DashboardData }) {
  const LINK_COLORS = ['#4F8EF7', '#00C9A7', '#F7C94F', '#9B6DFF', '#F75F5F']
  const maxClicks = Math.max(...data.topLinks.map(l => l.clicks))
  const maxConv = Math.max(...data.conversionPages.map(p => p.rate))

  const promptData = {
    labels: data.promptTriggers.map(p => p.label),
    datasets: [
      {
        label: 'Mentions',
        data: data.promptTriggers.map(p => p.mentions),
        backgroundColor: '#4F8EF7',
        borderRadius: 3,
      },
      {
        label: 'Link Clicks',
        data: data.promptTriggers.map(p => p.clicks),
        backgroundColor: '#00C9A7',
        borderRadius: 3,
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-3">
        {data.visibilityMetrics.map(k => (
          <KPICard key={k.label} {...k} small />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Panel>
          <p
            className="mb-3 text-[9px] font-medium uppercase tracking-[1.5px]"
            style={{ color: '#8899BB' }}
          >
            Top performing links — link clicks
          </p>
          {data.topLinks.map((l, i) => (
            <HorizBar
              key={l.name}
              name={l.name}
              value={l.clicks}
              max={maxClicks}
              color={LINK_COLORS[i % LINK_COLORS.length]!}
            />
          ))}
          <p
            className="mb-3 mt-5 text-[9px] font-medium uppercase tracking-[1.5px]"
            style={{ color: '#8899BB' }}
          >
            Conversion rate by page
          </p>
          {data.conversionPages.map(p => (
            <HorizBar
              key={p.name}
              name={p.name}
              value={p.rate}
              max={maxConv}
              color={p.color}
              suffix="%"
            />
          ))}
        </Panel>
        <Panel title="AI prompt triggers — mentions & link clicks">
          <div className="h-80">
            <Bar
              data={promptData}
              options={{
                indexAxis: 'y' as const,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 10 },
                  },
                },
                scales: {
                  x: { ticks: { color: MUTED, font: { size: 9 } }, grid: { color: GRID } },
                  y: {
                    ticks: { color: DIM, font: { size: 8 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}

function CompetitorTab({ data }: { data: DashboardData }) {
  const pieData = {
    labels: data.competitors.map(c => c.name),
    datasets: [
      {
        data: data.competitors.map(c => c.pct),
        backgroundColor: data.competitors.map(c => c.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  const trendData = {
    labels: data.trendWeeks,
    datasets: [
      {
        label: 'ChatGPT',
        data: data.trendGPT,
        borderColor: '#74AA9C',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Gemini',
        data: data.trendGemini,
        borderColor: '#F7C94F',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Claude',
        data: data.trendClaude,
        borderColor: '#9B6DFF',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
      {
        label: 'Perplexity',
        data: data.trendPerplexity,
        borderColor: '#4F8EF7',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Panel title="Mention share by brand">
          <div className="h-48">
            <Doughnut
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom' as const,
                    labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 8 },
                  },
                },
              }}
            />
          </div>
        </Panel>

        <Panel title="Competitor rankings">
          <div
            className="mb-1 flex gap-2 border-b pb-1.5 text-[9px]"
            style={{ color: '#5A6D8A', borderColor: '#253350' }}
          >
            <span className="w-5" />
            <span className="flex-1">Company</span>
            <span className="w-10 text-right">Share</span>
            <span className="w-7 text-right">Rank</span>
          </div>
          {data.competitors.map(c => (
            <div
              key={c.name}
              className="flex items-center gap-2 border-b py-1.5"
              style={{ borderColor: '#1E2D45' }}
            >
              <div
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: c.color, color: '#0F1623' }}
              >
                {c.rank}
              </div>
              <span className="flex-1 text-[11px] text-white">{c.name}</span>
              <span
                className="w-10 text-right text-[11px] font-medium"
                style={{ color: c.color }}
              >
                {c.pct}%
              </span>
              <span className="w-7 text-right text-[10px]" style={{ color: '#5A6D8A' }}>
                {c.avgRank}
              </span>
            </div>
          ))}
        </Panel>

        <Panel title="AI platform breakdown">
          {data.platforms.map(p => (
            <div
              key={p.name}
              className="mb-2.5 flex items-center gap-2.5 rounded-lg border p-3"
              style={{ background: '#1A2540', borderColor: p.color }}
            >
              <div
                className="h-12 w-1 flex-shrink-0 rounded"
                style={{ background: p.color }}
              />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white">{p.name}</p>
                <p className="mt-0.5 text-[9px]" style={{ color: '#8899BB' }}>
                  Avg Rank {p.rank} · CTR {p.ctr}
                </p>
              </div>
              <p
                className="text-xl font-semibold"
                style={{ color: p.color }}
              >
                {p.mentions.toLocaleString()}
              </p>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="AI brand mention rate trend — all platforms (30 days)">
        <div className="h-40">
          <Line
            data={trendData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom' as const,
                  labels: { color: DIM, font: { size: 9 }, boxWidth: 10, padding: 8 },
                },
              },
              scales: {
                x: { ticks: { color: MUTED, font: { size: 8 } }, grid: { color: GRID } },
                y: {
                  ticks: {
                    color: MUTED,
                    font: { size: 8 },
                    callback: v => v + '%',
                  },
                  grid: { color: GRID },
                },
              },
            }}
          />
        </div>
      </Panel>
    </div>
  )
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg" style={{ background: '#161E2E' }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-72 rounded-lg" style={{ background: '#161E2E' }} />
        <div className="h-72 rounded-lg" style={{ background: '#161E2E' }} />
      </div>
    </div>
  )
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = 'cover' | 'business' | 'visibility' | 'competitor'

const TABS: { id: TabId; label: string; activeColor: string }[] = [
  { id: 'cover', label: 'Home', activeColor: '#00C9A7' },
  { id: 'business', label: 'Business Overview', activeColor: '#4F8EF7' },
  { id: 'visibility', label: 'AI Visibility', activeColor: '#F7C94F' },
  { id: 'competitor', label: 'Competitor Breakdown', activeColor: '#F75F5F' },
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('cover')
  const { data, isLoading, error } = useDashboardData()
  const queryClient = useQueryClient()

  return (
    <div style={{ background: '#0A1120', minHeight: 'calc(100vh - 53px)' }}>
      {/* Top header bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3"
        style={{ background: '#161E2E', borderColor: clientBrand.primaryHex }}
      >
        <div
          className="text-[13px] font-semibold uppercase tracking-[2px] text-white"
        >
          {clientBrand.productName}{' '}
          <span style={{ color: clientBrand.primaryHex }}>Visibility</span> Dashboard
        </div>
        <div className="flex items-center gap-3">
          {data && (
            <span className="text-[10px]" style={{ color: '#5A6D8A' }}>
              Generated: {data.generatedAt}
            </span>
          )}
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: dashboardKeys.data })}
            className="flex items-center gap-1.5 rounded border px-3 py-1 text-[10px] uppercase tracking-[1px] transition-colors hover:border-[#F96302] hover:text-[#F96302]"
            style={{
              borderColor: '#253350',
              color: '#8899BB',
              background: 'transparent',
            }}
          >
            <RefreshCw size={11} />
            Refresh data
          </button>
          <div
            className="flex items-center gap-1.5 rounded border px-2.5 py-1 text-[10px] uppercase tracking-[1px]"
            style={{
              background: 'rgba(249, 99, 2, 0.15)',
              borderColor: clientBrand.primaryHex,
              color: clientBrand.primaryHex,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#00C9A7', animation: 'pulse 1.5s infinite' }}
            />
            Live
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div
        className="sticky top-[53px] z-10 flex gap-0.5 border-b px-6"
        style={{ background: '#0F1623', borderColor: '#253350' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="border-b-2 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[1px] transition-all whitespace-nowrap"
            style={{
              color: activeTab === tab.id ? tab.activeColor : '#5A6D8A',
              borderBottomColor: activeTab === tab.id ? tab.activeColor : 'transparent',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? tab.activeColor : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6" style={{ maxWidth: 1400, margin: '0 auto' }}>
        {isLoading && activeTab !== 'cover' && <DashboardSkeleton />}

        {error && (
          <div
            className="rounded-lg border p-8 text-center"
            style={{ background: '#161E2E', borderColor: '#253350' }}
          >
            <p style={{ color: '#F75F5F' }}>Failed to load dashboard data.</p>
            <p className="mt-1 text-sm" style={{ color: '#5A6D8A' }}>
              Make sure the API is running on port 4000.
            </p>
          </div>
        )}

        {activeTab === 'cover' && <SOVSection compact />}
        {data && activeTab !== 'cover' && (
          <>
            {activeTab === 'business' && <BusinessTab data={data} />}
            {activeTab === 'visibility' && <VisibilityTab data={data} />}
            {activeTab === 'competitor' && <CompetitorTab data={data} />}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        className="border-t py-2 text-center text-[9px] uppercase tracking-[1px]"
        style={{ background: '#161E2E', borderColor: '#253350', color: '#5A6D8A' }}
      >
        CONFIDENTIAL · AI VISIBILITY INTELLIGENCE · P1 2026
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}

import type { DashboardData } from '@repo/shared'

const rnd = (a: number, b: number) => Math.round(a + Math.random() * (b - a))
const rndF = (a: number, b: number, d = 1) =>
  parseFloat((a + Math.random() * (b - a)).toFixed(d))
const pct = (v: number, r: number) => {
  const d = Math.round(((v - r) / r) * 100)
  return (d >= 0 ? '+' : '') + d + '% vs prev'
}

export function generateDashboardData(): DashboardData {
  const rev = rnd(150_000, 210_000),
    prevRev = rnd(130_000, 180_000)
  const conv = rnd(1_000, 1_500),
    prevConv = rnd(900, 1_300)
  const roas = rndF(3.5, 5.5),
    spend = rnd(35_000, 55_000)
  const citationFreq = rnd(12_400, 18_200),
    prevCitationFreq = rnd(10_500, 15_800)
  const citationPos = rndF(1.8, 3.2),
    prevCitationPos = rndF(2.0, 3.5)
  const entityCoverage = rndF(78, 94),
    prevEntityCoverage = rndF(72, 88)
  const brandedSearchLift = rndF(14, 32),
    prevBrandedSearchLift = rndF(12, 26)
  const rankingStability = rndF(86, 98),
    prevRankingStability = rndF(82, 94)
  const impressionShare = rndF(18, 34),
    prevImpressionShare = rndF(15, 28)

  const days = Array.from({ length: 16 }, (_, i) => `D${i * 2 + 1}`)
  const weeks = ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']
  const tWeeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`)

  const chatgpt = rnd(4_200, 6_000),
    gemini = rnd(3_200, 5_000),
    claude = rnd(2_400, 4_000),
    perplexity = rnd(1_800, 3_200)
  const impressions = rnd(2_000_000, 2_800_000)
  const reach = rnd(700_000, 1_000_000)
  const aiMentions = rnd(10_000, 15_000)
  const linkClicks = rnd(80_000, 110_000)
  const uniqueC = rnd(60_000, 85_000)
  const repeatC = rnd(15_000, 30_000)

  return {
    kpis: [
      {
        label: 'Revenue',
        value: `$${rev.toLocaleString()}`,
        sub: pct(rev, prevRev),
        trend: rev >= prevRev ? 'up' : 'down',
        accent: '#00C9A7',
      },
      {
        label: 'ROAS',
        value: `${roas}×`,
        sub: 'Return on ad spend',
        trend: 'neutral',
        accent: '#4F8EF7',
      },
      {
        label: 'Conversions',
        value: conv.toLocaleString(),
        sub: pct(conv, prevConv),
        trend: conv >= prevConv ? 'up' : 'down',
        accent: '#00C9A7',
      },
      {
        label: 'Ad Spend',
        value: `$${spend.toLocaleString()}`,
        sub: 'Total media budget',
        trend: 'neutral',
        accent: '#4F8EF7',
      },
      {
        label: 'Citation Frequency',
        value: citationFreq.toLocaleString(),
        sub: pct(citationFreq, prevCitationFreq),
        trend: citationFreq >= prevCitationFreq ? 'up' : 'down',
        accent: '#00C9A7',
      },
      {
        label: 'Citation Position',
        value: `#${citationPos.toFixed(1)}`,
        sub: pct(citationPos, prevCitationPos),
        trend: citationPos <= prevCitationPos ? 'up' : 'down',
        accent: '#F96302',
      },
      {
        label: 'Entity Coverage',
        value: `${entityCoverage}%`,
        sub: pct(entityCoverage, prevEntityCoverage),
        trend: entityCoverage >= prevEntityCoverage ? 'up' : 'down',
        accent: '#00C9A7',
      },
      {
        label: 'Branded Search Lift',
        value: `+${brandedSearchLift}%`,
        sub: pct(brandedSearchLift, prevBrandedSearchLift),
        trend: brandedSearchLift >= prevBrandedSearchLift ? 'up' : 'down',
        accent: '#4F8EF7',
      },
      {
        label: 'Ranking Stability',
        value: `${rankingStability}%`,
        sub: pct(rankingStability, prevRankingStability),
        trend: rankingStability >= prevRankingStability ? 'up' : 'down',
        accent: '#00C9A7',
      },
      {
        label: 'Impression Share',
        value: `${impressionShare}%`,
        sub: pct(impressionShare, prevImpressionShare),
        trend: impressionShare >= prevImpressionShare ? 'up' : 'down',
        accent: '#F96302',
      },
    ],
    days,
    revenueTrend: days.map((_, i) => rnd(4_000 + i * 200, 5_500 + i * 200)),
    weekLabels: weeks,
    roasByWeek: weeks.map((_, i) => rndF(3.5 + i * 0.3, 4.0 + i * 0.4)),
    cpaByWeek: weeks.map((_, i) => rnd(28 - i * 2, 30 - i * 2)),

    visibilityMetrics: [
      {
        label: 'Impressions',
        value: `${(impressions / 1_000_000).toFixed(1)}M`,
        sub: 'Total views',
        trend: 'neutral',
        accent: '#4F8EF7',
      },
      {
        label: 'Reach',
        value: `${(reach / 1000).toFixed(0)}K`,
        sub: 'Unique users reached',
        trend: 'neutral',
        accent: '#9B6DFF',
      },
      {
        label: 'Link Clicks',
        value: aiMentions.toLocaleString(),
        sub: '+18% vs prev',
        trend: 'up',
        accent: '#00C9A7',
      },
      {
        label: 'AI Mentions',
        value: linkClicks.toLocaleString(),
        sub: '+11% vs prev',
        trend: 'up',
        accent: '#4F8EF7',
      },
      {
        label: 'Link CTR',
        value: `${rndF(3.5, 4.8)}%`,
        sub: 'Click-through rate',
        trend: 'neutral',
        accent: '#9B6DFF',
      },
      {
        label: 'Unique Clicks',
        value: uniqueC.toLocaleString(),
        sub: 'First-time visitors',
        trend: 'neutral',
        accent: '#00C9A7',
      },
      {
        label: 'Repeat Clicks',
        value: repeatC.toLocaleString(),
        sub: 'Return visitors',
        trend: 'neutral',
        accent: '#4F8EF7',
      },
    ],
    topLinks: [
      { name: '/ergonomic-desk', clicks: rnd(22_000, 32_000) },
      { name: '/home-office', clicks: rnd(18_000, 26_000) },
      { name: '/best-standing-desks', clicks: rnd(11_000, 17_000) },
      { name: '/standing-desk-guide', clicks: rnd(7_000, 12_000) },
      { name: '/office-chairs', clicks: rnd(5_000, 9_000) },
    ],
    promptTriggers: [
      {
        label: '"best laptop under $500"',
        clicks: rnd(1_800, 2_400),
        mentions: rnd(7_000, 10_000),
      },
      {
        label: '"top ergonomic office chairs"',
        clicks: rnd(1_400, 1_900),
        mentions: rnd(5_000, 7_500),
      },
      {
        label: '"wireless earbuds for running"',
        clicks: rnd(1_000, 1_500),
        mentions: rnd(3_500, 6_000),
      },
      {
        label: '"portable monitor for laptop"',
        clicks: rnd(800, 1_100),
        mentions: rnd(2_800, 4_200),
      },
      {
        label: '"mechanical keyboard under $100"',
        clicks: rnd(600, 900),
        mentions: rnd(2_000, 3_500),
      },
    ],
    conversionPages: [
      { name: '/ergonomic-desk', rate: rndF(4.0, 7.0), color: '#00C9A7' },
      { name: '/home-office', rate: rndF(3.5, 6.0), color: '#4F8EF7' },
      { name: '/best-standing-desks', rate: rndF(2.5, 5.0), color: '#F7C94F' },
    ],
    platforms: [
      {
        name: 'ChatGPT',
        mentions: chatgpt,
        color: '#74AA9C',
        ctr: `${rndF(4.8, 5.6)}%`,
        rank: '#2',
      },
      {
        name: 'Gemini',
        mentions: gemini,
        color: '#F7C94F',
        ctr: `${rndF(4.2, 5.0)}%`,
        rank: '#3',
      },
      {
        name: 'Claude',
        mentions: claude,
        color: '#9B6DFF',
        ctr: `${rndF(3.6, 4.4)}%`,
        rank: '#4',
      },
      {
        name: 'Perplexity',
        mentions: perplexity,
        color: '#4F8EF7',
        ctr: `${rndF(3.2, 4.0)}%`,
        rank: '#5',
      },
    ],
    competitors: (() => {
      const rawPcts = [rnd(22, 28), rnd(17, 24), rnd(14, 21), rnd(11, 16), rnd(9, 14)]
      const total = rawPcts.reduce((a, b) => a + b, 0)
      const normalized = rawPcts.map(p => Math.round((p / total) * 100))
      normalized[4] = 100 - normalized.slice(0, 4).reduce((a, b) => a + b, 0)
      const names = ['Shop.py', 'Semrush', 'Agenxus', 'GrowthX', 'BrightEdge']
      const colors = ['#00C9A7', '#4F8EF7', '#F7C94F', '#9B6DFF', '#F75F5F']
      return names.map((name, i) => ({
        rank: i + 1,
        name,
        pct: normalized[i]!,
        avgRank: `#${i + 1}`,
        color: colors[i]!,
      }))
    })(),
    trendWeeks: tWeeks,
    trendGPT: tWeeks.map(() => rndF(4.5, 5.8)),
    trendGemini: tWeeks.map(() => rndF(3.8, 5.2)),
    trendClaude: tWeeks.map(() => rndF(3.2, 4.6)),
    trendPerplexity: tWeeks.map(() => rndF(2.8, 4.0)),
    generatedAt: new Date().toLocaleString(),
  }
}

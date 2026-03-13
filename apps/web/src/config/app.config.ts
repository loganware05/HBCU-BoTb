// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  app.config.ts — Edit this file to customise your entire pitch
//  Everything else reads from here.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const appConfig = {
  // ─── Brand ────────────────────────────────────────────────
  productName: 'Shop.py',
  tagline: 'GEO Analytics for AI-Driven Commerce',
  logoText: 'SP',
  description:
    'B2B SaaS platform that tracks, measures, and optimizes how products appear in AI-generated shopping results through Generative Engine Optimization (GEO).',

  // ─── Colors (Tailwind CSS variable values — RGB without parens) ───
  brand: {
    primaryHex: '#6366f1',
    cssVars: {
      '--brand-50':  '238 242 255',
      '--brand-100': '224 231 255',
      '--brand-200': '199 210 254',
      '--brand-300': '165 180 252',
      '--brand-400': '129 140 248',
      '--brand-500': '99 102 241',
      '--brand-600': '79 70 229',
      '--brand-700': '67 56 202',
      '--brand-800': '55 48 163',
      '--brand-900': '49 46 129',
    },
  },

  // ─── Navigation ───────────────────────────────────────────
  nav: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  // ─── Feature flags ───────────────────────────────────────
  features: {
    scoring:       true,
    deadlines:     true,
    tags:          true,
    search:        true,
    demoReset:     true,
    aiSuggestions: false,
    realtime:      false,
  },

  // ─── Demo mode ────────────────────────────────────────────
  demoMode: {
    enabled: import.meta.env.VITE_DEMO_MODE === 'true',
    email: 'homedepot@pitch.dev',
    password: 'demo1234',
    badgeText: 'Demo Mode',
    ctaLabel: 'Start Demo',
  },

  // ─── Entity (core pitch object) ───────────────────────────
  entity: {
    singular: 'Brand',
    plural: 'Brands',
    createLabel: 'New Brand',
    icon: 'Target',
    statusLabels: {
      active:      'Active',
      in_progress: 'In Progress',
      completed:   'Completed',
      archived:    'Archived',
    },
    priorityLabels: {
      low:      'Low',
      medium:   'Medium',
      high:     'High',
      critical: 'Critical',
    },
    statusColors: {
      active:      'blue',
      in_progress: 'yellow',
      completed:   'green',
      archived:    'gray',
    } as Record<string, 'blue' | 'yellow' | 'green' | 'gray' | 'red' | 'purple'>,
    priorityColors: {
      low:      'gray',
      medium:   'blue',
      high:     'yellow',
      critical: 'red',
    } as Record<string, 'blue' | 'yellow' | 'green' | 'gray' | 'red' | 'purple'>,
  },

  // ─── Dashboard metrics ────────────────────────────────────
  dashboard: {
    metrics: [
      { key: 'total',        label: 'Total',          icon: 'Layers' },
      { key: 'highPriority', label: 'High Priority',  icon: 'Flame' },
      { key: 'avgScore',     label: 'Avg Score',      icon: 'TrendingUp', suffix: '/100' },
    ],
  },

  // ─── Landing page ─────────────────────────────────────────
  landing: {
    headline: 'The New Front Door:\nAI Product Discovery.',
    subheadline:
      'Shop.py helps brands track, measure, and optimize how their products appear in AI-generated shopping results — before competitors do.',
    ctaPrimary:   'Start Demo',
    ctaSecondary: 'Learn More',
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        body: 'Brands are invisible in AI results with no tools to measure or act on it. Traditional search rankings no longer reflect true demand when purchase decisions happen inside ChatGPT or Gemini.',
        icon: 'AlertCircle',
      },
      {
        id: 'solution',
        title: 'The solution',
        body: 'GEO analytics dashboard plus ethics and hallucination monitoring, powered by real consumer behavioral data — not bot simulations.',
        icon: 'Lightbulb',
      },
      {
        id: 'traction',
        title: 'Traction',
        body: 'GEO market valued at $886M (2024), projected $7.32B by 2031 (34% CAGR). HBCU Battle of the Brains 2026.',
        icon: 'TrendingUp',
      },
    ],
  },

  // ─── Share of Voice (demo mode — no server) ────────────────
  sov: {
    brand: 'Shop.py',
  },

  // ─── Client brand (post-login dashboard) ───────────────────
  clientBrand: {
    productName: 'The Home Depot',
    logoText: 'HD',
    primaryHex: '#F96302',
    description: 'AI visibility analytics for The Home Depot.',
  },
} as const

export type AppConfig = typeof appConfig

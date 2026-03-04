// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  app.config.ts — Edit this file to customise your entire pitch
//  Everything else reads from here.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const appConfig = {
  // ─── Brand ────────────────────────────────────────────────
  productName: 'LaunchPad',
  tagline: 'From idea to traction — faster.',
  logoText: 'LP',
  description:
    'LaunchPad helps founders track every opportunity, initiative, and milestone from pitch to product.',

  // ─── Colors (Tailwind CSS variable values — RGB without parens) ───
  // These get injected as CSS vars used by tailwind brand-* classes
  brand: {
    primaryHex: '#6366f1',   // indigo-500 — change to match your pitch
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
    { label: 'Dashboard',     path: '/dashboard',  icon: 'LayoutDashboard' },
    { label: 'Opportunities', path: '/entities',   icon: 'Target' },
    { label: 'Settings',      path: '/settings',   icon: 'Settings' },
  ],

  // ─── Feature flags (flip to false to hide in UI) ──────────
  features: {
    scoring:       true,   // score/0-100 field on entities
    deadlines:     true,   // deadline picker
    tags:          true,   // tag chips
    search:        true,   // search bar on entity list
    demoReset:     true,   // "Reset Demo Data" button in Settings
    aiSuggestions: false,  // stub for future AI feature
    realtime:      false,  // stub for future websocket feature
  },

  // ─── Demo mode ────────────────────────────────────────────
  demoMode: {
    enabled: import.meta.env.VITE_DEMO_MODE === 'true',
    email: 'demo@pitch.dev',
    password: 'demo1234',
    badgeText: 'Demo Mode',
    ctaLabel: 'Start Demo',
  },

  // ─── Entity (your core pitch object) ─────────────────────
  entity: {
    singular: 'Opportunity',
    plural: 'Opportunities',
    createLabel: 'New Opportunity',
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
    headline: 'Turn ideas into\nmomentum.',
    subheadline:
      'LaunchPad gives your team one place to track every opportunity, score your best bets, and ship faster.',
    ctaPrimary:   'Start Demo',
    ctaSecondary: 'Learn More',
    sections: [
      {
        id: 'problem',
        title: 'The problem',
        body: 'Great ideas get lost in spreadsheets, Slack threads, and sticky notes. Founders waste hours on coordination instead of execution.',
        icon: 'AlertCircle',
      },
      {
        id: 'solution',
        title: 'The solution',
        body: 'LaunchPad brings all your opportunities into one scored, prioritized pipeline — so your team always knows what to work on next.',
        icon: 'Lightbulb',
      },
      {
        id: 'traction',
        title: 'Traction',
        body: '340+ founders on the waitlist. Built in 24 hours at HBCU Battle of the Brains.',
        icon: 'TrendingUp',
      },
    ],
  },
} as const

export type AppConfig = typeof appConfig

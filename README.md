# Pitch Monorepo — 24-Hour Competition Template

> Full-stack, demo-ready, config-driven. Edit one file and the whole product updates.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 · Vite 5 · TypeScript · Tailwind CSS · React Router v6 · TanStack Query v5 |
| Backend | Node.js · Express 4 · TypeScript · Prisma 5 · PostgreSQL |
| Shared | Zod schemas, inferred types, `ApiResponse` contract |
| Dev | pnpm workspaces · Docker Compose · concurrently |
| Deploy | Vercel (web) · Render/Railway (api) · Neon/Supabase (db) |

---

## Quick Start (5 minutes)

### 1. Prerequisites

```bash
node >= 20
pnpm >= 9       # npm i -g pnpm
docker          # for local Postgres
```

### 2. Clone & install

```bash
cd "HBCU BoTb"
pnpm install
```

### 3. Environment

```bash
# Root env (read by docker-compose)
cp .env.example .env

# API env
cp apps/api/.env.example apps/api/.env

# Web env
cp apps/web/.env.example apps/web/.env
```

Edit `apps/api/.env` — set `JWT_SECRET` to any long random string.

### 4. Start Postgres

```bash
docker compose up -d
```

### 5. Migrate & seed

```bash
pnpm db:migrate   # runs prisma migrate dev
pnpm db:seed      # creates demo user + 10 demo entities
```

Demo credentials: **homedepot@pitch.dev** / **demo1234**

### 6. Run everything

```bash
pnpm dev
```

- Web → http://localhost:5173
- API → http://localhost:4000
- API health → http://localhost:4000/api/health

---

## Customise Your Pitch

**Edit exactly one file:**

```
apps/web/src/config/app.config.ts
```

| Key | What it controls |
|-----|-----------------|
| `productName` | App name everywhere |
| `tagline` | Subtitle on login + landing |
| `logoText` | 2-char sidebar logo |
| `brand.cssVars` | Color palette (Tailwind CSS vars) |
| `nav` | Sidebar links & icons |
| `features.*` | Toggle feature flags (scoring, deadlines, tags, etc.) |
| `demoMode` | Credentials, badge text, CTA label |
| `entity` | Rename core object (Opportunity → Task, Lead, etc.) |
| `entity.statusLabels/colors` | Status badge display |
| `entity.priorityLabels/colors` | Priority badge display |
| `dashboard.metrics` | 3 stat cards on Dashboard |
| `landing.*` | Hero text, sections, CTAs |

### Change the core entity name

```ts
entity: {
  singular: 'Lead',
  plural: 'Leads',
  createLabel: 'New Lead',
  // ...
}
```

That's it — the sidebar, pages, modals, and empty states all update.

### Change the brand color

Replace the `brand.cssVars` block with any indigo/blue/green/etc. Tailwind palette RGB values.

---

## Project Structure

```
.
├── apps/
│   ├── api/                    # Express + Prisma backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts         # Demo data
│   │   └── src/
│   │       ├── config/env.ts
│   │       ├── middleware/     # auth, error, validate
│   │       ├── routes/         # health, auth, entities, demo
│   │       └── services/       # auth.service, entity.service
│   └── web/                    # React frontend
│       └── src/
│           ├── config/
│           │   └── app.config.ts   ← EDIT THIS
│           ├── components/
│           │   ├── ui/             # Button, Input, Badge, Card, Modal…
│           │   └── Layout.tsx
│           ├── hooks/              # useAuth, useEntities
│           ├── lib/                # api client, auth-store, utils
│           └── pages/              # Landing, Login, Dashboard, Entities, Settings
└── packages/
    └── shared/                 # Zod schemas + inferred types
        └── src/
            ├── schemas/api.ts      # ApiResponse, ApiError
            ├── schemas/auth.ts     # User, AuthSession, LoginRequest
            └── schemas/entity.ts  # Entity, CRUD schemas
```

---

## API Contract

Every response follows this shape:

```ts
{
  success: boolean
  data: T | null
  error: { code: string; message: string; details?: unknown } | null
  meta?: { total; page; pageSize; totalPages }
}
```

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/v1/auth/login` | — | Login → JWT |
| POST | `/api/v1/auth/logout` | — | Logout |
| GET | `/api/v1/auth/me` | ✓ | Current user |
| GET | `/api/v1/entities` | ✓ | List (paginated, filtered) |
| GET | `/api/v1/entities/stats` | ✓ | Dashboard metrics |
| GET | `/api/v1/entities/:id` | ✓ | Get one |
| POST | `/api/v1/entities` | ✓ | Create |
| PATCH | `/api/v1/entities/:id` | ✓ | Update |
| DELETE | `/api/v1/entities/:id` | ✓ | Delete |
| POST | `/api/v1/demo/reset` | ✓ | Reseed demo data |

---

## Scripts

```bash
pnpm dev            # run web + api concurrently
pnpm build          # build all packages
pnpm lint           # lint all packages
pnpm format         # prettier format
pnpm db:migrate     # prisma migrate dev
pnpm db:seed        # seed demo data
pnpm db:studio      # open Prisma Studio
pnpm db:reset       # reset + reseed
```

---

## Demo Mode

Set `DEMO_MODE=true` in `apps/api/.env` and `VITE_DEMO_MODE=true` in `apps/web/.env`.

- Login page auto-fills demo credentials
- Yellow "Demo Mode" badge appears in sidebar
- "Start Demo" button on landing page logs in instantly
- "Reset Demo Data" button in Settings reseeds to pristine state

---

## Deployment

### Database (Neon or Supabase)

1. Create a Postgres project
2. Copy the connection string → set as `DATABASE_URL` in your API env

### API (Render or Railway)

```bash
# Build command
pnpm --filter api build

# Start command
node apps/api/dist/index.js

# Environment variables (set in dashboard)
DATABASE_URL=...
JWT_SECRET=...
NODE_ENV=production
DEMO_MODE=true
CORS_ORIGIN=https://your-vercel-app.vercel.app
PORT=4000
```

### Web (Vercel)

- Root directory: `apps/web`
- Build command: `pnpm build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://your-api.onrender.com`
  - `VITE_DEMO_MODE=true`

---

## Cursor Workflow Tips

1. **Add a new feature** → add a flag to `app.config.ts → features`, then ask Cursor to implement it
2. **Add a new entity field** → edit `packages/shared/src/schemas/entity.ts`, then ask Cursor to propagate
3. **Change the pitch narrative** → edit `app.config.ts → landing.sections`
4. **New API route** → add to `apps/api/src/routes/`, register in `routes/index.ts`

---

*Built at HBCU Battle of the Brains — 24-hour sprint template.*

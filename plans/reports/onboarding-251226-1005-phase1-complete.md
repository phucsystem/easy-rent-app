# Phase 1 Onboarding - Easy Rent MVP

**Date**: 2025-12-26
**Phase**: 1 - Project Setup & Foundation
**Status**: ✅ COMPLETE

---

## Onboarding Requirements

### ⚠️ ACTION REQUIRED: Supabase Setup

Before running the app, you must create a Supabase project:

1. Go to https://supabase.com
2. Create new project
3. Save database password securely
4. Copy credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: `.env.local` is protected by privacy block. Create it manually or use the template in `.env.example`.

---

## Quick Start

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Visit http://localhost:3000
```

---

## Project Structure

```
easy-rent-app/
├── src/
│   ├── app/[locale]/         # i18n routes (vi/en)
│   ├── components/           # UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (empty)
│   │   ├── tenants/         # Tenant features (empty)
│   │   ├── templates/       # Template features (empty)
│   │   ├── contracts/       # Contract features (empty)
│   │   └── dashboard/       # Dashboard components (empty)
│   ├── lib/supabase/        # Supabase clients
│   ├── types/               # TypeScript types
│   ├── messages/            # i18n translations (vi, en)
│   ├── hooks/               # Custom hooks (empty)
│   ├── i18n.ts              # i18n config
│   └── middleware.ts        # Next.js middleware
├── supabase/migrations/     # DB migrations (empty)
├── docs/                    # Documentation
└── plans/                   # Implementation plans
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui + Radix |
| Backend | Supabase (PostgreSQL) |
| i18n | next-intl (vi/en) |
| State | TanStack Query |
| Forms | React Hook Form + Zod |

---

## Theme Colors

| Role | Color |
|------|-------|
| Primary | Amber-500 (#F59E0B) |
| Dark | Black (#0F0F0F) |
| Background | Light Gray (#FAFAFA) |

---

## Next Steps

### Phase 2: Database Setup & Auth
1. Create Supabase project (above)
2. Run database migrations
3. Enable Row Level Security
4. Build login page
5. Implement auth middleware

---

## Documentation

- `docs/project-overview-pdr.md` - Product requirements
- `docs/code-standards.md` - Coding conventions
- `docs/system-architecture.md` - Technical design
- `docs/deployment-guide.md` - Deployment steps
- `docs/design-guidelines.md` - UI/UX standards

---

## Dev Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

**Unresolved Questions** (from code review):
1. Empty component dirs - keep for Phase 2 or remove?
2. Rename `middleware.ts` → `proxy.ts` for Next.js 16?
3. Target date for Phase 2 completion?

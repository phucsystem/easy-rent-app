---
title: "Easy Rent MVP Implementation Plan"
description: "Multi-phase rental contract management system built with Next.js 16, Supabase, and shadcn/ui"
status: "in-progress"
priority: "high"
effort: "3-4 weeks"
branch: "main"
tags: ["nextjs", "supabase", "rental-management", "mvp"]
created: "2025-12-26"
---

# Easy Rent MVP Implementation Plan

## Project Overview

Easy Rent is a web-based rental contract management system for landlords and property managers. The application enables creation, management, and digital signing of rental contracts with tenant information tracking.

**Tech Stack:**
- Frontend: Next.js 16.1.1, React 19.2.3, TypeScript
- Backend: Supabase (PostgreSQL, Auth, Storage)
- UI: shadcn/ui (New York style), Tailwind CSS v4
- i18n: next-intl (Vietnamese default, English support)
- State Management: TanStack Query
- Forms: react-hook-form + Zod validation

---

## Phase 1: Project Setup & Foundation ✅

**Status**: COMPLETED (2025-12-26)
**Duration**: Completed
**Completion**: 100%

### Completed Tasks

- [x] Next.js 16 project initialization with App Router
- [x] TypeScript strict mode configuration
- [x] Tailwind CSS v4 setup with custom yellow/black theme
- [x] Supabase client setup (SSR + middleware)
- [x] next-intl i18n configuration (vi/en)
- [x] Database type definitions (tenants, contract_templates, contracts)
- [x] shadcn/ui component installation
- [x] Project structure setup (feature-based architecture)
- [x] Environment variable configuration
- [x] Build pipeline verification

### Deliverables

- Build: ✅ Passing (1.2s with Turbopack)
- TypeScript: ✅ Strict mode, no errors
- Linting: ⚠️ 2 warnings (non-blocking)
- Security: ✅ No hardcoded secrets

### Open Items (Non-blocking)

- Fix middleware linter warnings (unused `options` parameter)
- Add environment variable validation utility
- Create Supabase migration files for database schema

---

## Phase 2: Authentication & User Management ✅

**Status**: COMPLETED (2025-12-26)
**Duration**: Completed
**Completion**: 90%

### Completed Tasks

- [x] Supabase Auth setup (email/password provider)
- [x] Sign up page implementation (`/auth/register`)
- [x] Sign in page implementation (`/auth/login`)
- [x] Password reset flow
- [x] Email verification handling (basic - shows message)
- [x] Protected route middleware (server-side checks in pages)
- [x] User session management with Supabase SSR
- [x] Logout functionality
- [x] Auth state persistence (cookies via Supabase)
- [x] Error handling for auth failures

### Deliverables

- ✅ Functional authentication flow
- ✅ Protected dashboard routes
- ✅ Session management with proper redirects
- ✅ Auth error handling with user-friendly messages

### Code Review

- Review: `/plans/reports/code-reviewer-251226-1025-phase2-auth.md`
- Status: **APPROVED**
- Issues: 2 minor linting warnings (unused imports)
- Critical issues: None

### Open Items (Non-blocking)

- Consolidate auth functions (remove DRY violation)
- Use `router.replace()` for auth redirects instead of `router.push()`
- Add email verification detection logic
- Consider middleware-based route protection (current: per-page server checks)

---

## Phase 3: Tenant Management Module 📋

**Status**: PENDING
**Duration**: 4-5 days
**Completion**: 0%

### Tasks

- [ ] Tenant list page with pagination
- [ ] Tenant creation form (Zod validation)
- [ ] Tenant detail/edit page
- [ ] Tenant delete with confirmation
- [ ] Search and filter functionality
- [ ] Tenant form fields:
  - Full name
  - ID card number (CCCD)
  - Phone number
  - Email address
  - Current address
  - Permanent address
- [ ] Form validation with Vietnamese phone format
- [ ] TanStack Query integration (CRUD operations)
- [ ] Optimistic updates for better UX

### Database

```sql
tenants table:
  - id (uuid, primary key)
  - user_id (uuid, foreign key → auth.users)
  - full_name (text)
  - id_card (text, unique)
  - phone (text)
  - email (text)
  - current_address (text)
  - permanent_address (text)
  - created_at (timestamp)
  - updated_at (timestamp)
```

---

## Phase 4: Contract Template Management 📄

**Status**: PENDING
**Duration**: 3-4 days
**Completion**: 0%

### Tasks

- [ ] Template list page
- [ ] Template creation form with rich text editor
- [ ] Template variable system ({{tenant_name}}, {{property_address}}, etc.)
- [ ] Template preview functionality
- [ ] Template edit/delete operations
- [ ] Default templates provision:
  - Standard residential lease
  - Commercial property lease
  - Short-term rental agreement
- [ ] Template cloning functionality
- [ ] Template versioning (optional)

### Database

```sql
contract_templates table:
  - id (uuid, primary key)
  - user_id (uuid, foreign key → auth.users)
  - name (text)
  - content (text, with variables)
  - variables (jsonb, available placeholders)
  - is_default (boolean)
  - created_at (timestamp)
  - updated_at (timestamp)
```

---

## Phase 5: Contract Management & Signing ✍️

**Status**: PENDING
**Duration**: 5-6 days
**Completion**: 0%

### Tasks

- [ ] Contract list page with status filters
- [ ] Contract creation wizard (multi-step form)
- [ ] Template selection and variable substitution
- [ ] Contract preview before generation
- [ ] PDF generation from template
- [ ] Contract status tracking:
  - Draft
  - Pending Signature
  - Active
  - Expired
  - Terminated
- [ ] Digital signature integration (Supabase Storage)
- [ ] Contract detail view with all terms
- [ ] Contract editing (draft status only)
- [ ] Contract termination workflow
- [ ] Date-based status automation (expired contracts)
- [ ] Email notifications for signing requests

### Database

```sql
contracts table:
  - id (uuid, primary key)
  - user_id (uuid, foreign key → auth.users)
  - tenant_id (uuid, foreign key → tenants)
  - template_id (uuid, foreign key → contract_templates)
  - status (enum: draft, pending, active, expired, terminated)
  - property_address (text)
  - monthly_rent (numeric)
  - deposit (numeric)
  - start_date (date)
  - end_date (date)
  - terms (jsonb, additional terms)
  - landlord_signature_url (text)
  - tenant_signature_url (text)
  - created_at (timestamp)
  - updated_at (timestamp)
```

---

## Phase 6: Dashboard & Reporting 📊

**Status**: PENDING
**Duration**: 3-4 days
**Completion**: 0%

### Tasks

- [ ] Dashboard homepage with metrics:
  - Total contracts
  - Active contracts
  - Pending signatures
  - Total tenants
  - Monthly revenue
  - Expiring contracts (30 days)
- [ ] Contract calendar view
- [ ] Revenue charts (Chart.js or Recharts)
- [ ] Contract export to CSV/PDF
- [ ] Quick actions (new contract, new tenant)
- [ ] Recent activity feed
- [ ] Contract search functionality

---

## Phase 7: Testing & Quality Assurance 🧪

**Status**: PENDING
**Duration**: 2-3 days
**Completion**: 0%

### Tasks

- [ ] Unit tests for critical utilities
- [ ] Integration tests for auth flow
- [ ] E2E tests with Playwright:
  - User registration and login
  - Tenant CRUD operations
  - Contract creation and signing
- [ ] Responsive design testing (mobile, tablet, desktop)
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG AA)
- [ ] Security review

---

## Phase 8: Deployment & Documentation 🚀

**Status**: PENDING
**Duration**: 2-3 days
**Completion**: 0%

### Tasks

- [ ] Vercel deployment configuration
- [ ] Supabase production project setup
- [ ] Environment variables configuration
- [ ] Custom domain setup
- [ ] Production database migrations
- [ ] User documentation (Vietnamese)
- [ ] API documentation
- [ ] Admin guide
- [ ] Backup and recovery procedures
- [ ] Monitoring setup (Vercel Analytics, Supabase logs)

---

## Success Metrics

- [ ] User can register and login successfully
- [ ] User can create/manage 10+ tenants
- [ ] User can create 5+ contract templates
- [ ] User can generate and sign contracts digitally
- [ ] Dashboard displays accurate metrics
- [ ] All pages load under 2 seconds
- [ ] Mobile-responsive design works on all devices
- [ ] 95%+ test coverage for critical paths

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase auth limits | Medium | Implement rate limiting, consider upgrade |
| PDF generation complexity | Medium | Use simple template-based approach first |
| Digital signature legality | High | Add disclaimer, consult legal requirements |
| Vietnamese language support | Low | Use next-intl, test all translations |
| Mobile UX complexity | Medium | Prioritize responsive design from Phase 3 |

---

## Next Steps

**Immediate Actions:**
1. Create Supabase project and database tables
2. Run database migrations
3. Implement Phase 2: Authentication flow
4. Address Phase 1 minor issues (linter warnings, env validation)

**Timeline Estimate:**
- Phase 2: 3-4 days
- Phase 3: 4-5 days
- Phase 4: 3-4 days
- Phase 5: 5-6 days
- Phase 6: 3-4 days
- Phase 7: 2-3 days
- Phase 8: 2-3 days

**Total Remaining**: ~3-4 weeks to MVP launch

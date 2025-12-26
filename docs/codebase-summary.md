# Codebase Summary

**Last Updated:** 2025-12-26
**Version:** 0.2.0
**Status:** Phase 2 In Progress - Authentication & Dashboard

## Overview

Easy Rent is a property rental management application built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS. This document provides a comprehensive summary of the codebase structure, key files, and implementation details.

## Current Implementation Status

### Completed Features

**Phase 1: Foundation Setup** (100%)
- Next.js 16.1.1 project with App Router and Turbopack
- TypeScript strict mode enabled
- Tailwind CSS v4 with custom yellow/gold theme (#F59E0B)
- shadcn/ui component library integration
- Supabase SSR client setup (server, middleware, browser)
- next-intl i18n configured (vi/en)
- Database type definitions

**Phase 2: Authentication & Dashboard** (70%)
- Authentication flow (login, register, forgot password, reset password)
- Split-screen auth layout with gradient design
- Dashboard with collapsible dark sidebar
- Dashboard header with user menu
- Stat cards component for metrics
- Protected routes with server-side auth check
- Custom auth hook (useAuth)
- Server actions for signOut
- Design tokens library

## Project Structure

```
easy-rent-app/
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── [locale]/                       # i18n dynamic route
│   │   │   ├── auth/                       # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx            # Login with email/password
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx            # Registration
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx            # Password reset request
│   │   │   │   └── reset-password/
│   │   │   │       └── page.tsx            # Set new password
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx                # Dashboard (protected)
│   │   │   │   └── dashboard-client.tsx    # Client-side dashboard
│   │   │   └── layout.tsx                  # Locale layout
│   │   ├── globals.css                     # Global styles and theme
│   │   ├── layout.tsx                      # Root layout
│   │   └── page.tsx                        # Root redirect
│   ├── components/
│   │   ├── auth/
│   │   │   └── auth-split-layout.tsx       # Split-screen auth layout
│   │   ├── dashboard/
│   │   │   ├── dashboard-layout.tsx        # Dashboard layout wrapper
│   │   │   ├── dashboard-header.tsx        # Header with user menu
│   │   │   ├── dashboard-sidebar.tsx       # Collapsible dark sidebar
│   │   │   ├── stat-card.tsx               # Metric stat card
│   │   │   ├── metric-item.tsx             # Metric item component
│   │   │   └── chart-container.tsx         # Chart wrapper
│   │   └── ui/                             # shadcn/ui components
│   │       ├── button.tsx                  # Button with variants
│   │       ├── card.tsx                    # Card components
│   │       ├── dialog.tsx                  # Dialog/Modal
│   │       ├── dropdown-menu.tsx           # Dropdown menu
│   │       ├── form.tsx                    # Form components
│   │       ├── input.tsx                   # Input field
│   │       ├── label.tsx                   # Form label
│   │       ├── select.tsx                  # Select dropdown
│   │       ├── table.tsx                   # Table components
│   │       └── textarea.tsx                # Textarea field
│   ├── hooks/
│   │   └── use-auth.tsx                    # Authentication hook
│   ├── lib/
│   │   ├── actions/
│   │   │   └── auth.ts                    # Server actions (signOut)
│   │   ├── supabase/
│   │   │   ├── auth.ts                    # Auth helpers
│   │   │   ├── client.ts                  # Browser client
│   │   │   ├── server.ts                  # Server client
│   │   │   └── middleware.ts              # Middleware helpers
│   │   ├── design-tokens.ts                # Design constants
│   │   └── utils.ts                        # Utility functions (cn)
│   ├── messages/                           # i18n translations
│   │   ├── vi.json                         # Vietnamese
│   │   └── en.json                         # English
│   ├── types/
│   │   └── database.ts                     # Database type definitions
│   ├── i18n.ts                             # i18n configuration
│   └── middleware.ts                       # Next.js middleware
├── docs/                                   # Documentation
├── plans/                                  # Project plans
├── .env.example                            # Environment template
├── components.json                         # shadcn/ui config
├── eslint.config.mjs                       # ESLint configuration
├── next.config.ts                          # Next.js configuration
├── package.json                            # Dependencies
├── postcss.config.mjs                      # PostCSS configuration
└── tsconfig.json                           # TypeScript configuration
```

## Key Configuration Files

### package.json

**Dependencies**:
```json
{
  "name": "easy-rent-temp",
  "version": "0.1.0",
  "private": true
}
```

**Core Dependencies**:
- `next@16.1.1` - React framework with App Router
- `react@19.2.3` - UI library
- `@supabase/ssr@^0.8.0` - Supabase SSR integration
- `@supabase/supabase-js@^2.89.0` - Supabase client
- `@tanstack/react-query@^5.90.12` - Server state management
- `next-intl@^4.6.1` - Internationalization
- `react-hook-form@^7.69.0` - Form management
- `zod@^4.2.1` - Schema validation
- `react-markdown@^10.1.0` - Markdown rendering

**UI Dependencies**:
- `tailwindcss@^4` - Styling
- `tw-animate-css@^1.4.0` - Tailwind animations
- `@radix-ui/*` - Headless UI primitives
- `lucide-react@^0.562.0` - Icons
- `class-variance-authority@^0.7.1` - Component variants

### Design Tokens (src/lib/design-tokens.ts)

**Colors**:
- Primary: `#F59E0B` (Amber-500)
- Background: `#F8F8F8` (default), `#FFFFFF` (paper), `#212121` (sidebar)
- Text: `#333333` (primary), `#666666` (secondary)
- Status: Green, Orange, Red, Blue

**Typography**:
- Font Family: Inter
- Font Sizes: xs (12px) to 3xl (36px)
- Font Weights: normal (400) to bold (700)

**Spacing**:
- Scale: xs (4px) to 3xl (64px)

**Border Radius**:
- Scale: sm (4px) to full (9999px)

**Shadows**:
- sm: `0 1px 2px rgba(0, 0, 0, 0.05)`
- md: `0 2px 8px rgba(0, 0, 0, 0.08)`
- lg: `0 4px 16px rgba(0, 0, 0, 0.1)`
- xl: `0 8px 32px rgba(0, 0, 0, 0.12)`

## Source Code Analysis

### Application Layer (`/src/app`)

#### Root Layout (layout.tsx)

**Purpose**: Root layout with font configuration and HTML structure

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

#### Locale Layout (`/[locale]/layout.tsx`)

**Purpose**: Locale-specific layout with authentication redirect

**Features**:
- Redirects authenticated users to dashboard
- Redirects unauthenticated users to login
- Passes locale to child components

#### Root Page (page.tsx)

**Purpose**: Root redirect to default locale

**Behavior**: Redirects to `/{locale}` (e.g., `/vi`)

### Authentication Pages (`/src/app/[locale]/auth`)

#### Login Page

**Features**:
- Email/password authentication
- Split-screen layout with gradient left panel
- Error handling with user-friendly messages
- Loading states
- Link to registration and forgot password

**Components Used**:
- AuthSplitLayout
- Card, Input, Label, Button

#### Register Page

**Features**:
- Email/password registration
- Password confirmation validation
- Minimum 6 character password
- Success state with email verification message
- Split-screen layout

#### Forgot Password Page

**Features**:
- Password reset request via email
- Success confirmation screen
- Clean centered card layout

#### Reset Password Page

**Features**:
- New password form
- Password confirmation
- Password strength validation

### Dashboard (`/src/app/[locale]/dashboard`)

#### Dashboard Page (Server Component)

**Purpose**: Protected dashboard page with authentication check

```typescript
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect(`/${locale}/auth/login`);
  }

  return <DashboardClient locale={locale} userEmail={user.email} />;
}
```

**Features**:
- Server-side authentication check
- Redirects unauthenticated users
- Passes user data to client component

#### Dashboard Client (Client Component)

**Purpose**: Client-side dashboard with interactive components

**Features**:
- DashboardLayout wrapper
- Stat cards for metrics
- Chart containers
- Metric items

### Components

#### Auth Components

**AuthSplitLayout**:
- Left panel: Gradient background with geometric shapes, logo, title, subtitle, feature pills
- Right panel: White background with form content
- Responsive: Stacks vertically on mobile, side-by-side on desktop

#### Dashboard Components

**DashboardLayout**:
- Flex container with sidebar and main content
- Background color: `#F8F8F8`
- Contains DashboardSidebar, DashboardHeader, and main content area

**DashboardSidebar**:
- Dark sidebar (`#212121` background)
- Collapsible with toggle button
- Navigation items: Dashboard, Bookings, Properties, Customers, Contracts, Settings
- Active state highlighting with primary color
- Hover effects with scale animations
- Logo with "$" icon

**DashboardHeader**:
- Header with user menu
- Sign out functionality
- Responsive design

**StatCard**:
- Metric display card
- Title, value, trend
- Optional icon and badge
- Hover elevation effect
- Gradient trend indicators (green for positive, red for negative)

**MetricItem**:
- Simple metric display
- Label and value
- Used within stat cards

**ChartContainer**:
- Wrapper for charts
- Title and description
- Chart content area

#### UI Components (shadcn/ui)

All standard shadcn/ui components with custom styling:
- Button: Primary (amber), secondary, outline, ghost, destructive, link
- Card: Container, header, title, description, content, footer
- Dialog: Modal with overlay
- DropdownMenu: Radix-based dropdown
- Form: React Hook Form integration
- Input, Textarea, Label: Form controls
- Select: Dropdown selection
- Table: Data display with header, body, footer

### Hooks

#### useAuth

**Purpose**: Custom authentication hook for client-side auth operations

**Features**:
- `signIn(email, password)`: Sign in with credentials
- `signUp(email, password)`: Register new user
- `signOut()`: Sign out current user
- Uses Supabase browser client
- Error handling with user-friendly messages

### Libraries

#### Supabase Integration (`/src/lib/supabase`)

**client.ts**:
```typescript
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**server.ts**:
```typescript
export const createServerClient = async () => {
  const cookieStore = await cookies();
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { ... } }
  );
};
```

**auth.ts**:
- `signIn(email, password)`: Sign in helper
- `signUp(email, password)`: Sign up helper
- `resetPassword(email)`: Password reset helper
- `signOut()`: Sign out helper

#### Design Tokens (`/src/lib/design-tokens.ts`)

Comprehensive design system constants:
- Colors (primary, background, text, status, dividers)
- Typography (font family, sizes, weights, line heights)
- Spacing scale
- Border radius
- Shadows
- Card styles
- Transitions
- Z-index layers

### Type Definitions (`/src/types`)

#### database.ts

**Tables**:
- `tenants`: Tenant information
- `contract_templates`: Contract templates
- `contracts`: Generated contracts with snapshots

**Usage**: Type-safe database queries throughout the app

### Internationalization (`/src/messages`, `/src/i18n.ts`)

#### i18n.ts

```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale) locale = 'vi';
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

**Supported Locales**:
- Vietnamese (vi) - Default
- English (en)

#### Translation Structure

```json
{
  "common": { "appName": "Easy Rent", "save": "Lưu" },
  "nav": { "dashboard": "Tổng quan", "tenants": "Khách thuê" },
  "auth": { "signIn": "Đăng nhập" }
}
```

### Middleware (`/src/middleware.ts`)

```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

**Behavior**:
- Intercepts all requests except API, _next, _vercel, and static files
- Handles locale detection and routing
- Redirects root to default locale

## Routes

### Implemented Routes

| Route | Purpose | Protected | Component |
|-------|---------|-----------|-----------|
| `/` | Root redirect | No | Redirects to `/{locale}` |
| `/{locale}` | Auth-based redirect | No | Redirects based on auth |
| `/{locale}/auth/login` | Login page | No | LoginPage |
| `/{locale}/auth/register` | Registration | No | RegisterPage |
| `/{locale}/auth/forgot-password` | Password reset | No | ForgotPasswordPage |
| `/{locale}/auth/reset-password` | Set new password | No | ResetPasswordPage |
| `/{locale}/dashboard` | Dashboard | Yes | DashboardPage |

### Planned Routes

| Route | Purpose | Priority |
|-------|---------|----------|
| `/{locale}/tenants` | Tenant management | High |
| `/{locale}/contracts` | Contract management | High |
| `/{locale}/templates` | Contract templates | High |
| `/{locale}/properties` | Property management | Medium |
| `/{locale}/bookings` | Booking management | Medium |
| `/{locale}/settings` | User settings | Low |

## Environment Configuration

### .env.example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

**Required Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `NEXT_PUBLIC_APP_URL`: Application URL

## Database Schema

### Tables

#### tenants
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | uuid | No | Primary key |
| user_id | uuid | No | Foreign key to auth.users |
| full_name | text | No | Tenant full name |
| phone | text | No | Phone number |
| id_number | text | Yes | ID number |
| address | text | Yes | Address |
| date_of_birth | date | Yes | Date of birth |
| note | text | Yes | Additional notes |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

#### contract_templates
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | uuid | No | Primary key |
| user_id | uuid | No | Foreign key to auth.users |
| name | text | No | Template name |
| content | text | No | Markdown content |
| created_at | timestamp | No | Creation timestamp |
| updated_at | timestamp | No | Update timestamp |

#### contracts
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | uuid | No | Primary key |
| user_id | uuid | No | Foreign key to auth.users |
| tenant_id | uuid | No | Foreign key to tenants |
| template_id | uuid | No | Foreign key to contract_templates |
| tenant_snapshot | jsonb | No | Tenant data snapshot |
| template_snapshot | jsonb | No | Template data snapshot |
| generated_content | text | No | Generated contract |
| generated_at | timestamp | No | Generation timestamp |
| created_at | timestamp | No | Creation timestamp |

## Development Workflow

### Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   ```
   http://localhost:3000
   ```

### Adding New Features

1. Create route in `src/app/[locale]/`
2. Create components in `src/components/`
3. Add translations to `src/messages/*.json`
4. Add database types to `src/types/database.ts`
5. Update documentation

### Code Quality

- **Lint**: `npm run lint`
- **Type check**: `npx tsc --noEmit`
- **Format**: `npx prettier --write .`

## Key Dependencies Rationale

| Dependency | Purpose | Why |
|------------|---------|-----|
| Next.js 16 | Framework | Latest App Router, Server Components, Turbopack |
| React 19 | UI library | Latest features, better performance |
| Supabase | Backend | Auth, database, RLS, real-time |
| TanStack Query | State | Server state, caching, sync |
| React Hook Form | Forms | Performance, DX, validation |
| Zod | Validation | Type-safe schemas, TypeScript-first |
| next-intl | i18n | Server Components support, simple |
| shadcn/ui | Components | Customizable, accessible, modern |
| Tailwind CSS 4 | Styling | Latest features, CSS variables |
| react-markdown | Markdown | Contract template rendering |

## Known Limitations

1. **No tenant CRUD** - Only authentication implemented
2. **No contract management** - Templates and contracts not implemented
3. **No property management** - Not implemented
4. **No tests** - Testing framework not set up
5. **No API routes** - Using Server Components instead
6. **No E2E tests** - Playwright not configured
7. **No CI/CD** - GitHub Actions not set up

## Next Steps (Phase 2-3)

**Immediate (Phase 2)**:
- Complete password reset flow
- Add email verification
- Add remember me functionality
- Improve error handling
- Add loading skeletons

**Short-term (Phase 3)**:
- Tenant CRUD operations
- Tenant list with search/filter
- Tenant detail pages
- Tenant form validation with Zod

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Deployment Guide](./deployment-guide.md)
- [Design Guidelines](./design-guidelines.md)
- [Project Roadmap](./project-roadmap.md)

## Change Log

### 2025-12-26 - Phase 2 In Progress
- Implemented authentication flow (login, register, forgot password, reset password)
- Created AuthSplitLayout with gradient design
- Built dashboard with collapsible dark sidebar
- Added StatCard, MetricItem, ChartContainer components
- Implemented protected routes with server-side auth check
- Created useAuth hook and auth server actions
- Added design tokens library
- Updated codebase summary with current implementation

### 2025-12-26 - Initial Documentation
- Created codebase summary
- Documented all Phase 1 setup
- Analyzed project structure
- Identified next steps

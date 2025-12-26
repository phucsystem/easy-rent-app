# Codebase Summary

**Last Updated:** 2025-12-26
**Version:** 0.1.0
**Status:** Phase 1 Complete - Foundation Setup

## Overview

Easy Rent is a property rental management application built with Next.js 16, React 19, TypeScript, Supabase, and Tailwind CSS. This document provides a comprehensive summary of the codebase structure, key files, and implementation details.

## Project Structure

```
easy-rent-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css               # Global styles and theme
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx            # Button component
│   │       ├── card.tsx              # Card components
│   │       ├── dialog.tsx            # Dialog/Modal
│   │       ├── dropdown-menu.tsx     # Dropdown menu
│   │       ├── form.tsx              # Form components
│   │       ├── input.tsx             # Input field
│   │       ├── label.tsx             # Form label
│   │       ├── select.tsx            # Select dropdown
│   │       ├── table.tsx             # Table components
│   │       └── textarea.tsx          # Textarea field
│   ├── lib/
│   │   ├── supabase/                 # Supabase client utilities
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server client
│   │   │   └── middleware.ts         # Middleware helpers
│   │   └── utils.ts                  # Utility functions
│   ├── messages/                     # i18n translations
│   │   ├── vi.json                   # Vietnamese
│   │   └── en.json                   # English
│   ├── types/
│   │   └── database.ts               # Database type definitions
│   ├── i18n.ts                       # i18n configuration
│   └── middleware.ts                 # Next.js middleware
├── docs/                             # Documentation
├── plans/                            # Project plans
├── .env.example                      # Environment template
├── components.json                   # shadcn/ui config
├── eslint.config.mjs                 # ESLint configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.mjs                # PostCSS configuration
└── tsconfig.json                     # TypeScript configuration
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
- `next@16.1.1` - React framework
- `react@19.2.3` - UI library
- `@supabase/ssr@^0.8.0` - Supabase SSR integration
- `@supabase/supabase-js@^2.89.0` - Supabase client
- `@tanstack/react-query@^5.90.12` - Server state
- `next-intl@^4.6.1` - Internationalization
- `react-hook-form@^7.69.0` - Form management
- `zod@^4.2.1` - Schema validation

**UI Dependencies**:
- `tailwindcss@^4` - Styling
- `@radix-ui/*` - Headless UI primitives
- `lucide-react@^0.562.0` - Icons
- `class-variance-authority@^0.7.1` - Component variants

**Scripts**:
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Lint code
```

### tsconfig.json

**Key Settings**:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### next.config.ts

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
```

### components.json (shadcn/ui)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Source Code Analysis

### Application Layer (`/src/app`)

#### globals.css

**Purpose**: Global styles and theme configuration using Tailwind CSS v4

**Key Features**:
- Tailwind CSS v4 with `@import "tailwindcss"`
- Custom animations via `tw-animate-css`
- Dark mode support via `@custom-variant dark`
- CSS custom properties for theming
- Design tokens (colors, spacing, radius)

**Theme Colors**:
- Primary: Amber-500 (`245 158 11`)
- Supports light and dark modes
- Full design system tokens (card, popover, sidebar, chart)

#### layout.tsx

**Purpose**: Root layout with font configuration

```typescript
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Note**: Needs to be updated for i18n and actual app metadata

#### page.tsx

**Purpose**: Home/landing page (currently Next.js default)

**Status**: Placeholder, needs to be replaced with actual landing page

### Supabase Integration (`/src/lib/supabase`)

#### client.ts

**Purpose**: Create Supabase browser client for client-side operations

```typescript
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**Usage**: Client components, interactive features

#### server.ts

**Purpose**: Create Supabase server client for Server Components

```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export const createServerClient = async () => {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { /* ... */ },
      },
    }
  );
};
```

**Usage**: Server Components, API routes, Server Actions

#### middleware.ts

**Purpose**: Supabase session refresh in Next.js middleware

```typescript
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient<Database>(...);

  return supabase;
}
```

**Usage**: Session management, auth refresh

### Type Definitions (`/src/types`)

#### database.ts

**Purpose**: TypeScript types for Supabase database schema

**Schema**:
```typescript
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          phone: string;
          id_number: string | null;
          address: string | null;
          date_of_birth: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Insert>;
      };
      contract_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Insert>;
      };
      contracts: {
        Row: {
          id: string;
          user_id: string;
          tenant_id: string;
          template_id: string;
          tenant_snapshot: Json;
          template_snapshot: Json;
          generated_content: string;
          generated_at: string;
          created_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at'>;
        Update: Partial<Insert>;
      };
    };
  };
}
```

**Usage**: Type-safe database queries throughout the app

### Internationalization (`/src/messages`, `/src/i18n.ts`)

#### i18n.ts

**Purpose**: next-intl configuration for Server Components

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

#### vi.json (Vietnamese)

```json
{
  "common": {
    "appName": "Easy Rent",
    "save": "Lưu",
    "cancel": "Hủy",
    // ...
  },
  "nav": {
    "dashboard": "Tổng quan",
    "tenants": "Khách thuê",
    // ...
  },
  "auth": {
    "signIn": "Đăng nhập",
    // ...
  }
}
```

#### en.json (English)

```json
{
  "common": {
    "appName": "Easy Rent",
    "save": "Save",
    "cancel": "Cancel",
    // ...
  }
}
```

### Middleware (`/src/middleware.ts`)

**Purpose**: Next.js middleware for i18n routing

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

### UI Components (`/src/components/ui`)

#### button.tsx

**Features**:
- Class Variance Authority (CVA) for variants
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon, icon-sm, icon-lg
- Support for `asChild` pattern (Radix Slot)

#### card.tsx

**Components**:
- Card: Container
- CardHeader: Header section
- CardTitle: Title
- CardDescription: Description
- CardContent: Content area
- CardFooter: Footer section

#### dialog.tsx

**Features**:
- Modal dialog using Radix UI
- Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose

#### form.tsx

**Features**:
- React Hook Form integration
- Form, FormField, FormItem, FormLabel, FormControl, FormMessage
- Designed for use with shadcn/ui components

#### input.tsx, textarea.tsx, label.tsx, select.tsx

**Features**:
- Form input components
- Consistent styling with design tokens
- Focus and error states

#### table.tsx

**Components**:
- Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell
- Consistent styling and borders

#### dropdown-menu.tsx

**Features**:
- Dropdown menu using Radix UI
- DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut

### Utilities (`/src/lib/utils.ts`)

**Purpose**: Utility functions

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage**: Merge and deduplicate Tailwind classes

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
- `NEXT_PUBLIC_APP_URL`: Application URL (e.g., http://localhost:3000)

## Code Quality Tools

### ESLint (eslint.config.mjs)

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

**Configuration**: Next.js recommended TypeScript rules

### Prettier

**Status**: Prettier installed but no config file (using defaults)

**Recommendation**: Create `.prettierrc` for custom formatting rules

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

## Current Implementation Status

### Phase 1: Foundation (Complete)

- [x] Next.js 16 project setup
- [x] TypeScript configuration
- [x] Tailwind CSS 4 setup
- [x] shadcn/ui component installation
- [x] Supabase client and server setup
- [x] Database type definitions
- [x] Internationalization setup (vi/en)
- [x] Middleware for i18n and auth
- [x] ESLint configuration
- [x] Documentation structure

### Next Steps (Phase 2)

- [ ] Authentication flow implementation
- [ ] Protected routes setup
- [ ] Tenant CRUD operations
- [ ] Contract template management
- [ ] Contract generation system
- [ ] Dashboard with analytics

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

1. **Create database types** in `src/types/database.ts`
2. **Create Supabase queries** using typed client
3. **Build UI components** using shadcn/ui
4. **Implement forms** with React Hook Form + Zod
5. **Add translations** to `src/messages/*.json`
6. **Update documentation**

### Code Quality

- **Lint**: `npm run lint`
- **Type check**: `npx tsc --noEmit`
- **Format**: `npx prettier --write .`

## Key Dependencies Rationale

| Dependency | Purpose | Why |
|------------|---------|-----|
| Next.js 16 | Framework | Latest App Router, Server Components |
| React 19 | UI library | Latest features, better performance |
| Supabase | Backend | Auth, database, RLS, real-time |
| TanStack Query | State management | Server state, caching, sync |
| React Hook Form | Forms | Performance, DX, validation |
| Zod | Validation | Type-safe schemas, TypeScript-first |
| next-intl | i18n | Server Components support, simple |
| shadcn/ui | Components | Customizable, accessible, modern |
| Tailwind CSS 4 | Styling | Latest features, CSS variables |

## Known Limitations

1. **No authentication UI** - Only Supabase client setup
2. **No database migrations** - Schema defined in types only
3. **No tests** - Testing framework not set up
4. **No API routes** - Using Server Components instead
5. **No E2E tests** - Playwright not configured
6. **No CI/CD** - GitHub Actions not set up

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Deployment Guide](./deployment-guide.md)
- [Design Guidelines](./design-guidelines.md)
- [Project Roadmap](./project-roadmap.md)

## Change Log

### 2025-12-26 - Initial Documentation
- Created codebase summary
- Documented all Phase 1 setup
- Analyzed project structure
- Identified next steps

# System Architecture

**Last Updated:** 2025-12-26
**Version:** 0.1.0
**Status:** Phase 1 Complete

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Architecture](#database-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Internationalization](#internationalization)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)
- [Scalability Considerations](#scalability-considerations)

## Architecture Overview

Easy Rent is a **modern web application** built with a **serverless architecture** leveraging Next.js 16 App Router and Supabase as the backend-as-a-service.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  Browser (Client Components)                                      │
│  ├─ React 19.2.3                                                  │
│  ├─ TanStack Query (Client State)                                │
│  ├─ React Hook Form (Form State)                                 │
│  └─ shadcn/ui (UI Components)                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Application Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 16.1.1 (Server Components)                               │
│  ├─ App Router                                                   │
│  ├─ Server Actions                                               │
│  ├─ API Routes (if needed)                                       │
│  ├─ Middleware (i18n, auth)                                      │
│  └─ Server Components (Data Fetching)                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  Supabase                                                         │
│  ├─ PostgreSQL (Database)                                        │
│  ├─ Supabase Auth (Authentication)                               │
│  ├─ Row Level Security (Authorization)                           │
│  └─ Real-time Subscriptions (Future)                             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Principles

1. **Server-First Rendering**: Leverage Next.js Server Components by default
2. **Progressive Enhancement**: Core functionality works without JavaScript
3. **Type Safety**: Full TypeScript coverage from database to UI
4. **Security First**: RLS at database level, secure session management
5. **Performance**: Static generation where possible, dynamic where needed
6. **Scalability**: Stateless architecture, CDN-ready deployment

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | React framework with App Router |
| React | 19.2.3 | UI library |
| TypeScript | 5 | Type safety and DX |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | latest | Component library |
| TanStack Query | 5.90.12 | Server state management |
| React Hook Form | 7.69.0 | Form management |
| Zod | 4.2.1 | Schema validation |
| next-intl | 4.6.1 | Internationalization |

### Backend Stack

| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Primary database |
| Supabase Auth | Authentication |
| Row Level Security | Authorization |
| Next.js API Routes | Serverless functions (if needed) |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel (recommended) | Hosting and deployment |
| Supabase Cloud | Database and auth |
| Supabase Storage | File storage (future) |

## Frontend Architecture

### App Router Structure

```
src/app/
├── [locale]/              # i18n dynamic route
│   ├── (auth)/           # Auth route group
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/      # Dashboard route group
│   │   ├── dashboard/
│   │   ├── tenants/
│   │   ├── templates/
│   │   ├── contracts/
│   │   └── layout.tsx
│   └── layout.tsx        # Root layout for locale
├── api/                  # API routes (if needed)
│   └── webhooks/
├── globals.css
├── layout.tsx            # Root layout
└── page.tsx              # Landing page
```

### Component Architecture

#### Component Hierarchy

```
Layout Components (Server)
├── RootLayout
├── LocaleLayout
└── DashboardLayout

Feature Components
├── TenantList (Server)
│   └── TenantCard (Client)
├── TenantForm (Client)
├── ContractList (Server)
│   └── ContractCard (Client)
└── TemplateList (Server)
    └── TemplateEditor (Client)

UI Components (shadcn/ui)
├── Button
├── Card
├── Dialog
├── Form
├── Input
├── Select
└── Table
```

#### Component Types

**Server Components** (Default)
- Fetch data directly from Supabase
- No client-side JavaScript
- Better performance and SEO
- Cannot use hooks or event handlers

```typescript
// Server Component
export default async function TenantListPage() {
  const supabase = await createServerClient();
  const { data: tenants } = await supabase.from('tenants').select();

  return <TenantGrid tenants={tenants} />;
}
```

**Client Components**
- Interactive elements (forms, buttons)
- Browser APIs
- React hooks
- State management

```typescript
'use client';

export function TenantForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState(initialState);
  return <form onSubmit={onSubmit}>...</form>;
}
```

### Styling Architecture

**Tailwind CSS v4** with CSS variables for theming:

```css
:root {
  --primary: 245 158 11;  /* Amber-500 */
  --background: 250 250 250;
  --foreground: 15 15 15;
}

.dark {
  --primary: 245 158 11;
  --background: 15 15 15;
  --foreground: 250 250 250;
}
```

**Design Tokens**:
- Colors: HSL format for CSS variables
- Spacing: Tailwind spacing scale
- Typography: Geist Sans/Mono fonts
- Radius: Configurable via `--radius` variable
- Shadows: Tailwind shadow utilities

## Backend Architecture

### Serverless Approach

**Next.js Server Components** eliminate the need for a separate API layer in most cases:

```
Traditional API Approach:
Browser → API Route → Database

Server Component Approach:
Browser → Server Component → Database
```

### When to Use API Routes

1. **Webhooks** (Supabase webhooks, payment webhooks)
2. **Secret operations** (don't expose to client)
3. **Heavy processing** (avoid server component timeout)
4. **External API integrations** with rate limits

### Server Actions (Future)

Server Actions provide a simpler alternative to API routes:

```typescript
'use server';

export async function createTenant(formData: FormData) {
  const supabase = await createServerClient();
  // ... validation and database insert
  revalidatePath('/tenants');
}
```

## Database Architecture

### Schema Design

**Tables**:
- `tenants` - Tenant information
- `contract_templates` - Reusable contract templates
- `contracts` - Generated contracts with snapshots

**Relationships**:
```
auth.users (Supabase Auth)
    ↓ 1:N
tenants ←───────┐
    ↓            │
contracts ──────┘
    ↑ N:1
contract_templates
```

### Row Level Security (RLS)

**Policies**:
- **Tenants**: Users can only CRUD their own tenants
- **Templates**: Users can only CRUD their own templates
- **Contracts**: Users can only read contracts they created

**Example Policy**:
```sql
-- Tenants table
CREATE POLICY "Users can view their own tenants"
ON tenants FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tenants"
ON tenants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenants"
ON tenants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenants"
ON tenants FOR DELETE
USING (auth.uid() = user_id);
```

### Database Functions

**Helper Functions** (to be implemented):
- `get_tenant_count(user_id uuid)` - Count user's tenants
- `search_tenants(user_id uuid, query text)` - Full-text search
- `generate_contract_id()` - UUID generation

### Database Triggers

**Automatic Timestamps**:
```sql
-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

## Authentication & Authorization

### Authentication Flow

```
1. User visits /login
2. Enters credentials
3. Supabase Auth validates
4. Session created
5. Middleware refreshes session
6. User redirected to dashboard
```

### Supabase Auth Integration

**Client Setup**:
```typescript
// src/lib/supabase/client.ts
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**Server Setup**:
```typescript
// src/lib/supabase/server.ts
export const createServerClient = async () => {
  const cookieStore = await cookies();
  return createSupabaseServerClient<Database>(...);
};
```

**Middleware Setup**:
```typescript
// src/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient<Database>(...);
  return supabase;
}
```

### Session Management

**Middleware Refresh**:
```typescript
// src/middleware.ts
export default createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
});
```

**Session Flow**:
1. Middleware intercepts request
2. Refreshes Supabase session
3. Passes session to Server Components
4. Components access user via `supabase.auth.getUser()`

### Authorization Strategy

**Database-Level (RLS)**:
- Primary authorization mechanism
- Policies enforce user ownership
- Cannot be bypassed

**Application-Level**:
- Server Components check `user_id`
- API routes verify authentication
- Protected pages redirect unauthenticated users

## Internationalization

### i18n Architecture

**next-intl Configuration**:
```typescript
// src/i18n.ts
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale || 'vi';
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

**Supported Locales**:
- Vietnamese (vi) - Default
- English (en)

**URL Structure**:
- `https://domain.com/vi/tenants` - Vietnamese
- `https://domain.com/en/tenants` - English
- `https://domain.com/tenants` - Redirects to `/vi/tenants`

**Translation Files**:
```
src/messages/
├── vi.json  # Vietnamese translations
└── en.json  # English translations
```

**Translation Structure**:
```json
{
  "common": {
    "appName": "Easy Rent",
    "save": "Lưu"
  },
  "tenants": {
    "title": "Khách thuê",
    "add": "Thêm khách"
  }
}
```

**Usage in Components**:
```typescript
import { useTranslations } from 'next-intl';

export function TenantCard() {
  const t = useTranslations('tenants');
  return <h1>{t('title')}</h1>;
}
```

## State Management

### State Management Strategy

**Server State** (TanStack Query):
- Remote data from Supabase
- Caching and synchronization
- Background refetching
- Optimistic updates

**Form State** (React Hook Form):
- Form inputs and validation
- Zod schema validation
- Uncontrolled components
- Minimal re-renders

**URL State** (Next.js):
- Search params (filters, pagination)
- Route params (resource IDs)
- Query state serialization

**Global UI State** (Context):
- Theme (dark/light mode)
- Auth state
- Sidebar toggle state
- Minimal usage

### TanStack Query Setup

```typescript
// Query Client Provider (Client Component)
'use client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

### Query Keys Organization

```typescript
// Query keys factory
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (filters: string) => [...tenantKeys.lists(), { filters }] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
};
```

## API Layer

### Supabase Client Usage

**Server Components**:
```typescript
export default async function Page() {
  const supabase = await createServerClient();
  const { data } = await supabase.from('tenants').select();
  return <TenantList data={data} />;
}
```

**Client Components**:
```typescript
'use client';

export function TenantList() {
  const { data } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.from('tenants').select();
      return data;
    },
  });
  return <div>{/* ... */}</div>;
}
```

### Type Safety

**Generated Database Types**:
```typescript
// src/types/database.ts
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: { /* ... */ };
        Insert: { /* ... */ };
        Update: { /* ... */ };
      };
    };
  };
}
```

**Typed Queries**:
```typescript
const supabase = createClient<Database>();
// Full autocomplete and type checking
const { data } = await supabase.from('tenants').select('full_name, phone');
```

## Security Architecture

### Security Layers

**1. Environment Variables**:
```bash
NEXT_PUBLIC_SUPABASE_URL=           # Public (safe)
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Public (safe, RLS protected)
SUPABASE_SERVICE_ROLE_KEY=          # Private (never expose)
```

**2. Row Level Security (RLS)**:
- Enabled on all tables
- Policies enforce ownership
- Service role bypasses RLS (server only)

**3. Session Management**:
- Secure HTTP-only cookies
- Automatic refresh via middleware
- Short-lived access tokens

**4. Input Validation**:
- Zod schemas on all inputs
- Parameterized queries (Supabase)
- XSS protection (React escaping)

**5. CORS & CSP**:
- Restrict API origins
- Content Security Policy headers
- HTTPS only in production

### Security Best Practices

**Do's**:
- Use RLS for all data access
- Validate all user inputs
- Use environment variables for secrets
- Enable Supabase audit logs
- Regular security audits

**Don'ts**:
- Never expose service role key to client
- Never bypass RLS in client code
- Never trust client-side validation only
- Never log sensitive data

## Deployment Architecture

### Vercel Deployment (Recommended)

**Build Configuration**:
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // No special config needed for basic deployment
};
```

**Environment Variables**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```

**Deployment Flow**:
```
1. Push to main branch
2. GitHub webhook triggers Vercel
3. Vercel builds Next.js app
4. Deployed to edge network
5. Zero-downtime deployment
```

### Performance Optimization

**1. Static Generation**:
- Landing page: Static
- Marketing pages: Static
- Dashboard pages: Dynamic (auth required)

**2. Image Optimization**:
- Next.js Image component
- Automatic WebP/AVIF conversion
- Lazy loading
- Responsive images

**3. Code Splitting**:
- Automatic with App Router
- Route-based splitting
- Dynamic imports for heavy components

**4. Caching Strategy**:
- Static assets: CDN cache
- API responses: TanStack Query cache
- Database: Supabase connection pooling

## Scalability Considerations

### Current Limitations

**Supabase Free Tier**:
- 500MB database storage
- 1GB file storage
- 50k MAU
- 1GB bandwidth/month

### Scaling Strategy

**Phase 1** (Current):
- Supabase Free Tier
- Vercel Hobby
- < 100 users

**Phase 2** (Growth):
- Supabase Pro Tier
- Vercel Pro
- < 1,000 users

**Phase 3** (Scale):
- Supabase Team/Premium
- Vercel Enterprise
- Dedicated database (if needed)
- CDN optimization

### Performance Targets

- **Page Load**: < 2s (3G)
- **Time to Interactive**: < 3s
- **API Response**: < 500ms (p95)
- **Database Query**: < 100ms (average)

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [Codebase Summary](./codebase-summary.md)
- [Deployment Guide](./deployment-guide.md)

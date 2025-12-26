# Code Standards & Development Guidelines

**Last Updated:** 2025-12-26
**Version:** 0.3.0
**Status:** Active

## Table of Contents
- [Code Style](#code-style)
- [TypeScript Standards](#typescript-standards)
- [React/Next.js Standards](#reactnextjs-standards)
- [Component Standards](#component-standards)
- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)
- [Import Standards](#import-standards)
- [Testing Standards](#testing-standards)
- [Git Workflow](#git-workflow)
- [Code Review Guidelines](#code-review-guidelines)

## Code Style

### General Principles
- **KISS**: Keep It Simple, Stupid
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It

### Formatting
- Use **Prettier** for code formatting
- Configure in `.prettierrc` or project settings
- Format on save recommended
- Indentation: 2 spaces
- Semicolons: Required
- Quotes: Single quotes for JSX, double for strings
- Trailing commas: Required (except in single-line objects/arrays)

### Linting
- **ESLint** with Next.js configuration
- Run `npm run lint` before commits
- Fix all linting errors before PR
- Use ESLint auto-fix where possible

## TypeScript Standards

### Type Safety
- **Strict mode enabled** in `tsconfig.json`
- **No `any` types** unless absolutely necessary
- **Use `unknown` instead of `any`** for dynamic data
- **Type imports** for types only: `import { type MyType }`
- **Prefer interface** for object shapes
- **Prefer type** for unions, intersections, primitives

```typescript
// Good
interface User {
  id: string;
  name: string;
}

type Status = 'active' | 'inactive';

// Bad
type User = {
  id: any;
  name: any;
};
```

### Type Definitions
- **Centralize types** in `/src/types` directory
- **Export types** from barrel files
- **Use Supabase generated types** for database operations
- **Document complex types** with JSDoc comments

```typescript
/**
 * Represents a tenant in the system
 */
export interface Tenant {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  idNumber?: string;
  address?: string;
  dateOfBirth?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Type Assertions
- **Avoid type assertions** (`as`)
- **Use type guards** for runtime checks
- **Prefer type narrowing** with `in`, `typeof`, `instanceof`

```typescript
// Good
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Bad
const str = value as string;
```

## React/Next.js Standards

### Component Structure
- **Functional components** only (no class components)
- **Use hooks** for state and side effects
- **Prefer composition** over inheritance
- **Props destructuring** in function signature

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Hooks Usage
- **Custom hooks** in `/src/hooks` directory
- **Prefix custom hooks** with `use`
- **Extract complex logic** into custom hooks
- **Follow rules of hooks** (no conditionals, loops)

**Implemented Hooks**:

**useAuth** (`src/hooks/use-auth.tsx`):
```typescript
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => { /* ... */ };
  const signUp = async (email: string, password: string) => { /* ... */ };
  const signOut = async () => { /* ... */ };

  return { user, loading, signIn, signUp, signOut };
}
```

**Future Hooks**:
```typescript
// Good - Planned hooks
function useTenant(id: string) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenant(id).then(setTenant).finally(() => setLoading(false));
  }, [id]);

  return { tenant, loading };
}
```

### Server Components vs Client Components
- **Use Server Components** by default (App Router default)
- **Add `use client`** directive only when needed:
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - React hooks (useState, useEffect)
  - Third-party libraries requiring browser context

```typescript
// Server Component (default)
export default async function TenantList() {
  const tenants = await getTenants();
  return <TenantGrid tenants={tenants} />;
}

// Client Component
'use client';

export function TenantForm({ onSubmit }: FormProps) {
  const [value, setValue] = useState('');
  return <form onSubmit={onSubmit}>...</form>;
}
```

### State Management
- **Server state**: TanStack Query (React Query)
- **Form state**: React Hook Form + Zod
- **URL state**: Next.js useSearchParams
- **Global UI state**: React Context (minimal usage)
- **Local component state**: useState

### Data Fetching
- **Server Components**: Direct async/await
- **Client Components**: TanStack Query
- **Loading states**: Show skeletons/spinners
- **Error handling**: Catch and display user-friendly errors

```typescript
// Server Component
export default async function DashboardPage() {
  const data = await fetchData();
  return <Dashboard data={data} />;
}

// Client Component with React Query
'use client';

export function TenantList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: getTenants,
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  return <TenantGrid tenants={data} />;
}
```

## Component Standards

### Custom Components

**AuthSplitLayout** (`src/components/auth/auth-split-layout.tsx`):
- Split-screen layout for authentication pages
- Left panel: Gradient with geometric shapes
- Right panel: Form container
- Responsive: Stacks on mobile

**Dashboard Components**:
- **DashboardLayout**: Main dashboard wrapper
- **DashboardSidebar**: Collapsible dark sidebar
- **DashboardHeader**: Header with user menu
- **StatCard**: Metric card with trend indicators
- **MetricItem**: Simple metric display
- **ChartContainer**: Chart wrapper

### shadcn/ui Components
- **Use existing shadcn/ui components** when possible
- **Extend components** via composition or variants
- **Follow component patterns** for custom components
- **Keep components in `/src/components/ui`**

```typescript
// Using shadcn/ui Button
import { Button } from '@/components/ui/button';

export function TenantActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <Button onClick={onEdit} variant="outline">Edit</Button>
      <Button onClick={onDelete} variant="destructive">Delete</Button>
    </div>
  );
}
```

### Component Variants
- **Use CVA (class-variance-authority)** for variants
- **Define variants** at component level
- **Support size, color, style variants**

```typescript
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-background",
        outlined: "border-2",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

### Props Interface
- **Define props interface** separately
- **Use descriptive prop names**
- **Provide sensible defaults**
- **Document complex props** with JSDoc

```typescript
interface TenantCardProps {
  tenant: Tenant;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function TenantCard({ tenant, onEdit, onDelete, className }: TenantCardProps) {
  // ...
}
```

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (`TenantCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Hooks**: camelCase with `use` prefix (`useTenant.ts`)
- **Types**: PascalCase types, camelCase files (`types/tenant.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL.ts`)

### Variables and Functions
- **Variables/Functions**: camelCase (`userName`, `fetchTenants`)
- **Classes/Interfaces/Types**: PascalCase (`Tenant`, `TenantService`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Private properties**: Underscore prefix (`_internalValue`)

### Component Names
- **File name = Component name**
- **Export default** for page components
- **Export named** for reusable components

```typescript
// TenantCard.tsx
export function TenantCard({ tenant }: Props) {
  // ...
}
```

### Database Names
- **Tables**: snake_case plural (`contract_templates`)
- **Columns**: snake_case (`created_at`, `user_id`)
- **Functions**: snake_case (`get_tenant_by_id`)

## File Organization

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # i18n routing
│   │   ├── dashboard/
│   │   ├── tenants/
│   │   └── layout.tsx
│   ├── api/               # API routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── tenants/           # Feature-specific components
│   │   ├── TenantCard.tsx
│   │   ├── TenantForm.tsx
│   │   └── index.ts
│   └── shared/            # Shared components
├── lib/
│   ├── supabase/          # Supabase clients
│   └── utils.ts           # Utilities
├── hooks/
│   ├── useTenant.ts
│   └── useContract.ts
├── types/
│   ├── database.ts        # Supabase types
│   └── tenant.ts          # Feature types
├── messages/              # i18n messages
│   ├── vi.json
│   └── en.json
├── i18n.ts                # i18n config
└── middleware.ts          # Next.js middleware
```

### Feature-Based Organization
- **Group by feature** (auth, dashboard, tenants, contracts)
- **Keep related files together**
- **Use index files** for clean imports

```typescript
// tenants/index.ts
export { TenantCard } from './TenantCard';
export { TenantForm } from './TenantForm';
export { TenantList } from './TenantList';

// Usage
import { TenantCard, TenantForm } from '@/components/tenants';
```

**Current Feature Directories**:
- `components/auth/` - Authentication components
- `components/dashboard/` - Dashboard components
- `components/ui/` - shadcn/ui components
- `hooks/` - Custom React hooks
- `lib/actions/` - Server actions
- `lib/supabase/` - Supabase clients and helpers
- `lib/` - Utilities and design tokens

## Import Standards

### Import Order
1. React/Next.js imports
2. Third-party libraries
3. Internal imports (alias)
4. Relative imports
5. Type-only imports

```typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/hooks/useTenant';
import type { Tenant } from '@/types/tenant';
import { formatDate } from '../utils/formatDate';
```

### Path Aliases
- **Use `@/` alias** for src directory
- **Avoid relative imports** for deep nesting
- **Configure in `tsconfig.json`**

```typescript
// Good
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

// Bad (for deep nesting)
import { Button } from '../../../components/ui/button';
import { formatDate } from '../../lib/utils';
```

### Absolute Imports
- **Prefer absolute imports** over relative
- **Use barrel exports** (`index.ts`) for clean imports
- **Keep import paths** short and readable

```typescript
// Good
import { TenantService } from '@/services/tenant';

// Acceptable for local files
import { TenantCard } from './TenantCard';
```

## Testing Standards

### Testing Strategy
- **Unit tests**: Business logic, utilities, hooks
- **Integration tests**: API routes, database operations
- **E2E tests**: Critical user flows
- **Component tests**: Interactive components

### Testing Tools (Future)
- **Jest/Vitest**: Unit and integration tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **MSW**: API mocking

### Test Organization
```
src/
├── components/
│   ├── tenants/
│   │   ├── TenantCard.tsx
│   │   └── TenantCard.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
└── __tests__/
    └── e2e/
        └── tenant-flow.spec.ts
```

### Test Writing Guidelines
- **Arrange-Act-Assert** pattern
- **Test user behavior**, not implementation
- **Use descriptive test names**
- **Mock external dependencies**

```typescript
describe('TenantService', () => {
  it('should create a new tenant', async () => {
    // Arrange
    const tenantData = { name: 'John Doe', phone: '123456789' };

    // Act
    const tenant = await createTenant(tenantData);

    // Assert
    expect(tenant).toHaveProperty('id');
    expect(tenant.name).toBe('John Doe');
  });
});
```

## Git Workflow

### Branch Naming
- **feature/** - New features (`feature/tenant-management`)
- **fix/** - Bug fixes (`fix/login-error`)
- **refactor/** - Code refactoring (`refactor/supabase-client`)
- **docs/** - Documentation (`docs/api-endpoints`)
- **chore/** - Maintenance (`chore/update-deps`)

### Commit Messages
- **Conventional Commits** format
- **Present tense**, imperative mood
- **Describe what and why**, not how

```
feat(tenants): add tenant search functionality

Implement search by name and phone number with debouncing.
Fixes #123

BREAKING CHANGE: Tenant list API now requires query param.
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements

## Code Review Guidelines

### Review Checklist
- [ ] Code follows project standards
- [ ] TypeScript types are correct
- [ ] Components are reusable and testable
- [ ] Error handling is proper
- [ ] No hardcoded values or secrets
- [ ] Accessibility considered
- [ ] Performance optimized
- [ ] Tests added/updated
- [ ] Documentation updated

### Review Process
1. **Self-review** before requesting review
2. **Keep PRs small** (max 400 lines)
3. **Describe changes** in PR description
4. **Address all comments** or explain reasoning
5. **Request approval** from team member

## Feature Implementation: Tenant Management

### Architecture Pattern

The tenant management feature follows a clean architecture pattern with separation of concerns:

```
Routes (Server)
    ↓
Client Components (Client)
    ↓
Custom Hooks (Client/TanStack Query)
    ↓
Service Layer (tenantService)
    ↓
Supabase Client (RLS enforced)
    ↓
PostgreSQL Database
```

### File Structure

```
src/
├── app/[locale]/dashboard/tenants/
│   ├── page.tsx                          # List page (server)
│   ├── tenant-page-client.tsx            # List logic (client)
│   ├── new/
│   │   ├── page.tsx                      # Create page (server)
│   │   └── tenant-new-client.tsx         # Create form (client)
│   ├── [id]/
│   │   ├── page.tsx                      # Detail page (server)
│   │   ├── tenant-detail-client.tsx      # Detail view (client)
│   │   └── edit/
│   │       ├── page.tsx                  # Edit page (server)
│   │       └── tenant-edit-client.tsx    # Edit form (client)
│   └── loading.tsx                       # Loading skeleton
├── components/tenants/
│   ├── tenant-card-list.tsx              # Mobile card layout
│   ├── tenant-table.tsx                  # Desktop table layout
│   ├── tenant-form.tsx                   # Shared form component
│   ├── tenant-form-dialog.tsx            # Form dialog wrapper
│   ├── tenant-search.tsx                 # Search/filter component
│   ├── tenant-delete-dialog.tsx          # Delete confirmation
│   ├── tenant-empty-state.tsx            # Empty state display
│   └── tenant-skeleton.tsx               # Loading skeleton
├── lib/services/
│   ├── tenant-service.ts                 # API operations
│   └── __tests__/
│       └── tenant-service.test.ts        # Service tests
├── lib/validations/
│   └── tenant.ts                         # Zod schemas
├── hooks/
│   └── use-tenants.ts                    # Custom React hook
└── types/
    └── tenant.ts                         # Type definitions & mappers
```

### Tenant Service Pattern

```typescript
// src/lib/services/tenant-service.ts
export const tenantService = {
  async list(params: TenantListParams): Promise<TenantListResponse> {
    // Implemented with pagination, search, sorting
    // RLS enforced at database level
    // SQL injection protected via LIKE escaping
  },

  async getById(id: string): Promise<Tenant> {
    // Single tenant retrieval
    // RLS enforced (user_id filtering)
  },

  async create(input: CreateTenantInput): Promise<Tenant> {
    // Create new tenant with validation
    // User ID injected from auth session
  },

  async update(id: string, input: UpdateTenantInput): Promise<Tenant> {
    // Update existing tenant
    // Only provided fields updated
  },

  async delete(id: string): Promise<void> {
    // Delete tenant (RLS enforced)
    // Permanent operation
  },

  async checkIdCardExists(idCard: string, excludeId?: string): Promise<boolean> {
    // Validation helper for unique ID card check
  }
};
```

### Validation Pattern

```typescript
// src/lib/validations/tenant.ts
export const tenantFormSchema = z.object({
  fullName: z.string().min(2).max(100),
  idCard: z.string().regex(/^[0-9]{12}$/),
  phone: z.string().regex(/^0[35789][0-9]{8}$/),
  email: z.string().email().or(z.literal('')),
  currentAddress: z.string().min(1).max(500),
  permanentAddress: z.string().max(500),
});
```

**Validation Rules**:
- Vietnamese phone: 10 digits starting with 0[35789]
- Vietnamese ID card: Exactly 12 digits
- Email: Optional but must be valid if provided
- Full name: 2-100 characters
- Addresses: 1-500 characters

### Type Mapping Pattern

```typescript
// Database row (snake_case) → Domain model (camelCase)
export function toTenant(row: TenantRow): Tenant {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    idCard: row.id_card,
    phone: row.phone,
    email: row.email,
    currentAddress: row.current_address,
    permanentAddress: row.permanent_address,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
```

### React Component Pattern

**Server Component**:
```typescript
// src/app/[locale]/dashboard/tenants/new/page.tsx
export default function NewTenantPage() {
  return <TenantNewClient />;
}
```

**Client Component** (with TanStack Query):
```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService } from '@/lib/services/tenant-service';
import { TenantForm } from '@/components/tenants/tenant-form';

export function TenantNewClient() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: tenantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    }
  });

  return <TenantForm onSubmit={mutate} isLoading={isPending} />;
}
```

### Search & Filter Pattern

```typescript
// Search with SQL injection protection
const escapedSearch = search.replace(/[%_]/g, '\\$&');
query = query.or(
  `full_name.ilike.%${escapedSearch}%,`
  + `phone.ilike.%${escapedSearch}%,`
  + `id_card.ilike.%${escapedSearch}%,`
  + `email.ilike.%${escapedSearch}%`
);
```

### Error Handling Pattern

```typescript
try {
  const tenant = await tenantService.create(data);
} catch (error) {
  if (error instanceof ZodError) {
    // Validation error - show field-level messages
    setFieldErrors(error.fieldErrors);
  } else if (error.code === 'PGRST999') {
    // RLS policy violation
    showError('Access denied');
  } else {
    // Generic error
    showError(error.message);
  }
}
```

### Testing Pattern

```typescript
describe('tenantService.create', () => {
  it('should create tenant with valid data', async () => {
    const input: CreateTenantInput = {
      fullName: 'Nguyen Van A',
      idCard: '123456789012',
      phone: '0912345678',
      email: 'test@example.com',
      currentAddress: '123 Nguyen Hue',
      permanentAddress: '456 Le Loi'
    };

    const result = await tenantService.create(input);
    expect(result.id).toBeDefined();
    expect(result.userId).toBeDefined();
  });

  it('should validate Vietnamese phone format', async () => {
    await expect(() =>
      tenantService.create({
        ...validInput,
        phone: '1234567890' // Invalid format
      })
    ).rejects.toThrow();
  });
});
```

### i18n Pattern

```typescript
// src/messages/vi.json
{
  "validation": {
    "fullNameMin": "Tên phải ít nhất 2 ký tự",
    "phoneInvalid": "Số điện thoại phải ở định dạng Việt Nam (0xx xxxxxxx)",
    "idCardInvalid": "Mã ID phải gồm 12 chữ số"
  },
  "tenants": {
    "create": "Tạo mới",
    "edit": "Chỉnh sửa",
    "delete": "Xóa",
    "search": "Tìm kiếm..."
  }
}
```

### Security Best Practices

1. **RLS Enforcement**: All queries filtered by `user_id`
2. **Input Validation**: Zod schemas on client and server
3. **SQL Injection Protection**: LIKE pattern escaping
4. **Type Safety**: TypeScript strict mode
5. **CSRF Protection**: Next.js built-in
6. **XSS Prevention**: React auto-escaping
7. **Authentication Check**: Server actions validate session

## Related Documentation

- [Tenant API Documentation](./api-tenant-management.md)
- [Project Overview & PDR](./project-overview-pdr.md)
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)
- [Deployment Guide](./deployment-guide.md)

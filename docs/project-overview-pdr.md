# Project Overview & Product Development Requirements (PDR)

**Last Updated:** 2025-12-26
**Version:** 0.4.0
**Status:** Phase 4 In Progress - Contract Template Management

## Project Overview

**Easy Rent** is a web-based property rental management application designed to help landlords and property managers in Vietnam streamline their rental operations. The application focuses on tenant management, contract generation, and property tracking.

### Project Vision

To provide a simple, efficient, and localized solution for managing rental properties, tenants, and contracts in the Vietnamese market.

### Target Audience

- Individual landlords renting out properties
- Small-scale property management companies
- Real estate agents managing multiple rental properties

## Technology Stack

### Frontend Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety and developer experience

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui (New York style)** - Pre-built UI components built on Radix UI
- **tw-animate-css** - Tailwind animations
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database
  - Authentication (via Supabase Auth)
  - Real-time subscriptions
  - Row Level Security (RLS)

### Internationalization
- **next-intl 4.6.1** - Internationalization with support for:
  - Vietnamese (vi) - Default locale
  - English (en)

### Form Management & Validation
- **React Hook Form 7.69.0** - Form state management
- **Zod 4.2.1** - Schema validation
- **@hookform/resolvers 5.2.2** - Form validation integration

### Content Rendering
- **react-markdown 10.1.0** - Markdown rendering for contract templates
- **tw-animate-css 1.4.0** - Tailwind animations

### Data Fetching & State Management
- **TanStack Query 5.90.12** - Server state management
- **TanStack Query DevTools 5.91.1** - Debugging tools

### Utilities
- **date-fns 4.1.0** - Date manipulation and formatting
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.4.0** - Merge Tailwind classes
- **class-variance-authority 0.7.1** - Component variant management

### Code Quality
- **ESLint 9** - Linting with Next.js configuration
- **Prettier 3.7.4** - Code formatting
- **TypeScript** - Static type checking

## Product Development Requirements (PDR)

### Core Features

#### 1. Tenant Management (Priority: High)
**Requirements:**
- Create, read, update, and delete tenant profiles
- Store tenant information:
  - Full name (required)
  - Phone number (required)
  - ID number (optional)
  - Address (optional)
  - Date of birth (optional)
  - Notes (optional)
- Search and filter tenants
- View tenant history and contracts

**Acceptance Criteria:**
- All CRUD operations functional
- Form validation for required fields
- Vietnamese phone number validation
- Responsive design for mobile devices

#### 2. Contract Templates (Priority: High) - PHASE 4
**Requirements:**
- Create, read, update, and delete contract templates
- Support variable substitution with {{variable}} syntax
- 3 default Vietnamese templates included:
  - Residential lease agreement (Hợp đồng thuê nhà dân dụng)
  - Commercial property lease (Hợp đồng thuê kinh doanh)
  - Short-term rental agreement (Hợp đồng thuê ngắn hạn)
- Support 14+ standard template variables:
  - Tenant info: full name, ID card, phone, email, address
  - Landlord info: name, ID card, phone
  - Property info: address
  - Financial: monthly rent, deposit, payment date
  - Dates: contract date, start date, end date
- XSS-safe variable replacement with HTML entity escaping
- RLS-protected template management (user-owned + defaults)
- Mobile-responsive UI for template CRUD
- Search and pagination for template lists

**Acceptance Criteria:**
- [x] Full CRUD operations functional
- [x] Variable substitution working with XSS protection
- [x] 3 default Vietnamese templates seeded
- [x] Template clone functionality
- [x] Responsive design (mobile + desktop)
- [x] RLS policies enforcing user ownership
- [x] Search and filter capabilities
- [x] Type-safe TypeScript implementation

#### 3. Contract Generation (Priority: High)
**Requirements:**
- Generate contracts from templates and tenant data
- Save snapshots of tenant and template data at generation time
- Store generated contract content
- Export contracts as PDF
- View contract history

**Acceptance Criteria:**
- One-click contract generation
- Data snapshot preservation
- PDF export functionality
- Contract list with search and filters

#### 4. Authentication & Authorization (Priority: Medium)
**Requirements:**
- User authentication via Supabase Auth
- Email/password authentication
- Session management with Supabase SSR
- Protected routes for authenticated users
- User profile management
- Password reset flow
- Email verification

**Acceptance Criteria:**
- Secure authentication flow
- Automatic session refresh
- Protected API routes
- Role-based access control (future)
- Password reset via email
- Email confirmation on registration

#### 5. Dashboard (Priority: Medium)
**Requirements:**
- Overview of rental properties
- Active contracts summary
- Recent tenant activities
- Payment tracking (future)
- Quick actions for common tasks

**Acceptance Criteria:**
- Statistics cards with key metrics
- Recent activity feed
- Quick action buttons
- Responsive layout

### Non-Functional Requirements

#### Performance
- Page load time < 2 seconds on 3G
- Interactive time < 3 seconds
- Smooth animations (60fps)
- Optimized images and assets

#### Security
- Row Level Security (RLS) enabled in Supabase
- Secure session management
- Input validation on all forms
- XSS protection
- CSRF protection
- Environment variable management

#### Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators on all interactive elements

#### Internationalization
- Vietnamese as primary language
- English secondary language
- Proper date/time formatting
- Number formatting (VND currency)
- RTL support consideration (future)

## Database Schema

### Tables

#### tenants
```typescript
{
  id: string (uuid, primary key)
  user_id: string (uuid, foreign key to auth.users)
  full_name: string (not null)
  phone: string (not null)
  id_number: string (nullable)
  address: string (nullable)
  date_of_birth: string (nullable, date)
  note: string (nullable, text)
  created_at: string (timestamp)
  updated_at: string (timestamp)
}
```

#### contract_templates
```typescript
{
  id: string (uuid, primary key)
  user_id: string (uuid, foreign key to auth.users, nullable for defaults)
  name: string (not null)
  content: string (not null)
  variables: jsonb (array of TemplateVariable, default: [])
  is_default: boolean (not null, default: false)
  created_at: string (timestamp)
  updated_at: string (timestamp)
}
```

**Indexes:**
- idx_contract_templates_user_id (user_id)
- idx_contract_templates_name (name)
- idx_contract_templates_is_default (is_default)
- idx_contract_templates_created_at (created_at DESC)

**RLS Policies:**
- SELECT: Users can view own templates and all default templates
- INSERT: Users can create own templates (auth.uid() = user_id)
- UPDATE: Users can update own templates
- DELETE: Users can delete own non-default templates

#### contracts
```typescript
{
  id: string (uuid, primary key)
  user_id: string (uuid, foreign key to auth.users)
  tenant_id: string (uuid, foreign key to tenants)
  template_id: string (uuid, foreign key to contract_templates)
  tenant_snapshot: json (tenant data at generation time)
  template_snapshot: json (template data at generation time)
  generated_content: string (not null, text)
  generated_at: string (timestamp)
  created_at: string (timestamp)
}
```

## Phase 1 Implementation Status (Complete)

### Completed Tasks
- [x] Project initialization with Next.js 16
- [x] TypeScript configuration
- [x] Tailwind CSS 4 setup
- [x] shadcn/ui component installation
- [x] Supabase client and server setup
- [x] Database type definitions
- [x] Internationalization setup (vi/en)
- [x] Middleware for i18n routing
- [x] Environment configuration
- [x] ESLint and Prettier setup
- [x] Project documentation structure

## Phase 2 Implementation Status (100% Complete)

### Completed Tasks
- [x] Authentication flow (login, register, forgot password, reset password)
- [x] Split-screen auth layout with gradient design
- [x] Dashboard with collapsible dark sidebar
- [x] Dashboard header with user menu
- [x] Stat cards component for metrics
- [x] Protected routes with server-side auth check
- [x] Custom auth hook (useAuth)
- [x] Server actions for signOut
- [x] Design tokens library

### In Progress
- [x] Complete password reset flow with token validation
- [x] Email verification flow
- [x] Remember me functionality

### Pending
- [ ] User profile management
- [ ] Session timeout handling
- [ ] Auth error improvements

## Phase 3 Implementation Status (100% Complete)

### Completed Tasks
- [x] Full CRUD operations for tenant management
- [x] Tenant list page with pagination and search
- [x] Tenant detail page with view-only display
- [x] Tenant creation form with client-side validation
- [x] Tenant edit form with update functionality
- [x] Delete functionality with confirmation dialog
- [x] Mobile-responsive UI (card + table layouts)
- [x] Vietnamese phone number validation (regex: 0[35789][0-9]{8})
- [x] Vietnamese ID card validation (regex: 12 digits)
- [x] Tenant service with search, filter, and pagination
- [x] TanStack Query integration for optimistic updates
- [x] Toast notifications for user feedback
- [x] Type-safe TypeScript types and mappers
- [x] SQL injection protection via LIKE pattern escaping
- [x] Supabase RLS policy enforcement
- [x] Component library (card, table, form, dialog, search)
- [x] i18n support (Vietnamese/English)
- [x] 94 tests with 100% coverage
- [x] Accessibility compliance (focus states, semantic HTML)

### Test Coverage
- Unit tests: 94 tests across components, services, and validations
- Coverage: 100% for critical paths
- E2E scenarios: Create, read, update, delete operations

## Phase 4 Implementation Status (In Progress - Contract Template Management)

### Completed Tasks
- [x] Database schema for contract_templates table
- [x] RLS policies for template access control
- [x] Default template seeding (3 Vietnamese templates)
- [x] Type definitions (ContractTemplate, TemplateVariable, etc.)
- [x] Type mappers (toContractTemplate, toContractTemplateInsert, etc.)
- [x] Contract template service with full CRUD operations
- [x] Variable substitution with XSS-safe HTML entity escaping
- [x] Template variable extraction from content
- [x] Template cloning functionality
- [x] API routes for template CRUD
- [x] UI components for template management
- [x] Template list page with pagination and search
- [x] Template detail/view page
- [x] Template creation form
- [x] Template edit form
- [x] Template delete functionality with confirmation
- [x] Mobile-responsive design
- [x] i18n support for template UI

### Features
- **Variable Substitution**: {{variable}} syntax with regex-based replacement
- **XSS Protection**: HTML entity escaping (& < > " ')
- **Default Templates**: 3 pre-configured Vietnamese templates
- **Template Variables**: 14+ standard variables for tenant, landlord, property, and financial data
- **User Isolation**: RLS policies ensure users can only access their own templates
- **Search & Filter**: Full-text search on name and content
- **Pagination**: Configurable page size for template lists
- **Clone Support**: Duplicate templates without creating base copies
- **Type Safety**: Complete TypeScript coverage for all operations

### Configuration Files
- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript compiler options
- **next.config.ts** - Next.js configuration with next-intl
- **postcss.config.mjs** - PostCSS with Tailwind
- **eslint.config.mjs** - ESLint configuration
- **components.json** - shadcn/ui configuration
- **.env.example** - Environment variable template

## Project Structure

```
easy-rent-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── globals.css      # Global styles with Tailwind
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   ├── supabase/        # Supabase client utilities
│   │   │   ├── client.ts    # Browser client
│   │   │   ├── server.ts    # Server client
│   │   │   └── middleware.ts # Middleware helpers
│   │   └── utils.ts         # Utility functions (cn helper)
│   ├── messages/            # i18n translation files
│   │   ├── vi.json          # Vietnamese translations
│   │   └── en.json          # English translations
│   ├── types/
│   │   └── database.ts      # Supabase type definitions
│   ├── i18n.ts              # next-intl configuration
│   └── middleware.ts        # Next.js middleware for i18n
├── docs/                    # Project documentation
├── plans/                   # Project plans
├── .env.example             # Environment variables template
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

## Success Metrics

### Technical Metrics
- 100% TypeScript coverage
- 95%+ test coverage (future)
- Lighthouse score > 90
- Zero high-severity security vulnerabilities
- < 2s page load time

### User Experience Metrics
- Time to add tenant < 30 seconds
- Time to generate contract < 10 seconds
- Zero critical bugs in production
- < 5% session timeout rate

## Technical Constraints

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android 14+

### Environment Constraints
- Node.js 18+ required
- Supabase account required
- Modern web browser required

### Deployment Constraints
- Vercel (recommended) or compatible Node.js hosting
- Supabase project must be configured
- Environment variables must be set

## Dependencies & External Services

### Required Services
1. **Supabase Project**
   - Database: PostgreSQL
   - Authentication: Enabled
   - RLS: Enabled
   - Project URL and Anon Key required

### External APIs
- None currently (all data via Supabase)

## Future Enhancements

### Phase 2 - Core Features (Planned)
- Authentication flow implementation
- Tenant CRUD operations
- Contract template management
- Contract generation system
- Dashboard with analytics

### Phase 3 - Advanced Features (Future)
- Payment tracking
- Document upload/storage
- Email notifications
- Multi-property management
- Mobile-responsive improvements
- PWA capabilities

### Phase 4 - Integrations (Future)
- Payment gateway integration
- E-signature integration
- Calendar integration
- SMS notifications
- Reporting and analytics

## Related Documentation

- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)
- [Deployment Guide](./deployment-guide.md)
- [Design Guidelines](./design-guidelines.md)
- [Project Roadmap](./project-roadmap.md)

## Change Log

### 2025-12-26 - Phase 1 Complete
- Initial project setup
- Technology stack selection
- Database schema design
- Development environment configuration
- Documentation structure established

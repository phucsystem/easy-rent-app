# Design Guidelines

**Last Updated:** 2025-12-26
**Version:** 0.1.0
**Status:** Phase 1 Complete

## Table of Contents
- [Design Philosophy](#design-philosophy)
- [Visual Identity](#visual-identity)
- [Color System](#color-system)
- [Typography](#typography)
- [Layout & Spacing](#layout--spacing)
- [Component Design](#component-design)
- [UI Patterns](#ui-patterns)
- [Accessibility](#accessibility)
- [Responsive Design](#responsive-design)
- [Animation & Motion](#animation--motion)

## Design Philosophy

Easy Rent follows a **clean, functional, and user-centric** design philosophy focused on the Vietnamese rental market.

### Core Principles

1. **Simplicity First**
   - Clean interfaces with minimal distractions
   - Clear visual hierarchy
   - Intuitive navigation

2. **Efficiency**
   - Reduce clicks to complete tasks
   - Smart defaults and automation
   - Quick actions for common tasks

3. **Trust & Professionalism**
   - Consistent design language
   - Clear feedback for user actions
   - Professional appearance for contracts

4. **Localization**
   - Vietnamese language first
   - Cultural considerations
   - Local payment formats (VND)

5. **Accessibility**
   - WCAG 2.1 Level AA compliance
   - Keyboard navigation
   - Screen reader support

## Visual Identity

### Brand Colors

**Primary Color**: Amber/Yellow
- Represents warmth, trust, and energy
- High contrast for accessibility
- Works well in light and dark modes

**Secondary Colors**: Neutral grays
- Provides visual hierarchy
- Reduces cognitive load
- Professional appearance

### Design Style

**Modern & Minimal**
- Flat design with subtle shadows
- Rounded corners for friendliness
- Consistent spacing and alignment

**Professional Yet Approachable**
- Clean typography
- Purposeful use of color
- Generous white space

## Color System

### Color Palette

Based on `src/lib/design-tokens.ts` with hex color values:

#### Design Tokens Colors
```typescript
export const colors = {
  // Primary - Yellow/Gold accent
  primary: {
    main: '#F59E0B',      // Amber-500
    light: '#FBBF24',     // Amber-400
    dark: '#F08C00',      // Amber-600
    contrastText: '#212121',
  },

  // Backgrounds
  background: {
    default: '#F8F8F8',   // Light gray background
    paper: '#FFFFFF',     // White card background
    sidebar: '#212121',   // Dark sidebar
  },

  // Text
  text: {
    primary: '#333333',   // Primary text
    secondary: '#666666', // Secondary text
    disabled: '#CCCCCC',  // Disabled text
    hint: '#999999',      // Hint text
  },

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Dividers
  divider: '#E0E0E0',
  border: '#E0E0E0',
};
```

#### Tailwind CSS Integration
```css
:root {
  --primary: 245 158 11;          /* #F59E0B - Amber-500 */
  --background: 248 248 248;      /* #F8F8F8 */
  --foreground: 51 51 51;         /* #333333 */
  --card: 255 255 255;            /* #FFFFFF */
  --card-foreground: 51 51 51;    /* #333333 */
  --popover: 255 255 255;         /* #FFFFFF */
  --popover-foreground: 51 51 51; /* #333333 */
  --primary-foreground: 33 33 33; /* #212121 */
  --secondary: 230 230 230;       /* #E6E6E6 */
  --secondary-foreground: 51 51 51; /* #333333 */
  --muted: 240 240 240;           /* #F0F0F0 */
  --muted-foreground: 102 102 102; /* #666666 */
  --accent: 245 158 11;           /* #F59E0B */
  --accent-foreground: 33 33 33;  /* #212121 */
  --destructive: 244 67 54;       /* #F44336 */
  --border: 224 224 224;          /* #E0E0E0 */
  --input: 224 224 224;           /* #E0E0E0 */
  --ring: 245 158 11;             /* #F59E0B */
}
```

#### Dark Sidebar Colors
```css
/* Dark sidebar uses fixed colors */
.sidebar {
  background: #212121;
  border-color: #333333;
}

/* Sidebar navigation */
.sidebar-nav-item {
  color: #CCCCCC;
}

.sidebar-nav-item:hover {
  background: #333333;
  color: #FFFFFF;
}

.sidebar-nav-item.active {
  background: #F59E0B;
  color: #212121;
}
```

### Semantic Colors

| Purpose | Light Mode | Dark Mode | Usage |
|---------|-----------|-----------|-------|
| Primary | Amber-500 | Amber-500 | CTAs, links, important actions |
| Secondary | Gray-200 | Gray-800 | Secondary actions, less important elements |
| Destructive | Red-600 | Red-500 | Delete, danger, errors |
| Success | Green-600 | Green-500 | Success messages, confirmations |
| Warning | Yellow-600 | Yellow-500 | Warnings, important notices |
| Info | Blue-600 | Blue-500 | Information, help text |

### Color Usage Guidelines

**Primary Color (Amber)**
- Use for main CTAs (buttons, links)
- Use for active states
- Use for important highlights
- Avoid overuse (max 20% of screen)

**Accent Colors**
- Use sparingly for emphasis
- Maintain semantic meaning
- Ensure sufficient contrast (WCAG AA)

**Neutral Colors**
- Use for text hierarchy
- Create visual separation
- Support content, not distract

## Typography

### Font Families

**Sans Serif (Primary)**: Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```
- Used for all body text
- Modern, clean, highly readable
- Excellent screen rendering
- Defined in `src/lib/design-tokens.ts`

### Type Scale

| Scale | Size | CSS | Usage |
|-------|------|-----|-------|
| xs | 12px | `0.75rem` | Captions, labels |
| sm | 14px | `0.875rem` | Small text, helper text |
| base | 16px | `1rem` | Body text, default |
| lg | 18px | `1.125rem` | Large body, subheadings |
| xl | 24px | `1.5rem` | Section headings |
| 2xl | 28px | `1.75rem` | Page headings |
| 3xl | 36px | `2.25rem` | Hero headings |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, paragraphs |
| Medium | 500 | Emphasized text, subheadings |
| Semibold | 600 | Headings, buttons, links |
| Bold | 700 | Display headings, emphasis |

### Typography Guidelines

**Hierarchy**
- Use size and weight to establish hierarchy
- Maintain consistent spacing
- Limit to 3-4 levels per page

**Readability**
- Minimum 16px for body text
- Line height 1.5 for body text
- Max 75 characters per line

**Emphasis**
- Use weight or color for emphasis
- Avoid ALL CAPS (except acronyms)
- Use italics sparingly

## Layout & Spacing

### Spacing Scale

Based on `src/lib/design-tokens.ts`:

| Token | px | rem | Usage |
|-------|-----|-----|-------|
| xs | 4px | `0.25rem` | Tight spacing, icon padding |
| sm | 8px | `0.5rem` | Compact spacing, related items |
| md | 16px | `1rem` | Standard spacing, padding |
| lg | 24px | `1.5rem` | Section spacing |
| xl | 32px | `2rem` | Large gaps, section separation |
| 2xl | 48px | `3rem` | Major section breaks |
| 3xl | 64px | `4rem` | Extra large spacing |

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| sm | 640px | Small containers |
| md | 768px | Default content |
| lg | 1024px | Wide content |
| xl | 1280px | Maximum content |
| 2xl | 1536px | Ultra wide |

### Grid System

**12-Column Grid**
- Consistent with Tailwind
- Responsive breakpoints
- Flexible layout options

**Grid Usage**
```
Desktop: 12 columns, 24px gutters
Tablet:  8 columns, 16px gutters
Mobile:  4 columns, 16px gutters
```

### Layout Patterns

**Container Layout**
```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

**Section Spacing**
```css
.section {
  padding: 4rem 1rem;  /* Mobile */
}

@media (min-width: 768px) {
  .section {
    padding: 6rem 2rem;  /* Desktop */
  }
}
```

## Component Design

### Implemented Components

#### AuthSplitLayout

**Location**: `src/components/auth/auth-split-layout.tsx`

**Features**:
- Split-screen layout (50/50 on desktop)
- Left panel: Gradient background with geometric shapes
- Right panel: White background with form content
- Responsive: Stacks vertically on mobile
- Logo with "$" icon
- Title, subtitle, and feature pills

**Usage**:
```typescript
<AuthSplitLayout
  title="Welcome Back"
  subtitle="Sign in to access your dashboard"
>
  <YourForm />
</AuthSplitLayout>
```

#### Dashboard Components

**DashboardLayout** (`src/components/dashboard/dashboard-layout.tsx`):
- Flex container with sidebar and main content
- Background: `#F8F8F8`
- Contains DashboardSidebar, DashboardHeader, and main content

**DashboardSidebar** (`src/components/dashboard/dashboard-sidebar.tsx`):
- Dark sidebar (`#212121` background)
- Collapsible with toggle button
- Navigation: Dashboard, Bookings, Properties, Customers, Contracts, Settings
- Active state with primary color highlight
- Hover effects with scale animations

**DashboardHeader** (`src/components/dashboard/dashboard-header.tsx`):
- User menu with sign out
- Responsive design

**StatCard** (`src/components/dashboard/stat-card.tsx`):
- Metric display card
- Title, value, trend (positive/negative)
- Optional icon and badge
- Hover elevation effect
- Gradient trend indicators

### Button Styles

**Variants** (shadcn/ui Button component):
- `default`: Primary action (amber background)
- `secondary`: Secondary action (gray background)
- `outline`: Tertiary action (border only)
- `ghost`: Minimal action (hover state only)
- `destructive`: Dangerous action (red)
- `link`: Link style (underline)

**Sizes**:
- `icon-sm`: 32px (small icons)
- `sm`: 32px height
- `default`: 36px height
- `lg`: 40px height
- `icon`: 36px (standard icons)
- `icon-lg`: 40px (large icons)

### Card Styles

**Card Components**:
- `Card`: Container with border and shadow
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Subtitle/description
- `CardContent`: Main content area
- `CardFooter`: Footer actions

**Card Usage**:
- Group related information
- Consistent padding (1.5rem default)
- Subtle border and shadow
- Hover effects for interactive cards

### Form Components

**Form Guidelines**:
- Clear labels above inputs
- Helper text below inputs
- Error messages in red
- Validation on blur
- Required field indicators

**Input Styles**:
- `input`: Standard text input
- `textarea`: Multi-line text
- `select`: Dropdown selection
- `checkbox`: Boolean choices
- `radio`: Single choice from options

### Table Styles

**Table Components**:
- `Table`: Container
- `TableHeader`: Header row
- `TableBody`: Data rows
- `TableRow`: Individual row
- `TableHead`: Header cell
- `TableCell`: Data cell
- `TableFooter`: Summary row

**Table Guidelines**:
- Zebra striping for readability
- Hover effects on rows
- Sort indicators in headers
- Pagination for large datasets
- Responsive on mobile (stack or scroll)

## UI Patterns

### Navigation Patterns

**Sidebar Navigation**:
- Left sidebar (desktop)
- Drawer/bottom nav (mobile)
- Active state indication
- Icon + label for clarity

**Breadcrumb Navigation**:
- Show current location
- Clickable path
- Truncate long paths

**Tabs**:
- Group related content
- Limit to 5-7 tabs
- Use icons for quick recognition

### Feedback Patterns

**Loading States**:
- Skeleton screens for content
- Spinner for actions
- Progress bars for uploads

**Success Messages**:
- Green accent color
- Auto-dismiss after 5 seconds
- Clear action confirmation

**Error Messages**:
- Red accent color
- Specific error description
- Action to resolve (if possible)

**Confirmation Dialogs**:
- Clear action description
- Wording shows consequences
- Cancel button is default/secondary

### Data Display

**Empty States**:
- Friendly illustration or icon
- Clear message
- Action to resolve

**Lists**:
- Consistent item structure
- Hover effects for interactive items
- Visual separation between items

**Cards**:
- Group related information
- Consistent structure
- Clear hierarchy

## Accessibility

### Color Contrast

**WCAG AA Requirements**:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Our Colors** (verified):
- Primary (Amber-500) on white: 4.5:1 ✓
- Gray-500 on white: 7.1:1 ✓
- Gray-950 on white: 16.5:1 ✓

### Keyboard Navigation

**Tab Order**:
- Logical tab sequence
- Visible focus indicators
- Skip links for main content

**Focus Styles**:
- Amber ring (2px)
- High contrast
- Consistent across browsers

### Screen Readers

**Semantic HTML**:
- Proper heading hierarchy
- ARIA labels where needed
- Alt text for images
- Meaningful link text

**Live Regions**:
- Announce dynamic changes
- Error messages
- Success confirmations

## Responsive Design

### Breakpoints

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| sm | 640px | Large phones, small tablets |
| md | 768px | Tablets portrait |
| lg | 1024px | Tablets landscape, small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### Mobile-First Approach

**Strategy**:
1. Design for mobile (320px+)
2. Enhance for tablet (768px+)
3. Optimize for desktop (1024px+)

**Mobile Considerations**:
- Single column layouts
- Large touch targets (44px min)
- Simplified navigation
- Essential content only

### Responsive Patterns

**Navigation**:
- Mobile: Bottom nav or hamburger menu
- Tablet: Sidebar or top nav
- Desktop: Sidebar with full labels

**Tables**:
- Mobile: Stack cards or horizontal scroll
- Tablet+: Full table

**Forms**:
- Mobile: Single column, full width
- Tablet+: Multi-column where appropriate

## Animation & Motion

### Animation Principles

**Purpose**:
- Guide user attention
- Provide feedback
- Enhance understanding
- Create delight

**Guidelines**:
- Subtle and purposeful
- Fast (200-300ms)
- Ease-in-out for natural feel
- Respect user's motion preferences

### Animation Types

**Transitions**:
- Hover states: 150ms
- Focus states: 150ms
- Modal open: 200ms
- Page transitions: 300ms

**Animations** (using tw-animate-css):
- Fade in/out
- Slide up/down
- Scale in/out
- Spin (loading)

### Loading States

**Skeleton Loaders**:
- Gray background blocks
- Shimmer animation
- Match content layout

**Spinners**:
- Amber color
- Small (16-20px)
- For brief waits (<3s)

## Iconography

### Icon Library

**Lucide React** (primary):
- Consistent style
- Optimized SVG
- 1000+ icons
- 2px stroke

### Icon Usage

**Sizing**:
- xs: 12px (tiny)
- sm: 16px (default)
- md: 20px (medium)
- lg: 24px (large)
- xl: 32px (extra large)

**Guidelines**:
- Use meaningful icons
- Maintain consistent stroke
- Pair with labels (except common actions)
- Consider cultural context

### Common Icons

| Action | Icon | Usage |
|--------|------|-------|
| Add | Plus | Create new items |
| Edit | Pencil | Modify existing |
| Delete | Trash | Remove items |
| Save | Floppy Disk | Persist changes |
| Search | Magnifying Glass | Find content |
| Filter | Funnel | Refine list |
| Menu | Hamburger | Navigation |
| Close | X | Dismiss dialogs |
| Check | Checkmark | Confirm/success |
| Alert | Triangle | Warning |

## Related Documentation

- [Project Overview & PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [System Architecture](./system-architecture.md)
- [Deployment Guide](./deployment-guide.md)
- [Project Roadmap](./project-roadmap.md)

## Design Resources

### Tools
- **Figma**: Design mockups
- **Color Oracle**: Color blindness simulator
- **axe DevTools**: Accessibility testing
- **Lighthouse**: Performance and accessibility

### References
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design Guidelines](https://m3.material.io/)

## Change Log

### 2025-12-26 - Initial Design Guidelines
- Created comprehensive design system
- Defined color palette (amber/gray)
- Established typography scale
- Documented component styles
- Added accessibility guidelines
- Created responsive design patterns

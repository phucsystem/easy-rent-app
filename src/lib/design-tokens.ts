/**
 * Design Tokens
 *
 * Centralized design constants based on dashboard reference.
 * Provides consistent styling across the application.
 */

// ============================================
// COLORS
// ============================================

export const colors = {
  // Primary - Yellow/Gold accent
  primary: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#F08C00',
    contrastText: '#212121',
  },

  // Backgrounds
  background: {
    default: '#F8F8F8',
    paper: '#FFFFFF',
    sidebar: '#212121',
  },

  // Text
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#CCCCCC',
    hint: '#999999',
  },

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Dividers
  divider: '#E0E0E0',
  border: '#E0E0E0',
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.5rem',     // 24px
    '2xl': '1.75rem', // 28px
    '3xl': '2.25rem', // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  '2xl': 48,  // 3rem
  '3xl': 64,  // 4rem
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 2px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.1)',
  xl: '0 8px 32px rgba(0, 0, 0, 0.12)',
} as const;

// ============================================
// CARD STYLES
// ============================================

export const cardStyles = {
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  boxShadow: shadows.md,
  backgroundColor: colors.background.paper,
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// Z-INDEX
// ============================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

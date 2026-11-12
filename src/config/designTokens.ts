/**
 * Patagonix Retail Design System Tokens — Aurora Obsidian Identity
 * Centralizes visual tokens to eliminate magic values and ensure cohesive UI/UX
 */

export const designTokens = {
  colors: {
    background: {
      deep: '#030712', // Obsidian dark
      base: '#0B0F19', // Primary dark background
      surface: '#111827', // Card surface
      elevated: '#1F2937', // Elevated dropdowns / modals
      subtle: '#374151', // Subtle hover states
    },
    brand: {
      primary: '#6366F1', // Indigo 500
      primaryHover: '#4F46E5', // Indigo 600
      primaryLight: '#EEF2FF', // Indigo 50
      secondary: '#8B5CF6', // Violet 500
      accent: '#06B6D4', // Cyan 500
    },
    text: {
      primary: '#F9FAFB', // White / Gray 50
      secondary: '#9CA3AF', // Gray 400
      muted: '#6B7280', // Gray 500
      inverse: '#111827', // Dark Gray
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.08)',
      default: '#374151',
      focus: '#6366F1',
    },
    status: {
      success: '#10B981', // Emerald 500
      successBg: 'rgba(16, 185, 129, 0.1)',
      warning: '#F59E0B', // Amber 500
      warningBg: 'rgba(245, 158, 11, 0.1)',
      danger: '#EF4444', // Red 500
      dangerBg: 'rgba(239, 68, 68, 0.1)',
      info: '#3B82F6', // Blue 500
      infoBg: 'rgba(59, 130, 246, 0.1)',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  radii: {
    none: '0',
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 25px -5px rgba(99, 102, 241, 0.3)',
  },
  transitions: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  zIndex: {
    drawer: 40,
    modalBackdrop: 50,
    modalContent: 60,
    toast: 70,
  },
} as const;

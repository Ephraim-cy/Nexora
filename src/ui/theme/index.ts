import { Platform } from 'react-native';

export const Colors = {
  // Theme foundation
  darkBackground: '#040716',
  electricViolet: '#6d5cff',
  electricTeal: '#34d5ff',
  auroraPink: '#f15bb5',
  auroraGreen: '#4ade80',
  auroraAmber: '#facc15',
  white: '#ffffff',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassTextSecondary: '#aab0d6',

  // Category gradients (Start/End colors for Smart Backgrounds & Cards)
  categories: {
    Study: {
      gradient: ['#3f7cff', '#7c3cff'] as [string, string],
      icon: 'book',
      color: '#8b8cff',
    },
    Finance: {
      gradient: ['#0f9b7a', '#4ade80'] as [string, string],
      icon: 'card',
      color: '#4ade80',
    },
    Travel: {
      gradient: ['#00b8ff', '#345dff'] as [string, string],
      icon: 'airplane',
      color: '#38bdf8',
    },
    Work: {
      gradient: ['#27304f', '#775cff'] as [string, string],
      icon: 'briefcase',
      color: '#a5b4fc',
    },
    Shopping: {
      gradient: ['#f15bb5', '#ff7a59'] as [string, string],
      icon: 'cart',
      color: '#fb7185',
    },
    Health: {
      gradient: ['#ff4d6d', '#ffb703'] as [string, string],
      icon: 'heart',
      color: '#f87171',
    },
    Personal: {
      gradient: ['#f59e0b', '#22d3ee'] as [string, string],
      icon: 'person',
      color: '#fbbf24',
    },
    Media: {
      gradient: ['#22d3ee', '#7c3cff'] as [string, string],
      icon: 'image',
      color: '#22d3ee',
    },
    General: {
      gradient: ['#07112d', '#5a33d6'] as [string, string],
      icon: 'grid',
      color: '#8b8cff',
    },
  },
  
  // Custom dark mode theme overrides
  dark: {
    text: '#ffffff',
    textSecondary: '#aab0d6',
    background: '#050816',
    glassBg: 'rgba(11, 17, 42, 0.72)',
    glassBgHover: 'rgba(255, 255, 255, 0.08)',
    cardBg: 'rgba(12, 18, 43, 0.78)',
  },
  
  // Custom light mode theme overrides
  light: {
    text: '#0b0b1a',
    textSecondary: '#62637a',
    background: '#f5f5f9',
    glassBg: 'rgba(255, 255, 255, 0.7)',
    glassBgHover: 'rgba(255, 255, 255, 0.85)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
  }
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
  eight: 64,
} as const;

export const Typography = {
  fonts: Platform.select({
    ios: {
      display: 'SF Pro Display',
      text: 'SF Pro Text',
      rounded: 'SF Pro Rounded',
    },
    android: {
      display: 'sans-serif-medium',
      text: 'sans-serif',
      rounded: 'sans-serif-condensed',
    },
    default: {
      display: 'system-ui',
      text: 'system-ui',
      rounded: 'system-ui',
    },
  }),
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 18,
    xl: 22,
    xxl: 30,
  },
} as const;

export const Layout = {
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
};

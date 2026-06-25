import { Platform } from 'react-native';

export const Colors = {
  // Theme foundation
  darkBackground: '#03001e', // Very deep midnight blue/purple
  electricViolet: '#7f00ff',
  electricTeal: '#00f2fe',
  white: '#ffffff',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassTextSecondary: '#a5a6c9',

  // Category gradients (Start/End colors for Smart Backgrounds & Cards)
  categories: {
    Study: {
      gradient: ['#7f00ff', '#e100ff'] as [string, string],
      icon: 'book',
      color: '#c084fc',
    },
    Finance: {
      gradient: ['#11998e', '#38ef7d'] as [string, string],
      icon: 'card',
      color: '#4ade80',
    },
    Travel: {
      gradient: ['#00c6ff', '#0072ff'] as [string, string],
      icon: 'airplane',
      color: '#38bdf8',
    },
    Work: {
      gradient: ['#141e30', '#243b55'] as [string, string],
      icon: 'briefcase',
      color: '#94a3b8',
    },
    Shopping: {
      gradient: ['#ff9966', '#ff5e62'] as [string, string],
      icon: 'cart',
      color: '#fb7185',
    },
    Health: {
      gradient: ['#ff4b1f', '#ff9068'] as [string, string],
      icon: 'heart',
      color: '#f87171',
    },
    Personal: {
      gradient: ['#f12711', '#f5af19'] as [string, string],
      icon: 'person',
      color: '#fbbf24',
    },
    Media: {
      gradient: ['#4facfe', '#00f2fe'] as [string, string],
      icon: 'image',
      color: '#22d3ee',
    },
    General: {
      gradient: ['#0f0c20', '#1c153b'] as [string, string],
      icon: 'grid',
      color: '#a78bfa',
    },
  },
  
  // Custom dark mode theme overrides
  dark: {
    text: '#ffffff',
    textSecondary: '#a5a6c9',
    background: '#070517', // Midnight tone
    glassBg: 'rgba(255, 255, 255, 0.03)',
    glassBgHover: 'rgba(255, 255, 255, 0.06)',
    cardBg: 'rgba(15, 12, 32, 0.6)',
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

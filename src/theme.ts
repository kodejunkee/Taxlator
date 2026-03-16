export const lightColors = {
  primary: '#0F2C59',
  secondary: '#005B41',
  tertiary: '#FF9EAA',
  income: '#10B981',
  tax: '#EF4444',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  gradientStart: '#1E3A8A',
  gradientEnd: '#312E81',
  // Phase 3 Artistic Tokens
  accent: '#7C3AED', // Royal Purple
  surface: '#FFFFFF',
  mesh1: '#FEE2E2',
  mesh2: '#DBEAFE',
  mesh3: '#D1FAE5',
};

export const darkColors = {
  primary: '#60A5FA',
  secondary: '#34D399',
  tertiary: '#F43F5E',
  income: '#10B981',
  tax: '#EF4444',
  background: '#04070D', // Ultra deep space back
  card: '#0D121F', // Deep glass card
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: '#1E293B',
  gradientStart: '#0F172A',
  gradientEnd: '#1E293B',
  // Phase 3 Artistic Tokens
  accent: '#A78BFA', // Light Violet
  surface: '#111827',
  mesh1: '#1E1B4B', // Deep Indigo
  mesh2: '#064E3B', // Deep Emerald
  mesh3: '#4C1D95', // Deep Purple
};

export const COLORS = lightColors;

export const SIZES = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 40,
  radius: 24, // Slightly rounder for modern look
};

export const FONTS = {
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semiBold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
};

export const TYPOGRAPHY = {
  h1: { fontSize: 34, fontFamily: FONTS.bold, letterSpacing: -1 },
  h2: { fontSize: 28, fontFamily: FONTS.semiBold, letterSpacing: -0.5 },
  h3: { fontSize: 22, fontFamily: FONTS.semiBold, letterSpacing: -0.3 },
  h4: { fontSize: 18, fontFamily: FONTS.semiBold },
  body: { fontSize: 16, fontFamily: FONTS.regular },
  bodyMedium: { fontSize: 16, fontFamily: FONTS.medium },
  bodyBold: { fontSize: 16, fontFamily: FONTS.bold },
  caption: { fontSize: 14, fontFamily: FONTS.regular },
  captionMedium: { fontSize: 14, fontFamily: FONTS.medium },
  label: { fontSize: 11, fontFamily: FONTS.bold, textTransform: 'uppercase' as const, letterSpacing: 1 },
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  glow: {
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  // Phase 3 Deep Artistic Shadow
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 12,
  }
};

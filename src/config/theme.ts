/**
 * Centralized Design System & Theme Configuration
 * Contains all colors, typography, gradients, spacing, radii, shadows, and shared styles.
 */

import { Platform, StyleSheet, TextStyle } from 'react-native';
import { moderateScale, scaleFont } from '@/utils/responsive';

export const colors = {
  // Brand & Palette (Strictly aligned with specification)
  primary: '#2563EB',
  headerDarkBlue: '#0B1D3A',
  headerGradientStart: '#032B57',
  headerGradientEnd: '#518EF9',
  buttonGradientStart: '#032B57',
  buttonGradientEnd: '#0659B2',

  // Secondary & Accents
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  secondary: '#64748B',
  accent: '#F59E0B',
  subtitlePeriwinkle: '#C7D2FE',

  // Status & Feedback
  success: '#10B981',
  successLight: '#DCFCE7',
  successDark: '#15803D',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#B45309',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Specific Functional Badges & Components
  liveBadge: {
    bg: 'rgba(16, 185, 129, 0.15)',
    text: '#10B981',
    dot: '#10B981',
  },
  occupiedBadge: {
    bg: '#DCFCE7',
    text: '#15803D',
    dot: '#16A34A',
  },
  warningBanner: {
    bg: '#FEFCE8',
    border: '#FEF08A',
    iconBg: '#FEF3C7',
    icon: '#D97706',
    pillBg: '#FEF3C7',
    pillText: '#B45309',
  },
  awaitingBadge: {
    bg: '#FEF3C7',
    text: '#D97706',
    dot: '#D97706',
  },
  avatarPurple: {
    bg: '#EDE9FE',
    text: '#6366F1',
  },
  scheduleItem1: {
    bg: '#F0F4FA',
    time: '#4F46E5',
    tagBg: '#E0E7FF',
    tagText: '#4F46E5',
  },
  scheduleItem2: {
    bg: '#ECFDF5',
    time: '#059669',
    tagBg: '#D1FAE5',
    tagText: '#059669',
  },
  quickActionColors: {
    newEvent: '#749AED80',
    schedule: '#8A4BC280',
    availability: '#3B967780',
    shareLink: '#DA835580',
  },
  floatingButton: '#16437E',

  // Base Neutrals
  white: '#FFFFFF',
  black: '#0F172A',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Typography Colors
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textSubtle: '#CBD5E1',
  textInverse: '#FFFFFF',
  textInverseMuted: 'rgba(255, 255, 255, 0.75)',
  textBlue: '#2563EB',
} as const;

export const gradients = {
  // Linear gradient: #032B57 → #518EF9
  header: ['#032B57', '#518EF9'],
  // Linear gradient: #03264C → #0659B2
  button: ['#03264C', '#0659B2'],
  // Quick action bar
  quickActions: ['#03264C', '#0659B2'],
  // Bottom property notification banner
  propertyBanner: ['#032B57', '#2563EB'],
  // Bottom image dark scrim overlay
  imageDarkOverlay: ['transparent', 'rgba(0, 0, 0, 0.8)'],
};

export const spacing = {
  none: 0,
  xxs: moderateScale(2),
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  section: moderateScale(24),
  screenHorizontal: 20,
} as const;

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  header: 28,
  pill: 9999,
  full: 9999,
} as const;

// Cross-platform font families
const fontHeadingRegular = Platform.select({
  ios: 'PlayfairDisplay-Regular',
  android: 'PlayfairDisplay-Regular',
  default: 'PlayfairDisplay-Regular',
});

const fontHeadingMedium = Platform.select({
  ios: 'PlayfairDisplay-Medium',
  android: 'PlayfairDisplay-Medium',
  default: 'PlayfairDisplay-Medium',
});

const fontHeadingSemiBold = Platform.select({
  ios: 'PlayfairDisplay-SemiBold',
  android: 'PlayfairDisplay-SemiBold',
  default: 'PlayfairDisplay-SemiBold',
});

const fontHeadingBold = Platform.select({
  ios: 'PlayfairDisplay-Bold',
  android: 'PlayfairDisplay-Bold',
  default: 'PlayfairDisplay-Bold',
});

const fontBodyRegular = Platform.select({
  ios: 'Inter-Regular',
  android: 'Inter-Regular',
  default: 'Inter-Regular',
});

const fontBodyMedium = Platform.select({
  ios: 'Inter-Medium',
  android: 'Inter-Medium',
  default: 'Inter-Medium',
});

const fontBodySemiBold = Platform.select({
  ios: 'Inter-SemiBold',
  android: 'Inter-SemiBold',
  default: 'Inter-SemiBold',
});

const fontBodyBold = Platform.select({
  ios: 'Inter-Bold',
  android: 'Inter-Bold',
  default: 'Inter-Bold',
});

export const typography = {
  fontFamily: {
    heading: {
      regular: fontHeadingRegular,
      medium: fontHeadingMedium,
      semiBold: fontHeadingSemiBold,
      bold: fontHeadingBold,
    },
    body: {
      regular: fontBodyRegular,
      medium: fontBodyMedium,
      semiBold: fontBodySemiBold,
      bold: fontBodyBold,
    },
  },
  fontSize: {
    xxs: scaleFont(10),
    xs: scaleFont(11),
    sm: scaleFont(12),
    base: scaleFont(14),
    md: scaleFont(15),
    lg: scaleFont(16),
    xl: scaleFont(18),
    xxl: scaleFont(20),
    xxxl: scaleFont(28),
    display: scaleFont(32),
  },
  lineHeight: {
    xxs: scaleFont(14),
    xs: scaleFont(16),
    sm: scaleFont(18),
    base: scaleFont(20),
    md: scaleFont(22),
    lg: scaleFont(24),
    xl: scaleFont(26),
    xxl: scaleFont(28),
    xxxl: scaleFont(34),
    display: scaleFont(38),
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/**
 * Predefined Typography Presets
 * Reusable styles for Headings, Body, Labels, and Buttons
 */
export const typographyPresets: Record<string, TextStyle> = {
  greetingTitle: {
    fontFamily: typography.fontFamily.heading.regular,
    fontSize: scaleFont(23),
    lineHeight: scaleFont(30),
    color: colors.white,
    fontWeight: typography.fontWeight.regular,
  },
  greetingSubtitle: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    lineHeight: scaleFont(16),
    color: 'rgba(199, 210, 254, 0.75)',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.heading.medium,
    fontSize: scaleFont(17),
    lineHeight: scaleFont(24),
    letterSpacing: -0.3,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  sectionLink: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(12.5),
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(14.5),
    lineHeight: scaleFont(20),
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  cardSubtitle: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    lineHeight: scaleFont(16),
    color: colors.textSecondary,
  },
  body: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(13.5),
    lineHeight: scaleFont(19),
    color: '#334155',
  },
  bodyMedium: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(13.5),
    lineHeight: scaleFont(19),
    color: '#334155',
    fontWeight: typography.fontWeight.medium,
  },
  bodyBold: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(13.5),
    lineHeight: scaleFont(19),
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  label: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11),
    lineHeight: scaleFont(14),
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.regular,
  },
  badge: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(10.5),
    lineHeight: scaleFont(13),
    fontWeight: typography.fontWeight.medium,
  },
  button: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(13.5),
    lineHeight: scaleFont(18),
    fontWeight: typography.fontWeight.semibold,
  },
  quickActionLabel: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: 11.5,
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.1,
  },
  floatingButtonLabel: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: 6,
    lineHeight: 16.5,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    letterSpacing: 0,
    textAlign: 'center',
  },
  tabLabel: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(9.5),
    lineHeight: scaleFont(12),
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.5,
  },
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.035,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const commonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: borderRadius.pill,
  },
});

export const theme = {
  colors,
  gradients,
  spacing,
  borderRadius,
  typography,
  typographyPresets,
  shadows,
  commonStyles,
} as const;

export type Theme = typeof theme;
export default theme;

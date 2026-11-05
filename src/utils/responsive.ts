/**
 * Responsive Design Utility
 * Provides proportional scaling and adaptive dimension helpers
 * based on standard mobile guideline dimensions (390 x 844).
 */

import { Dimensions, PixelRatio, Platform } from 'react-native';

// Base guideline dimensions based on standard modern viewport (iPhone 14 / 390x844)
const GUIDELINE_BASE_WIDTH = 390;
const GUIDELINE_BASE_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Linearly scales dimension based on current window width.
 * Best for component widths, full-bleed elements, and horizontal offsets.
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;
};

/**
 * Linearly scales dimension based on current window height.
 * Best for component heights and vertical spacing.
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;
};

/**
 * Moderately scales dimension with a damping factor (default: 0.5).
 * Prevents elements from shrinking too small on small screens or
 * blowing up too large on tablets.
 * Best for font sizes, padding, margins, icon sizes, and border radii.
 *
 * @param size Target size in pixels
 * @param factor Damping factor between 0 (no scale) and 1 (full scale)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

/**
 * Moderately scales vertical dimension with a damping factor (default: 0.5).
 * Best for vertical margins, padding, and heights where full linear scaling is too aggressive.
 */
export const moderateVerticalScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (verticalScale(size) - size) * factor);
};

/**
 * Converts width percentage to pixels.
 * E.g., wp(50) = 50% of screen width.
 */
export const wp = (percentage: number): number => {
  return Math.round((percentage * SCREEN_WIDTH) / 100);
};

/**
 * Converts height percentage to pixels.
 * E.g., hp(20) = 20% of screen height.
 */
export const hp = (percentage: number): number => {
  return Math.round((percentage * SCREEN_HEIGHT) / 100);
};

/**
 * Responsive font size scaler.
 * Combines moderate scaling with system font scale clamping
 * to prevent extreme accessibility enlargement from breaking UI.
 */
export const scaleFont = (fontSize: number, maxScaleFactor: number = 1.3): number => {
  const scaled = moderateScale(fontSize, 0.4);
  const systemScale = PixelRatio.getFontScale();
  const cappedScale = Math.min(systemScale, maxScaleFactor);
  return Math.round(scaled * (cappedScale / (Platform.OS === 'android' ? 1.0 : 1.0)));
};

/**
 * Clamps a number between min and max bounds.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Device helpers
 */
export const isTablet = (): boolean => {
  const minDim = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
  const maxDim = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT);
  const aspectRatio = maxDim / minDim;
  return minDim >= 600 && aspectRatio < 1.6;
};

export const isSmallDevice = SCREEN_WIDTH < 360;

/**
 * Unified responsive object for quick imports
 */
export const responsive = {
  scale,
  vs: verticalScale,
  ms: moderateScale,
  mvs: moderateVerticalScale,
  wp,
  hp,
  font: scaleFont,
  clamp,
  isTablet: isTablet(),
  isSmallDevice,
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
} as const;

export default responsive;

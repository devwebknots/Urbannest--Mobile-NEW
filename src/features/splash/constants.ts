/**
 * Splash screen timing and color tokens.
 */

export const SPLASH_TIMING = {
  /** Exit fade duration (ms) */
  exitDuration: 450,
  /** Fallback exit if the video never reports its end (video is ~5.9s) */
  maxDuration: 7500,
  /** Hold time on the navy screen when reduce motion is on, or video fails */
  stillHold: 2000,
} as const;

export const SPLASH_COLORS = {
  /** Must match android splashBackground (res/values/colors.xml) */
  base: '#0B1D3A',
} as const;

/**
 * TESTING ONLY: keep the app on the splash screen (no auto-exit, tap does
 * nothing, video loops). Set back to false before release.
 */
export const SPLASH_HOLD_FOR_TESTING = true;

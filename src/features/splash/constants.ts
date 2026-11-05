/**
 * Splash screen timing and color tokens.
 */

export const SPLASH_TIMING = {
  /** Fade-in of the poster frame (ms) */
  introDuration: 400,
  /** Exit fade duration (ms) */
  exitDuration: 450,
  /** Fallback exit if the video never reports its end (video is ~5.9s) */
  maxDuration: 7500,
  /** Hold time on the still frame when reduce motion is on, or video fails */
  stillHold: 2000,
} as const;

export const SPLASH_COLORS = {
  /** Matches the darkest navy of the artwork, so letterbox edges blend in */
  base: '#0A1438',
} as const;

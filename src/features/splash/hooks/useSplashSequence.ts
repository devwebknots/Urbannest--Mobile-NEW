/**
 * useSplashSequence: single exit, and timing for the video splash.
 * The video drives the timeline; timers are only fallbacks.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { SPLASH_HOLD_FOR_TESTING, SPLASH_TIMING as T } from '../constants';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';
const HOLD = SPLASH_HOLD_FOR_TESTING && !IS_TEST;

export interface SplashSequence {
  exit: Animated.Value;
  /** True while the testing hold is on: stay on the splash and loop */
  hold: boolean;
  /** Whether to play the video (false under reduce motion or after an error) */
  playVideo: boolean;
  /** Start the exit fade and leave the splash (safe to call more than once) */
  skip: () => void;
  /** Call when the video fails, to fall back to the still frame */
  onVideoError: () => void;
}

export function useSplashSequence(onFinished: () => void): SplashSequence {
  const exit = useRef(new Animated.Value(0)).current;
  const [playVideo, setPlayVideo] = useState(!IS_TEST);

  const exiting = useRef(false);
  const cbRef = useRef(onFinished);
  cbRef.current = onFinished;

  const skip = useCallback(() => {
    if (HOLD) {
      return;
    }
    if (exiting.current) {
      return;
    }
    exiting.current = true;
    if (IS_TEST) {
      cbRef.current();
      return;
    }
    Animated.timing(exit, {
      toValue: 1,
      duration: T.exitDuration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => cbRef.current());
  }, [exit]);

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const schedule = useCallback(
    (ms: number) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(skip, ms);
    },
    [skip],
  );

  const onVideoError = useCallback(() => {
    setPlayVideo(false);
    schedule(T.stillHold);
  }, [schedule]);

  useEffect(() => {
    let cancelled = false;

    if (IS_TEST) {
      schedule(0);
    } else {
      schedule(T.maxDuration);

      AccessibilityInfo.isReduceMotionEnabled()
        .catch(() => false)
        .then(reduce => {
          if (!cancelled && reduce) {
            setPlayVideo(false);
            schedule(T.stillHold);
          }
        });
    }

    return () => {
      cancelled = true;
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [schedule]);

  return {
    exit,
    hold: HOLD,
    playVideo,
    skip,
    onVideoError,
  };
}

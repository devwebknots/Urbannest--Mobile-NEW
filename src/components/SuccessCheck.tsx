/**
 * Global Component: SuccessCheck
 * Large animated success mark for full success pages (e.g. Application
 * Submitted). Flat and minimal (no gradients, gloss or shadows; a glossy
 * "3D seal" was rejected as dated):
 *  1. a thin ring draws itself clockwise
 *  2. the circle fills in solid from the centre
 *  3. a clean rounded tick draws itself (short stroke, then the long one)
 *  4. one soft ripple fades out, then it stays still
 * `tone`: brand (navy ring / fill, white tick; light pages) or light
 * (white ring / fill, navy tick; dark / photo backgrounds).
 * Pure Views + native driver (no SVG in the app). Reduce Motion / tests:
 * the finished mark. For dialogs use the smaller `SuccessBadge`.
 */

import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

/** Room around the circle for the ripple (box = size × BOX_SCALE) */
export const SUCCESS_CHECK_BOX_SCALE = 1.6;

interface Props {
  /** Circle diameter (default 80) */
  size?: number;
  tone?: 'brand' | 'light';
}

export const SuccessCheck: React.FC<Props> = ({ size = ms(80), tone = 'brand' }) => {
  const light = tone === 'light';
  const main = light ? colors.white : colors.navy;
  const tickColor = light ? colors.navy : colors.white;

  const ring = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;
  const fill = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;
  const short = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;
  const long = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;
  const ripple = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;

  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then(reduce => {
        if (cancelled) {
          return;
        }
        if (reduce) {
          [ring, fill, short, long, ripple].forEach(v => v.setValue(1));
          return;
        }
        Animated.sequence([
          Animated.timing(ring, {
            toValue: 1,
            duration: 620,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fill, {
            toValue: 1,
            duration: 260,
            easing: Easing.out(Easing.back(1.6)),
            useNativeDriver: true,
          }),
          Animated.timing(short, {
            toValue: 1,
            duration: 150,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(long, {
              toValue: 1,
              duration: 230,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(ripple, {
              toValue: 1,
              duration: 900,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });
    return () => {
      cancelled = true;
    };
  }, [fill, long, ring, ripple, short]);

  const box = size * SUCCESS_CHECK_BOX_SCALE;
  const offset = (box - size) / 2;
  const half = size / 2;
  const stroke = Math.max(2, size * 0.035);

  // Ring drawn with two half-rings rotating inside clipping halves
  const ringStyle = {
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: stroke,
    borderColor: main,
  };
  const rightTurn = ring.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '180deg'],
  });
  const leftTurn = ring.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  // Tick geometry (fractions of the circle)
  const t = Math.max(4, size * 0.085);
  const elbow = { x: size * 0.44, y: size * 0.64 };
  const start = { x: size * 0.29, y: size * 0.49 };
  const end = { x: size * 0.72, y: size * 0.36 };
  const shortLen = Math.SQRT2 * (elbow.x - start.x) + t / 2;
  const longLen = Math.SQRT2 * (end.x - elbow.x) + t / 2;

  return (
    <View
      style={{ width: box, height: box }}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Success"
    >
      {/* One soft ripple once the tick lands */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.abs,
          {
            left: offset,
            top: offset,
            width: size,
            height: size,
            borderRadius: half,
            backgroundColor: main,
            opacity: ripple.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.22, 0] }),
            transform: [
              { scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 1.55] }) },
            ],
          },
        ]}
      />

      <View style={[styles.abs, { left: offset, top: offset, width: size, height: size }]}>
        {/* Faint track the ring draws over */}
        <View
          style={[
            styles.abs,
            ringStyle,
            { borderColor: light ? 'rgba(255,255,255,0.22)' : 'rgba(11,42,91,0.12)' },
          ]}
        />

        {/* Right half of the ring (first half of the draw) */}
        <View style={[styles.clip, { left: half, width: half, height: size }]}>
          <Animated.View
            style={[
              styles.abs,
              { left: -half, width: size, height: size, transform: [{ rotate: rightTurn }] },
            ]}
          >
            <View style={[styles.clip, { left: 0, width: half, height: size }]}>
              <View style={ringStyle} />
            </View>
          </Animated.View>
        </View>

        {/* Left half of the ring (second half of the draw) */}
        <View style={[styles.clip, { left: 0, width: half, height: size }]}>
          <Animated.View
            style={[
              styles.abs,
              { left: 0, width: size, height: size, transform: [{ rotate: leftTurn }] },
            ]}
          >
            <View style={[styles.clip, { left: half, width: half, height: size }]}>
              <View style={[ringStyle, { marginLeft: -half }]} />
            </View>
          </Animated.View>
        </View>

        {/* Solid fill */}
        <Animated.View
          style={[
            styles.abs,
            {
              width: size,
              height: size,
              borderRadius: half,
              backgroundColor: main,
              transform: [{ scale: fill }],
            },
          ]}
        />

        {/* Tick */}
        <Animated.View
          style={[
            styles.stroke,
            {
              left: start.x - t / 2,
              top: start.y - t / 2,
              width: shortLen,
              height: t,
              borderRadius: t / 2,
              backgroundColor: tickColor,
              opacity: short.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 1, 1] }),
              transform: [{ rotate: '45deg' }, { scaleX: short }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.stroke,
            {
              left: elbow.x - t / 2,
              top: elbow.y - t / 2,
              width: longLen,
              height: t,
              borderRadius: t / 2,
              backgroundColor: tickColor,
              opacity: long.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 1, 1] }),
              transform: [{ rotate: '-45deg' }, { scaleX: long }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  abs: {
    position: 'absolute',
  },
  clip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  stroke: {
    position: 'absolute',
    transformOrigin: 'left center',
  },
});

export default SuccessCheck;

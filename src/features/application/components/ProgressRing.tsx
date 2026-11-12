/**
 * ProgressRing: small circular progress ("75%" in a ring), drawn with plain
 * Views (no SVG in the app): two half-rings rotate inside clipping halves.
 * Pale secondary-blue track; the arc is secondary blue (app done colour).
 * The arc animates to the new value.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

interface Props {
  /** 0 – 1 */
  progress: number;
  size?: number;
  stroke?: number;
}

// colors.headerGradientEnd (#518EF9) as rgb
const BLUE = '81,142,249';

export const ProgressRing: React.FC<Props> = ({ progress, size = ms(46), stroke = ms(4) }) => {
  const p = Math.max(0, Math.min(1, progress));
  const value = useRef(new Animated.Value(p)).current;

  useEffect(() => {
    if (IS_TEST) {
      value.setValue(p);
      return;
    }
    Animated.timing(value, {
      toValue: p,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [p, value]);

  const half = size / 2;
  const ring = {
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: stroke,
    borderColor: colors.headerGradientEnd,
  };
  // First half of the progress turns the right arc 0 → 180°, the second the left arc
  const rightRotate = value.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '180deg'],
  });
  const leftRotate = value.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityLabel={`${Math.round(p * 100)}% uploaded`}
    >
      <View style={[ring, styles.track, { borderColor: `rgba(${BLUE},0.18)` }]} />

      {/* Right side: a left half-ring rotating into the right clip */}
      <View style={[styles.clip, { left: half, width: half, height: size }]}>
        <Animated.View
          style={{
            position: 'absolute',
            left: -half,
            width: size,
            height: size,
            transform: [{ rotate: rightRotate }],
          }}
        >
          <View style={[styles.clip, { left: 0, width: half, height: size }]}>
            <View style={ring} />
          </View>
        </Animated.View>
      </View>

      {/* Left side: a right half-ring rotating into the left clip */}
      <View style={[styles.clip, { left: 0, width: half, height: size }]}>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            width: size,
            height: size,
            transform: [{ rotate: leftRotate }],
          }}
        >
          <View style={[styles.clip, { left: half, width: half, height: size }]}>
            <View style={[ring, { marginLeft: -half }]} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.center}>
        <Text style={styles.text}>{Math.round(p * 100)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
  },
  clip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
});

export default ProgressRing;

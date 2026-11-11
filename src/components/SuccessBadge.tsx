/**
 * Global Component: SuccessBadge
 * Animated "done" mark for success dialogs (AppDialog tone 'success').
 * Navy gradient circle (brand button colours) with a white tick and soft
 * secondary-blue rings:
 *  1. the circle springs in from small
 *  2. the tick pops in with a little overshoot
 *  3. two rings ripple outward, then keep a slow gentle pulse
 * Native driver only. No motion in tests or with Reduce Motion on (it
 * just shows the finished badge).
 */

import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import { colors, gradients } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { CheckmarkIcon } from './icons';

declare const process: { env: { NODE_ENV?: string } };

const SIZE = ms(64);
const RING = ms(64);

export const SuccessBadge: React.FC = () => {
  const circle = useRef(new Animated.Value(0)).current;
  const tick = useRef(new Animated.Value(0)).current;
  const ringA = useRef(new Animated.Value(0)).current;
  const ringB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    let cancelled = false;

    const showDone = () => {
      circle.setValue(1);
      tick.setValue(1);
    };
    if (process.env.NODE_ENV === 'test') {
      showDone();
      return;
    }

    AccessibilityInfo.isReduceMotionEnabled().then(reduce => {
      if (cancelled) {
        return;
      }
      if (reduce) {
        showDone();
        return;
      }
      const ripple = (v: Animated.Value, delay: number) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: 1400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]);

      Animated.sequence([
        Animated.delay(120),
        Animated.spring(circle, {
          toValue: 1,
          damping: 11,
          stiffness: 180,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.spring(tick, {
          toValue: 1,
          damping: 9,
          stiffness: 260,
          mass: 0.6,
          useNativeDriver: true,
        }),
      ]).start();

      // Rings: first ripple with the pop, then a calm repeat
      loop = Animated.loop(
        Animated.sequence([
          Animated.parallel([ripple(ringA, 0), ripple(ringB, 420)]),
          Animated.delay(900),
        ]),
      );
      setTimeout(() => !cancelled && loop?.start(), 260);
    });

    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [circle, tick, ringA, ringB]);

  const ringStyle = (v: Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.55, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }],
  });

  return (
    <View style={styles.wrap} accessibilityElementsHidden importantForAccessibility="no">
      <Animated.View style={[styles.ring, ringStyle(ringA)]} />
      <Animated.View style={[styles.ring, ringStyle(ringB)]} />
      <Animated.View style={[styles.circle, { transform: [{ scale: circle }] }]}>
        <Animated.View
          style={{
            opacity: tick,
            transform: [
              { scale: tick.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
              { rotate: tick.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '0deg'] }) },
            ],
          }}
        >
          <CheckmarkIcon size={ms(30)} color={colors.white} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Room for the rings to grow without being clipped
  wrap: {
    width: SIZE * 1.6,
    height: SIZE * 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    backgroundColor: 'rgba(81,142,249,0.35)',
  },
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(145deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
    // White rim + soft blue glow
    borderWidth: 3,
    borderColor: colors.white,
    boxShadow: '0px 10px 22px rgba(6,89,178,0.35)',
  },
});

export default SuccessBadge;

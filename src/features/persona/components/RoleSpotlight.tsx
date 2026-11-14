/**
 * RoleSpotlight: the chosen role on the Add Persona page. The role's round
 * photo in a glowing orb (two faint rings, a slow orbiting dot) over the
 * role's eyebrow, Playfair title and description. Cross-fades and rises
 * slightly whenever the role changes.
 * Fits its space: give it `maxHeight` (the room left above the grid) and
 * the orb shrinks so the whole page fits on one screen without scrolling.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { PersonaRole } from '../types';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

/** Orb (outer ring) size range; inner ring and photo scale with it */
const ORB_MAX = ms(184);
const ORB_MIN = ms(80);
const MIDDLE_RATIO = 146 / 184;
const CORE_RATIO = 120 / 184;
const ORBIT_DOT = 8;
/** Gap between the orb and the text */
const COPY_GAP = spacing.md;

interface Props {
  role: PersonaRole;
  index: number;
  count: number;
  /** Height available for the whole spotlight (orb + text) */
  maxHeight?: number;
}

export const RoleSpotlight: React.FC<Props> = ({ role, index, count, maxHeight }) => {
  const swap = useRef(new Animated.Value(1)).current;
  const orbit = useRef(new Animated.Value(0)).current;
  const [copyHeight, setCopyHeight] = useState(0);

  // Fade + rise on every role change
  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    swap.setValue(0);
    Animated.timing(swap, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [role.id, swap]);

  // Slow orbit of the accent dot around the outer ring
  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    const loop = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [orbit]);

  // Orb takes whatever height the text leaves, within its size range
  const room =
    maxHeight !== undefined && copyHeight > 0
      ? maxHeight - copyHeight - COPY_GAP
      : ORB_MAX;
  const outer = Math.round(Math.max(ORB_MIN, Math.min(ORB_MAX, room)));
  const middle = Math.round(outer * MIDDLE_RATIO);
  const core = Math.round(outer * CORE_RATIO);

  const rotate = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const coreScale = swap.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1],
  });
  const rise = {
    opacity: swap,
    transform: [
      {
        translateY: swap.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  const counter = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;

  return (
    <View style={styles.root}>
      <View style={[styles.orb, { width: outer, height: outer }]}>
        <View
          style={[
            styles.ring,
            styles.outer,
            { width: outer, height: outer, borderRadius: outer / 2 },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.middle,
            { width: middle, height: middle, borderRadius: middle / 2 },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.orbit, { transform: [{ rotate }] }]}
        >
          <View style={[styles.orbitDot, { left: outer / 2 - ORBIT_DOT / 2 }]} />
        </Animated.View>
        <Animated.View
          style={[
            styles.core,
            {
              width: core,
              height: core,
              borderRadius: core / 2,
              transform: [{ scale: coreScale }],
            },
          ]}
        >
          <Image
            source={role.image}
            resizeMode="cover"
            style={[styles.photo, { borderRadius: core / 2 }]}
          />
        </Animated.View>
      </View>

      <Animated.View
        style={[styles.copy, rise]}
        onLayout={e => setCopyHeight(Math.ceil(e.nativeEvent.layout.height))}
      >
        <Text style={styles.eyebrow}>
          {counter}
          <Text style={styles.eyebrowSep}>{'   ·   '}</Text>
          {role.eyebrow.toUpperCase()}
        </Text>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {role.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {role.description}
        </Text>
        {/* Commented out at the user's request: "On your account" + perk chips.
        <View style={styles.perks}>
          {added && (
            <View style={[styles.chip, styles.addedChip]}>
              <View style={styles.addedDot} />
              <Text style={styles.chipText}>On your account</Text>
            </View>
          )}
          {role.perks.map(perk => (
            <View key={perk} style={styles.chip}>
              <Text style={styles.chipText}>{perk}</Text>
            </View>
          ))}
        </View> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  outer: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  middle: {
    borderColor: 'rgba(199,210,254,0.16)',
    backgroundColor: 'rgba(81,142,249,0.06)',
  },
  orbit: {
    ...StyleSheet.absoluteFill,
  },
  orbitDot: {
    position: 'absolute',
    top: -ORBIT_DOT / 2,
    width: ORBIT_DOT,
    height: ORBIT_DOT,
    borderRadius: ORBIT_DOT / 2,
    backgroundColor: colors.headerGradientEnd,
    boxShadow: `0px 0px 10px ${colors.headerGradientEnd}`,
  },
  core: {
    padding: 3,
    backgroundColor: 'rgba(81,142,249,0.55)',
    boxShadow: '0px 0px 36px rgba(81,142,249,0.5)',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  copy: {
    alignItems: 'center',
    marginTop: COPY_GAP,
    paddingHorizontal: spacing.screenHorizontal,
    alignSelf: 'stretch',
  },
  eyebrow: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.xxs,
    letterSpacing: 1.6,
    color: colors.subtitlePeriwinkle,
  },
  eyebrowSep: {
    color: 'rgba(199,210,254,0.45)',
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  description: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    color: colors.textInverseMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    minHeight: typography.lineHeight.sm * 2,
    maxWidth: 320,
  },
  // Chip row styles (row commented out above), kept to restore it:
  // perks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
  //   gap: spacing.sm, marginTop: spacing.md },
  // chip: { flexDirection: 'row', alignItems: 'center',
  //   paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 1,
  //   borderRadius: borderRadius.pill, backgroundColor: 'rgba(255,255,255,0.10)',
  //   borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  // addedChip: { backgroundColor: 'rgba(16,185,129,0.14)',
  //   borderColor: 'rgba(16,185,129,0.35)' },
  // addedDot: { width: 6, height: 6, borderRadius: 3,
  //   marginRight: spacing.xs + 2, backgroundColor: colors.success },
  // chipText: { fontFamily: typography.fontFamily.body.medium,
  //   fontSize: typography.fontSize.xxs, color: colors.white },
});

export default RoleSpotlight;

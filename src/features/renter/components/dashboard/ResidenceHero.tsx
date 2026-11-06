/**
 * ResidenceHero: full-bleed photo of the chosen residence with parallax
 * (drifts slower than the page, stretches on pull-down), soft navy fades,
 * status pills, name and address. The content sheet overlaps its bottom.
 */

import React from 'react';
import { Animated, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { MapPinIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';

interface Props {
  image: ImageSourcePropType;
  name: string;
  street: string;
  city: string;
  statusLabel: string;
  firstName: string;
  /** Gold line above the name (default: "Welcome home, <firstName>") */
  eyebrow?: string;
  /** First pill, with the green dot (default: "Your Residence") */
  primaryPill?: string;
  width: number;
  height: number;
  /** How far the sheet below overlaps the photo */
  sheetOverlap: number;
  scrollY: Animated.Value;
}

export const ResidenceHero: React.FC<Props> = ({
  image,
  name,
  street,
  city,
  statusLabel,
  firstName,
  eyebrow,
  primaryPill = 'Your Residence',
  width,
  height,
  sheetOverlap,
  scrollY,
}) => {
  const imageStyle = {
    transform: [
      {
        // Parallax: the photo moves at ~half the scroll speed
        translateY: scrollY.interpolate({
          inputRange: [-height, 0, height],
          outputRange: [-height / 2, 0, height * 0.45],
          extrapolateRight: 'clamp' as const,
        }),
      },
      {
        // Pull-down stretch
        scale: scrollY.interpolate({
          inputRange: [-height, 0],
          outputRange: [2, 1],
          extrapolate: 'clamp' as const,
        }),
      },
    ],
  };
  // Title block drifts up and fades as the page scrolls
  const copyStyle = {
    opacity: scrollY.interpolate({
      inputRange: [0, height * 0.45],
      outputRange: [1, 0],
      extrapolate: 'clamp' as const,
    }),
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, height],
          outputRange: [0, -height * 0.18],
          extrapolate: 'clamp' as const,
        }),
      },
    ],
  };

  return (
    <View style={{ width, height }}>
      <Animated.Image
        source={image}
        style={[{ width, height }, imageStyle]}
        resizeMode="cover"
      />
      <Scrim edge="top" extent={0.32} maxOpacity={0.6} />
      <Scrim edge="bottom" extent={0.62} maxOpacity={0.94} />

      <Animated.View
        style={[styles.copy, { paddingBottom: sheetOverlap + spacing.xl }, copyStyle]}
      >
        <Text style={styles.eyebrow}>{eyebrow ?? `Welcome home, ${firstName}`}</Text>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.addressRow}>
          <MapPinIcon size={ms(15)} color={colors.heroAccent} style={styles.pin} />
          <Text style={styles.address} numberOfLines={2}>
            {street}, {city}
          </Text>
        </View>
        <View style={styles.pills}>
          <View style={styles.pill}>
            <View style={styles.dot} />
            <Text style={styles.pillText}>{primaryPill}</Text>
          </View>
          <View style={[styles.pill, styles.pillGhost]}>
            <Text style={styles.pillText}>{statusLabel}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  copy: {
    position: 'absolute',
    left: spacing.screenHorizontal + 4,
    right: spacing.screenHorizontal + 4,
    bottom: 0,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: 'rgba(250,210,77,0.92)',
    letterSpacing: 2.4,
  },
  name: {
    ...typographyPresets.heroTitle,
    fontSize: scaleFont(34),
    lineHeight: scaleFont(41),
    marginTop: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  pin: {
    marginTop: 2,
  },
  address: {
    flex: 1,
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
    color: 'rgba(255,255,255,0.9)',
  },
  pills: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(7),
    height: ms(30),
    paddingHorizontal: spacing.md + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillGhost: {
    backgroundColor: 'rgba(11,29,58,0.35)',
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#4ADE80',
  },
  pillText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(12),
    color: colors.white,
  },
});

export default ResidenceHero;

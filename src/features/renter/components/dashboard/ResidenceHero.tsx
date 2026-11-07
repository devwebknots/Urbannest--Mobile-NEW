/**
 * ResidenceHero: full-bleed photo of the chosen residence with parallax
 * (drifts slower than the page, stretches on pull-down), soft navy fades,
 * status pills, name and address. The content sheet overlaps its bottom.
 * Behind the text, the bottom of the photo is frosted (a blurred copy of
 * the same photo, lined up and moving with it) for a glass effect.
 */

import React, { useState } from 'react';
import { Animated, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { MapPinIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';

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
  /** Frosted-glass blur behind the text */
  glass?: boolean;
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
  glass = false,
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

  // Height of the frosted area (text block + a little room above it)
  const [measured, setGlassHeight] = useState(0);
  const glassHeight = glass ? measured : 0;

  return (
    <View style={{ width, height }}>
      <Animated.Image
        source={image}
        style={[{ width, height }, imageStyle]}
        resizeMode="cover"
      />
      <Scrim edge="top" extent={0.32} maxOpacity={0.6} />
      {/* With glass: light neutral fade instead of the navy one */}
      {glass ? (
        <Scrim edge="bottom" extent={0.62} maxOpacity={0.35} color="#000000" />
      ) : (
        <Scrim edge="bottom" extent={0.62} maxOpacity={0.94} />
      )}

      {/* Frosted glass behind the text: blurred photo, same position and motion */}
      {glassHeight > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.glass, { height: glassHeight }, { opacity: copyStyle.opacity }]}
        >
          <Animated.Image
            source={image}
            blurRadius={20}
            style={[{ width, height, top: glassHeight - height }, styles.glassImage, imageStyle]}
            resizeMode="cover"
          />
          {/* White frost over the blur (plain View: the app's LinearGradient
              only draws its preset brand gradients) */}
          <View style={styles.glassFrost} />
          <View style={styles.glassEdge} />
        </Animated.View>
      ) : null}

      <Animated.View
        onLayout={e => setGlassHeight(Math.round(e.nativeEvent.layout.height + GLASS_TOP))}
        style={[styles.copy, { paddingBottom: sheetOverlap + (glass ? spacing.sm : spacing.xl) }, copyStyle]}
      >
        {eyebrow === '' ? null : (
          <Text style={styles.eyebrow}>{eyebrow ?? `Welcome home, ${firstName}`}</Text>
        )}
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

// Glass starts this far above the first line of text
const GLASS_TOP = 0;

const styles = StyleSheet.create({
  glass: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    // App card radius; the bottom edge is hidden under the sheet
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  glassImage: {
    position: 'absolute',
    left: 0,
  },
  glassFrost: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  // Thin light line along the top of the glass
  glassEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  copy: {
    position: 'absolute',
    left: spacing.screenHorizontal + 4,
    right: spacing.screenHorizontal + 4,
    bottom: 0,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: 'rgba(250,210,77,0.92)',
  },
  name: {
    ...typographyPresets.heroTitle,
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
    ...typographyPresets.heroSubtitle,
    flex: 1,
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
    ...typographyPresets.badge,
    color: colors.white,
  },
});

export default ResidenceHero;

/**
 * PmsHero: navy top of the PMS home, as in the "UrbanNest Real Estate
 * Dashboard" design: header row (menu, brand + role line, search, bell with
 * red dot, glass avatar), greeting, "Here's your Dashboard" headline with a
 * short green rule and the intro line on the left.
 *
 * Background (design "Screenshot 2026-11-17 180718"), back to front:
 *  - header band: very dark navy (hero background, design #0A1A33);
 *  - left section (circle DARK) with a glass look (GLASS: flat navy, then
 *    brighter blue towards its curved edge + faint rim); that edge leaves the
 *    top edge right of the brand and curves down to the photo's corner;
 *  - building photo: starts just under the header row, fills to the
 *    bottom-right corner, big rounded top-left corner (PHOTO_CORNER) whose
 *    arc ends at PHOTO_LEFT on the bottom edge; building kept whole, trees
 *    cut on the right as in the design. A slate-blue haze (HAZE,
 *    BLEND_SHARE) melts the left section smoothly into it (no rim line).
 * The green "24 units" pill floats at the photo's top right.
 * Plain screen-sized boxes only (a huge clipping circle hid the photo on Android).
 */

import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { HeaderBrand } from '@/components/BrandLogo';
import { ProfileAvatar, PROFILE_AVATAR_SIZE } from '@/components/ProfileAvatar';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { HERO_BUILDING_ASPECT, pmsAssets } from '../assets/pmsAssets';
import type { PmsProfile } from '../types';
import { PmsIcon } from './PmsIcon';

// Header band navy (design #0A1A33, darkest part of the hero) as rgb
const PANEL = '10,26,51';
// colors.pmsNavy (#0E2147) as rgb
const NAVY = '14,33,71';

/** Photo's left edge at the bottom of the hero, as a share of the width */
const PHOTO_LEFT = 0.44;
/** Photo's rounded top-left corner: radius as a share of the photo height */
const PHOTO_CORNER = 0.85;
/** Where the building's centre sits across the photo area (0 left – 1 right) */
const BUILDING_AT = 0.55;
/** Building centre across the photo file (0 – 1) */
const BUILDING_IN_PHOTO = 0.39;
/**
 * Dark left shape (circle) behind the header band: centre and radius as
 * shares of the width, centre measured from the photo's top. Its right edge
 * leaves the top edge at ~0.64 W and meets the photo's top-left corner.
 */
const DARK = { cx: 0.2, cy: 0.1, r: 0.56 };
/**
 * Glass look of the left section (colours sampled from the design): flat
 * #0B1B34 up to `from` % of the radius, then brighter blue towards the
 * curved edge, with a faint light rim on it.
 */
const GLASS = {
  base: '#0B1B34',
  from: 62,
  mid: '#0A2244',
  edge: '#08294F',
  rim: '#1C3B68',
};
/** Left-section blend over the photo: covers this share of the photo width */
const BLEND_SHARE = 0.5;
// Haze colour of that blend (sampled from the design), as rgb
const HAZE = '38,57,90';
/** Logo width in HeaderBrand (24 high, 240:232) + its gap: role line indent */
const BRAND_INDENT = ms(24) * (240 / 232) + spacing.sm;
const ICON_BUTTON = ms(36);

interface Props {
  topInset: number;
  profile: PmsProfile;
  greeting: string;
  totalUnits: number;
  onMenu: () => void;
  onSearch: () => void;
  onNotifications: () => void;
  onProfile: () => void;
}

export const PmsHero: React.FC<Props> = ({
  topInset,
  profile,
  greeting,
  totalUnits,
  onMenu,
  onSearch,
  onNotifications,
  onProfile,
}) => {
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);
  const barTop = topInset + spacing.sm;

  const onLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    setHeight(prev => (prev === h ? prev : h));
  };

  // Photo area: from just under the header row to the hero's bottom
  const photoTop = barTop + PROFILE_AVATAR_SIZE + spacing.md;
  const boxLeft = width * PHOTO_LEFT;
  const boxW = width - boxLeft;
  const photoH = Math.max(0, height - photoTop);
  const corner = Math.min(photoH * PHOTO_CORNER, boxW * 0.8);
  // Image keeps its aspect at the box height; building centred in the box
  const imgW = photoH * HERO_BUILDING_ASPECT;
  const imgLeft = Math.min(0, Math.max(boxW - imgW, boxW * BUILDING_AT - imgW * BUILDING_IN_PHOTO));
  const darkR = width * DARK.r;

  return (
    <View style={[styles.hero, { paddingTop: barTop }]} onLayout={onLayout}>
      {/* Dark left shape: its soft right edge curves through the header band */}
      <View
        pointerEvents="none"
        style={[
          styles.dark,
          {
            left: width * DARK.cx - darkR,
            top: photoTop + width * DARK.cy - darkR,
            width: darkR * 2,
            height: darkR * 2,
            borderRadius: darkR,
            // Glass: flat navy in the middle, brightening towards the curved edge
            backgroundImage: `radial-gradient(circle ${darkR}px at center, ${GLASS.base} 0%, ${GLASS.base} ${GLASS.from}%, ${GLASS.mid} ${(GLASS.from + 100) / 2}%, ${GLASS.edge} 97%, ${GLASS.rim} 100%)`,
          },
        ]}
      />

      {/* Building photo: under the header, big rounded top-left corner */}
      {photoH > 0 ? (
        <View
          pointerEvents="none"
          style={[
            styles.photo,
            { left: boxLeft, top: photoTop, height: photoH, borderTopLeftRadius: corner },
          ]}
        >
          <Image
            source={pmsAssets.heroBuilding}
            style={[styles.photoImage, { left: imgLeft, width: imgW, height: photoH }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={styles.photoFadeTop} />
          <View style={styles.photoFadeBottom} />
          {/* Left section blends into the building image (design) */}
          <View style={[styles.photoBlend, { width: boxW * BLEND_SHARE }]} />
        </View>
      ) : null}

      {/* Header row */}
      <View style={styles.bar}>
        <Pressable
          onPress={onMenu}
          hitSlop={6}
          style={({ pressed }) => [styles.menu, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <PmsIcon name="menu" size={ms(18)} color={colors.white} />
        </Pressable>
        <View style={styles.brand}>
          <HeaderBrand />
          <Text style={styles.role} numberOfLines={1}>
            {profile.role}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={onSearch}
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
            <PmsIcon name="search" size={ms(20)} color={colors.white} />
          </Pressable>
          <Pressable
            onPress={onNotifications}
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <PmsIcon name="bell" size={ms(20)} color={colors.white} />
            <View style={styles.dot} />
          </Pressable>
          <ProfileAvatar initials={profile.initials} variant="glass" onPress={onProfile} />
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.copy}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.title} accessibilityRole="header">
          Here’s your{'\n'}Dashboard
        </Text>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>
          Track your portfolio, activity and performance at a glance.
        </Text>
      </View>

      {/* "24 units" pill, top right of the photo area */}
      <View style={[styles.unitsPill, { top: photoTop + spacing.md }]}>
        <View style={styles.unitsDot} />
        <Text style={styles.unitsText}>{totalUnits} units</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Header band navy (design: a shade lighter than the left side)
  hero: {
    backgroundColor: `rgb(${PANEL})`,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    overflow: 'hidden',
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xxl,
  },
  // Deep navy left shape, a touch lighter at its top left
  // Deep navy left shape, a touch lighter at its top left
  dark: {
    position: 'absolute',
    backgroundColor: GLASS.base,
  },
  // Clip box for the building photo (anchored bottom-right)
  photo: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    backgroundColor: `rgb(${PANEL})`,
  },
  photoImage: {
    position: 'absolute',
    top: 0,
  },
  // Slate-blue haze (design #26395A) at the photo's left edge, easing
  // smoothly into the sky / trees: no dark wall, no hard edge
  photoBlend: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundImage: `linear-gradient(90deg, rgba(${HAZE},0.96) 0%, rgba(${HAZE},0.82) 14%, rgba(${HAZE},0.6) 32%, rgba(${HAZE},0.36) 52%, rgba(${HAZE},0.16) 74%, rgba(${HAZE},0) 100%)`,
  },
  // Thin soft fade where the sky meets the band
  photoFadeTop: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `linear-gradient(180deg, rgba(${PANEL},0.7) 0%, rgba(${PANEL},0) 10%)`,
  },
  // Faint light rim along the photo's curved corner
  photoFadeBottom: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `linear-gradient(180deg, rgba(${NAVY},0) 78%, rgba(${NAVY},0.45) 100%)`,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  brand: {
    flex: 1,
    marginLeft: spacing.md,
  },
  role: {
    ...typographyPresets.tagSmall,
    color: colors.textInverseMuted,
    marginLeft: BRAND_INDENT,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButton: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: ms(8),
    right: ms(9),
    width: ms(7),
    height: ms(7),
    borderRadius: ms(3.5),
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.pmsNavy,
  },
  pressed: {
    opacity: 0.7,
  },
  copy: {
    marginTop: spacing.xl,
    width: '50%',
  },
  greeting: {
    ...typographyPresets.bodyMedium,
    color: colors.white,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    marginTop: spacing.xs,
  },
  rule: {
    width: ms(30),
    height: 3,
    borderRadius: 2,
    marginTop: spacing.md,
    backgroundColor: colors.success,
  },
  subtitle: {
    ...typographyPresets.heroSubtitle,
    marginTop: spacing.md,
  },
  unitsPill: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(220,252,231,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    boxShadow: '0px 0px 14px rgba(16,185,129,0.45)',
  },
  unitsDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.success,
  },
  unitsText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.successDark,
  },
});

export default PmsHero;

/**
 * LandlordHero: deep indigo top of the landlord dashboard, as in the
 * "Landlord Dashboard Overview" design: a large soft arc over the top left,
 * an indigo glow behind the dusk building photo, plain white header icons
 * with a glass avatar, glass "Executive Profile" pill, scalloped verified
 * badge, the frosted glass portfolio strip (Properties / Total Units /
 * Active Tenants) and the two header actions. The screen adds the fade into
 * the page below it.
 *
 * Building: a PNG with feathered alpha edges (no square cut). Its base runs
 * under the strip by the design's share of the screen width; the strip draws
 * a blurred copy of it at the same screen position (frosted glass, the app's
 * glass technique: no native blur library).
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
import { Button } from '@/components/Button';
import { HeaderBrand } from '@/components/BrandLogo';
import { CheckmarkIcon } from '@/components/icons';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { HEADER_BUILDING_ASPECT, landlordAssets } from '../assets/landlordAssets';
import type { LandlordIconName, LandlordProfile, PortfolioStat } from '../types';
import { LandlordIcon } from './LandlordIcon';

// colors.landlordHeroGlow (#304088) as rgb
const GLOW = '48,64,136';

/** Logo width in HeaderBrand (24 high, 240:232) + its gap: subtitle indent */
const BRAND_INDENT = ms(24) * (240 / 232) + spacing.sm;

/**
 * Building photo width as a share of the screen (design: the building fills
 * the right half, roof just under "Active Portfolio")
 */
const PHOTO_SHARE = 0.75;
/**
 * Share of the photo's height that runs under the glass strip: the
 * building's base and trees sit behind the frosted glass, the upper
 * floors and roof stay in view above it
 */
const PHOTO_UNDER_SHARE = 0.32;
/** Space between the greeting and the strip */
const STRIP_GAP = ms(76);
/** Strip is a little wider than the content column, as in the design */
const STRIP_OUTSET = spacing.xs;
const STRIP_BORDER = 1;
/** Strip height before it is measured */
const STRIP_H_GUESS = ms(64);

/**
 * Background disc: centre and radius as shares of the screen width, fitted to
 * the curve in the design (passes ~0.59 W at the top, ~0.5 W at the
 * Executive Profile row, ~0.41 W at the greeting). Measured from the top of
 * the content, i.e. below the status bar.
 */
// Oval (rx wide, ry tall) so the lit curve runs on down towards the name
// heading; the top crossing (~0.59 W) stays where the design has it. ry is
// only the fallback: once the name is measured, the oval ends ARC_GAP above it.
const ARC = { cx: 0.346, cy: -0.05, rx: 0.25, ry: 0.37 };
/** Space kept between the bottom of the curve and the top of the name */
const ARC_GAP = ms(26);

interface Props {
  topInset: number;
  profile: LandlordProfile;
  greeting: string;
  stats: readonly PortfolioStat[];
  onNotifications: () => void;
  onHelp: () => void;
  onProfile: () => void;
  /** Burger menu at the far right: opens the side menu */
  onMenu: () => void;
  onAddRequest: () => void;
  onMessagePm: () => void;
}

const HeaderIconButton: React.FC<{
  icon: LandlordIconName;
  label: string;
  onPress: () => void;
  dot?: boolean;
}> = ({ icon, label, onPress, dot }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <LandlordIcon name={icon} size={ms(22)} color={colors.white} />
    {dot ? <View style={styles.dot} /> : null}
  </Pressable>
);

/** Scalloped "verified" seal: two rounded squares, one turned 45° */
const VerifiedBadge: React.FC = () => (
  <View style={styles.verified} accessibilityLabel="Verified">
    <View style={styles.sealSquare} />
    <View style={[styles.sealSquare, styles.sealTurned]} />
    <CheckmarkIcon size={ms(11)} color={colors.white} />
  </View>
);

export const LandlordHero: React.FC<Props> = ({
  topInset,
  profile,
  greeting,
  stats,
  onNotifications,
  onHelp,
  onProfile,
  onMenu,
  onAddRequest,
  onMessagePm,
}) => {
  const { width } = useWindowDimensions();
  const photoWidth = Math.round(width * PHOTO_SHARE);
  const photoHeight = Math.round(photoWidth / HEADER_BUILDING_ASPECT);
  const arcW = Math.round(width * ARC.rx * 2);
  // Top of the name row in hero coordinates = body box y (in the hero) +
  // greeting y (in the body box) + name row y (in the greeting)
  const [bodyY, setBodyY] = useState<number | null>(null);
  const [greetingY, setGreetingY] = useState<number | null>(null);
  const [nameRowY, setNameRowY] = useState<number | null>(null);
  const yFrom = (set: (y: number) => void) => (e: LayoutChangeEvent) =>
    set(Math.round(e.nativeEvent.layout.y));
  const nameTop =
    bodyY !== null && greetingY !== null && nameRowY !== null
      ? bodyY + greetingY + nameRowY
      : null;
  const arcCenterY = topInset + width * ARC.cy;
  // Bottom of the oval stops ARC_GAP above the name: close, never touching
  const arcRy =
    nameTop !== null ? Math.max(width * 0.2, nameTop - ARC_GAP - arcCenterY) : width * ARC.ry;
  const arcH = Math.round(arcRy * 2);
  const [stripH, setStripH] = useState(STRIP_H_GUESS);
  // Photo bottom, measured up from the strip's bottom edge: the lower
  // PHOTO_UNDER_SHARE of the building sits behind the glass
  const photoBottom = stripH - Math.round(photoHeight * PHOTO_UNDER_SHARE);
  const onStripLayout = (e: LayoutChangeEvent) => {
    const h = Math.round(e.nativeEvent.layout.height);
    if (h !== stripH) {
      setStripH(h);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: topInset + spacing.md }]}>
      {/* Background: glow behind the building + the big soft arc */}
      <View pointerEvents="none" style={styles.glow} />
      {/* Top right: dark at the top, brightening down towards the roof */}
      <View
        pointerEvents="none"
        style={[
          styles.topRightLight,
          {
            width: Math.round(width * 0.8),
            // Twice the distance to the roof: the brightest row (the middle)
            // sits on the roof, and the light fades out evenly above and below
            // it, so there is no edge line over the building
            height: Math.round(((nameTop ?? width * 0.45) + ms(40)) * 2),
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.arc,
          {
            width: arcW,
            height: arcH,
            left: width * ARC.cx - arcW / 2,
            top: arcCenterY - arcH / 2,
          },
        ]}
      />

      {/* Brand row */}
      <View style={styles.topRow}>
        <View style={styles.brand}>
          <HeaderBrand />
          {/* Hidden on request; styles.brandSub kept for when it comes back
          <Text style={[typographyPresets.heroSubtitle, styles.brandSub]}>
            Landlord Dashboard
          </Text> */}
        </View>
        {/* Commented out on request (notifications + help hidden for now);
            styles.headerDivider kept for when they come back
        <HeaderIconButton
          icon="bell"
          label="Notifications"
          onPress={onNotifications}
          dot={profile.unreadAlerts > 0}
        />
        <HeaderIconButton icon="help" label="Help" onPress={onHelp} />
        <View style={styles.headerDivider} /> */}
        <ProfileAvatar initials={profile.initials} onPress={onProfile} variant="glass" />
        <HeaderIconButton icon="menu" label="Open menu" onPress={onMenu} />
      </View>
      {/* Divider under the brand row removed on request (styles.rule kept)
      <View style={styles.rule} /> */}

      {/* Greeting + strip share one box so the photo can be anchored to the
          strip: its bottom edge always sits hidden behind the glass */}
      <View onLayout={yFrom(setBodyY)}>
        {/* Bright blue sky light spreading out from behind the roof */}
        <View
          pointerEvents="none"
          style={[
            styles.skyGlow,
            {
              width: Math.round(photoWidth * 1.45),
              height: Math.round(photoHeight * 1.5),
              bottom: photoBottom + Math.round(photoHeight * 0.2),
            },
          ]}
        />
        <Image
          source={landlordAssets.headerBuilding}
          style={[
            styles.photo,
            { width: photoWidth, height: photoHeight, bottom: photoBottom },
          ]}
          resizeMode="cover"
        />

      <View style={styles.greeting} onLayout={yFrom(setGreetingY)}>
        <View style={styles.badgeRow}>
          {/* Hidden on request; styles.executive kept for when it comes back
          <View style={styles.executive}>
            <LandlordIcon name="crown" size={ms(14)} color={colors.gold} />
            <Text style={[typographyPresets.badge, styles.whiteText]}>Executive Profile</Text>
          </View> */}
          <View style={styles.live}>
            <View style={styles.liveDot} />
            <Text style={[typographyPresets.label, styles.whiteText]}>Active Portfolio</Text>
          </View>
        </View>

        <Text style={[typographyPresets.bodyMedium, styles.hello]}>{greeting},</Text>
        <View style={styles.nameRow} onLayout={yFrom(setNameRowY)}>
          <Text style={[typographyPresets.heroTitle, styles.name]} numberOfLines={1}>
            {profile.name}
          </Text>
          <VerifiedBadge />
        </View>
        <View style={styles.roleRow}>
          <LandlordIcon name="shieldCheck" size={ms(14)} color={colors.white} />
          <Text style={[typographyPresets.heroSubtitle, styles.whiteText]}>{profile.role}</Text>
        </View>
      </View>

      {/* Portfolio strip: frosted glass over the building */}
      <View style={styles.strip} onLayout={onStripLayout}>
        {/* Blurred copy of the building at the same screen position */}
        <Image
          source={landlordAssets.headerBuilding}
          blurRadius={14}
          style={[
            styles.photo,
            {
              width: photoWidth,
              height: photoHeight,
              right: -(spacing.screenHorizontal - STRIP_OUTSET - STRIP_BORDER),
              bottom: photoBottom - STRIP_BORDER,
            },
          ]}
          resizeMode="cover"
        />
        {/* Dark tint over the blurred building keeps the white text readable */}
        <View pointerEvents="none" style={styles.tint} />
        <View pointerEvents="none" style={styles.frost} />

        {stats.map((stat, i) => (
          <React.Fragment key={stat.id}>
            {i > 0 ? <View style={styles.statDivider} /> : null}
            <View style={styles.stat}>
              <View style={styles.statIcon}>
                <LandlordIcon name={stat.icon} size={ms(15)} color={colors.white} />
              </View>
              <View>
                <Text
                  style={[typographyPresets.caption, styles.statLabel]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1}
                >
                  {stat.label}
                </Text>
                <Text
                  style={[typographyPresets.price, styles.statValue]}
                  maxFontSizeMultiplier={1}
                >
                  {stat.value}
                </Text>
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Add Request"
          variant="light"
          size="md"
          onPress={onAddRequest}
          style={styles.action}
          leftIcon={<LandlordIcon name="plus" size={ms(16)} color={colors.navy} />}
        />
        <Button
          title="Message PM"
          variant="glass"
          size="md"
          onPress={onMessagePm}
          style={styles.action}
          leftIcon={<LandlordIcon name="message" size={ms(16)} color={colors.white} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.xl,
    backgroundColor: colors.landlordHero,
    overflow: 'hidden',
  },
  // Brighter indigo light behind the building, fading out to the edges
  // Sampled from the design: #141F4A at the top right, #2D4386 / #364E95
  // at the roof. Brightest on the roof line at the right, fading up, left and
  // down (mirrored), transparent before the bottom edge.
  topRightLight: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundImage:
      'radial-gradient(ellipse at 80% 50%, rgba(54,78,149,0.9) 0%, rgba(45,67,134,0.6) 30%, rgba(30,46,102,0.25) 52%, rgba(30,46,102,0) 70%)',
  },
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `radial-gradient(circle at 78% 42%, rgba(${GLOW},0.95) 0%, rgba(${GLOW},0.45) 30%, rgba(${GLOW},0) 62%)`,
  },
  // Only the right rim of the disc shows: it is the hero colour on its left
  // and brightens to #4558A8 at the curve (sampled from the design), so the
  // eye reads a lit crescent, not a circle. No border (that drew the circle).
  arc: {
    position: 'absolute',
    // 50% on both axes: an ellipse, not a capsule
    borderRadius: '50%',
    backgroundImage:
      'linear-gradient(100deg, rgba(69,88,168,0) 0%, rgba(69,88,168,0) 62%, rgba(69,88,168,0.45) 85%, rgba(69,88,168,1) 100%)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  brand: {
    flex: 1,
  },
  brandSub: {
    marginLeft: BRAND_INDENT,
  },
  iconButton: {
    width: ms(32),
    height: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  dot: {
    position: 'absolute',
    top: ms(3),
    right: ms(4),
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.landlordHero,
  },
  headerDivider: {
    width: StyleSheet.hairlineWidth,
    height: ms(26),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  greeting: {
    paddingTop: spacing.lg,
  },
  // Building at the right screen edge (edges feathered in the PNG); bottom
  // is set per render so its base runs under the strip
  // Sky light from the design (#6179C3 at the roof, #4D67B5 around it),
  // fading into the indigo well past the photo's edges
  skyGlow: {
    position: 'absolute',
    right: -spacing.screenHorizontal,
    backgroundImage:
      'radial-gradient(ellipse at 55% 55%, rgba(97,121,195,0.85) 0%, rgba(77,103,181,0.55) 30%, rgba(54,78,149,0.22) 55%, rgba(48,64,136,0) 75%)',
  },
  photo: {
    position: 'absolute',
    right: -spacing.screenHorizontal,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  executive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    paddingHorizontal: spacing.md,
    paddingVertical: ms(6),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // marginLeft auto: stays on the right even when it is alone in the row
  live: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  liveDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
    backgroundColor: colors.liveBadge.dot,
  },
  whiteText: {
    color: colors.white,
  },
  hello: {
    marginTop: spacing.lg,
    color: colors.white,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  name: {
    flexShrink: 1,
  },
  verified: {
    width: ms(22),
    height: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealSquare: {
    position: 'absolute',
    width: ms(17),
    height: ms(17),
    borderRadius: ms(5),
    backgroundColor: colors.headerGradientEnd,
  },
  sealTurned: {
    transform: [{ rotate: '45deg' }],
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: spacing.xs,
  },
  // Frosted glass: lighter indigo fill + blurred building + white sheen.
  // Icon left, label over value; fixed sizes so every cell lines up.
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: STRIP_GAP,
    marginHorizontal: -STRIP_OUTSET,
    paddingVertical: spacing.md,
    paddingHorizontal: ms(10),
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(39,51,107,0.9)',
    borderWidth: STRIP_BORDER,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(21,32,79,0.55)',
  },
  frost: {
    ...StyleSheet.absoluteFill,
    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.02) 100%)',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: ms(30),
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  statIcon: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.85)',
    includeFontPadding: false,
  },
  statValue: {
    color: colors.white,
    includeFontPadding: false,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  action: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});

export default LandlordHero;

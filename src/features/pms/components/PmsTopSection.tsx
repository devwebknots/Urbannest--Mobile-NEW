/**
 * PmsTopSection: the PMS home top, built exactly like the guest home top
 * (reuses the guest HeroSection: swipeable navy-graded house photos that
 * auto-advance, page dots on a dark pill, soft fade into the page).
 * PMS content on it:
 *  - header: HeaderBrand + role line; frosted round bell (red dot) and
 *    burger buttons (HeroRoundButton) and the glass avatar;
 *  - greeting + frosted "24 units" pill, "Here's your" / gold slanted
 *    "Dashboard" (HeroAccentWord, as "Simple" on the guest page), and a
 *    `light` "View Portfolio" button.
 *
 * Replaces PmsHero (kept in components/, unwired).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HeaderBrand } from '@/components/BrandLogo';
import { Button } from '@/components/Button';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { HERO_IMAGES } from '@/features/guest/constants';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import {
  HeroAccentWord,
  HeroRoundButton,
  HeroSection,
} from '@/features/guest/components/HeroSection';
import { moderateScale as ms } from '@/utils/responsive';
import type { PmsProfile } from '../types';
import { PmsIcon } from './PmsIcon';

/** Logo width in HeaderBrand (24 high, 240:232) + its gap: role line indent */
const BRAND_INDENT = ms(24) * (240 / 232) + spacing.sm;

interface Props {
  topInset: number;
  profile: PmsProfile;
  greeting: string;
  totalUnits: number;
  onMenu: () => void;
  onNotifications: () => void;
  onProfile: () => void;
  onViewPortfolio: () => void;
}

export const PmsTopSection: React.FC<Props> = ({
  topInset,
  profile,
  greeting,
  totalUnits,
  onMenu,
  onNotifications,
  onProfile,
  onViewPortfolio,
}) => (
  <HeroSection
    images={HERO_IMAGES}
    topInset={topInset}
    onMenuPress={onMenu}
    onExplorePress={onViewPortfolio}
    header={
      <View style={styles.header}>
        <View style={styles.brand} pointerEvents="none">
          <HeaderBrand />
          <Text style={styles.role} numberOfLines={1}>
            {profile.role}
          </Text>
        </View>
        <View style={styles.actions}>
          <HeroRoundButton onPress={onNotifications} accessibilityLabel="Notifications">
            <PmsIcon name="bell" size={ms(18)} color={colors.white} />
            <View style={styles.dot} />
          </HeroRoundButton>
          <ProfileAvatar initials={profile.initials} variant="glass" onPress={onProfile} />
          <HeroRoundButton onPress={onMenu} accessibilityLabel="Open menu">
            <PmsIcon name="menu" size={ms(18)} color={colors.white} />
          </HeroRoundButton>
        </View>
      </View>
    }
    body={
      <>
        <View pointerEvents="none">
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>{greeting},</Text>
            <View style={styles.unitsPill}>
              <View style={styles.unitsDot} />
              <Text style={styles.unitsText}>{totalUnits} units</Text>
            </View>
          </View>
          <Text style={typographyPresets.heroTitle}>Here’s your</Text>
          <HeroAccentWord text="Dashboard" />
        </View>
        <Button
          title="View Portfolio"
          variant="light"
          size="md"
          onPress={onViewPortfolio}
          rightIcon={<ArrowRightIcon size={ms(16)} color={colors.navy} />}
          style={styles.button}
        />
      </>
    }
  />
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flex: 1,
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
    gap: spacing.sm,
  },
  dot: {
    position: 'absolute',
    top: ms(9),
    right: ms(10),
    width: ms(7),
    height: ms(7),
    borderRadius: ms(3.5),
    backgroundColor: colors.error,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  greeting: {
    ...typographyPresets.bodyMedium,
    color: colors.white,
  },
  // Frosted pill, same glass as the header buttons
  unitsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: ms(10),
    paddingVertical: ms(3),
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  unitsDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.heroAccent,
  },
  unitsText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: 'flex-start',
  },
});

export default PmsTopSection;

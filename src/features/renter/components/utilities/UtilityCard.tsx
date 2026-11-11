/**
 * UtilityCard: one utility on the Utilities page, as a full-width photo
 * card. Icon chip and provider count on top; a navy fade at the bottom
 * holds the Playfair name, a one-line hint and "View providers" with the
 * round arrow. The whole card opens the providers page.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG } from '@/features/guest/components/CardBackground';
import { ArrowCircleIcon } from '@/features/guest/components/GuestIcons';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
import type { UtilityService } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  utility: UtilityService;
  width: number;
  onPress: () => void;
}

export const UtilityCard: React.FC<Props> = ({ utility, width, onPress }) => {
  const height = Math.round(width * 0.66);
  const count = utility.providers.length;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={utility.label}
      accessibilityHint="Opens the providers for this utility"
      style={({ pressed }) => [styles.shadow, { height }, pressed && styles.pressed]}
    >
      <View style={styles.clip}>
        <Image source={utility.image} style={{ width, height }} resizeMode="cover" />
        <Scrim edge="bottom" extent={0.78} maxOpacity={0.92} />

        <View style={styles.topRow}>
          <View style={styles.iconChip}>
            <RenterIcon name={utility.icon} size={ms(20)} color={colors.navy} />
          </View>
          <View style={styles.countPill}>
            <Text style={styles.countText}>
              {count} {count === 1 ? 'provider' : 'providers'}
            </Text>
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title} numberOfLines={1}>
            {utility.label}
          </Text>
          <Text style={styles.hint} numberOfLines={1}>
            {utility.hint}
          </Text>
          <View style={styles.linkRow}>
            <Text style={styles.link}>View providers</Text>
            <ArrowCircleIcon size={ms(28)} background={colors.white} color={colors.navy} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadow: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.navy,
    ...shadows.lg,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  clip: {
    flex: 1,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  topRow: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconChip: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  // Same dark pill as the inspection "Area n of N" tag
  countPill: {
    height: ms(28),
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11,29,58,0.6)',
  },
  countText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  bottom: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
  },
  hint: {
    ...typographyPresets.heroSubtitle,
    marginTop: spacing.xxs,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  link: {
    ...typographyPresets.button,
    color: colors.white,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

export default UtilityCard;

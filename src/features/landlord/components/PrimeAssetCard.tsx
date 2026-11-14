/**
 * PrimeAssetCard: one property row in "Prime Assets".
 * Photo left; name + status pill, location, units / occupied; occupancy ring
 * with the % and a chevron on the right. The whole card is pressable.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, commonStyles, spacing, typographyPresets } from '@/config/theme';
import { ProgressRing } from '@/features/application/components/ProgressRing';
import { moderateScale as ms } from '@/utils/responsive';
import { ASSET_PHOTO_ASPECT } from '../assets/landlordAssets';
import type { AssetStatus, PrimeAsset } from '../types';
import { percent } from '../utils';
import { DashboardCard } from './DashboardParts';
import { LandlordIcon } from './LandlordIcon';

const PHOTO_H = ms(78);
const PHOTO_W = Math.round(PHOTO_H * ASSET_PHOTO_ASPECT * 0.62);

const STATUS_COLORS: Record<AssetStatus, { bg: string; fg: string }> = {
  Stabilized: { bg: colors.chipBlue, fg: colors.primaryDark },
  Active: { bg: colors.successLight, fg: colors.successDark },
};

export const PrimeAssetCard: React.FC<{
  asset: PrimeAsset;
  onPress: () => void;
}> = ({ asset, onPress }) => {
  const rate = percent(asset.occupied, asset.units);
  const status = STATUS_COLORS[asset.status];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${asset.name}, ${rate}% occupied`}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <DashboardCard style={styles.card}>
        <Image
          source={asset.image}
          style={[styles.photo, { width: PHOTO_W, height: PHOTO_H }]}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[typographyPresets.listingTitle, styles.name]} numberOfLines={1}>
              {asset.name}
            </Text>
            <View style={[commonStyles.pillBadge, { backgroundColor: status.bg }]}>
              <Text style={[typographyPresets.badge, { color: status.fg }]}>{asset.status}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <LandlordIcon name="mapPin" size={ms(12)} color={colors.textMuted} />
            <Text style={typographyPresets.cardSubtitle} numberOfLines={1}>
              {asset.location}
            </Text>
          </View>

          <View style={styles.countRow}>
            <View style={styles.metaRow}>
              <LandlordIcon name="building" size={ms(13)} color={colors.textSecondary} />
              <Text style={typographyPresets.cardSubtitle}>
                <Text style={styles.strong}>{asset.units}</Text> Units
              </Text>
            </View>
            <View style={styles.metaRow}>
              <LandlordIcon name="users" size={ms(13)} color={colors.textSecondary} />
              <Text style={typographyPresets.cardSubtitle}>
                <Text style={styles.strong}>{asset.occupied}</Text> Occupied
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.side}>
          <ProgressRing
            progress={rate / 100}
            size={ms(42)}
            stroke={ms(4)}
            color={colors.primary}
            trackColor={colors.chipBlue}
            accessibilityLabel={`${rate}% occupied`}
          />
          <LandlordIcon name="chevronRight" size={ms(14)} color={colors.textMuted} />
        </View>
      </DashboardCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
  },
  photo: {
    borderRadius: borderRadius.lg,
  },
  info: {
    flex: 1,
    gap: ms(4),
  },
  nameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.xs,
    rowGap: ms(2),
  },
  name: {
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  countRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    rowGap: ms(2),
  },
  strong: {
    fontFamily: typographyPresets.bodyBold.fontFamily,
    fontWeight: typographyPresets.bodyBold.fontWeight,
    color: colors.textPrimary,
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(2),
    paddingRight: spacing.xs,
  },
});

export default PrimeAssetCard;

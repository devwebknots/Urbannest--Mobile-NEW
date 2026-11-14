/**
 * Portfolio Overview pieces (app theme colours and presets):
 *  - OwnerModePill: green "OWNER MODE: ACTIVE" status pill
 *  - PortfolioStats: 2 x 2 summary in a white box (read-only summary rule:
 *    white, radius xl, TILE_BORDER, shadows.sm), tinted icon tiles
 *  - EmptyPropertiesCard: as the design: room photo (cropped from it) on
 *    the left melting into the card, "No properties found" + Add Property right
 *  - EmptyActivity: quiet "No unit activity yet." row
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ClockIcon, PlusIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { ApplicationIcon } from '@/features/application/components/ApplicationIcon';
import type { ApplicationIconName } from '@/features/application/types';
import { landlordAssets } from '../assets/landlordAssets';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';

export const OwnerModePill: React.FC = () => (
  <View style={styles.pill} accessibilityLabel="Owner mode active">
    <View style={styles.pillDot} />
    <Text style={styles.pillText}>OWNER MODE: ACTIVE</Text>
  </View>
);

interface Stat {
  icon: ApplicationIconName;
  tint: string;
  tile: string;
  label: string;
  value: string;
  valueColor?: string;
  note: string;
}

const StatCell: React.FC<{ stat: Stat }> = ({ stat }) => (
  <View style={styles.cell} accessibilityLabel={`${stat.label}, ${stat.value}, ${stat.note}`}>
    <View style={[styles.statTile, { backgroundColor: stat.tile }]}>
      <ApplicationIcon name={stat.icon} size={ms(20)} color={stat.tint} />
    </View>
    <View style={styles.statText}>
      <Text style={styles.statLabel} numberOfLines={1}>
        {stat.label}
      </Text>
      <Text style={[styles.statValue, stat.valueColor ? { color: stat.valueColor } : null]}>
        {stat.value}
      </Text>
      <Text style={styles.statNote} numberOfLines={1}>
        {stat.note}
      </Text>
    </View>
  </View>
);

export const PortfolioStats: React.FC<{
  totalProperties: number;
  totalUnits: number;
  avgOccupancy: number;
  rentThisMonth: number;
}> = ({ totalProperties, totalUnits, avgOccupancy, rentThisMonth }) => {
  const stats: Stat[] = [
    {
      icon: 'building',
      tint: colors.primary,
      tile: colors.infoLight,
      label: 'Total Properties',
      value: String(totalProperties),
      note: 'In your portfolio',
    },
    {
      icon: 'layers',
      tint: colors.avatarPurple.text,
      tile: colors.avatarPurple.bg,
      label: 'Total Units',
      value: String(totalUnits),
      note: 'Across all properties',
    },
    {
      icon: 'users',
      tint: colors.warningDark,
      tile: colors.warningLight,
      label: 'Avg Occupancy',
      value: `${avgOccupancy}%`,
      valueColor: colors.warning,
      note: 'Portfolio average',
    },
    {
      icon: 'coins',
      tint: colors.successDark,
      tile: colors.successLight,
      label: 'Rent This Month',
      value: `$${rentThisMonth.toLocaleString('en-US')}`,
      valueColor: colors.successDark,
      note: 'Collected so far',
    },
  ];
  return (
    <View style={styles.statsBox}>
      <View style={styles.statsRow}>
        <StatCell stat={stats[0]} />
        <View style={styles.vRule} />
        <StatCell stat={stats[1]} />
      </View>
      <View style={styles.hRule} />
      <View style={styles.statsRow}>
        <StatCell stat={stats[2]} />
        <View style={styles.vRule} />
        <StatCell stat={stats[3]} />
      </View>
    </View>
  );
};

export const EmptyPropertiesCard: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <View style={styles.empty}>
    {/* As the design: room photo (cropped from it) on the left, melting
        into the card colour behind the content on the right */}
    <Image source={landlordAssets.emptyPropertiesRoom} style={styles.emptyPhoto} resizeMode="cover" />
    <View style={styles.emptyFade} />
    <View style={styles.emptyText}>
      <Text style={styles.emptyTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
        No properties found
      </Text>
      <Text style={styles.emptyBody}>Add your first property to get started with UrbanNest.</Text>
      <Button
        title="Add Property"
        variant="brand"
        size="md"
        onPress={onAdd}
        leftIcon={<PlusIcon size={ms(16)} color={colors.white} />}
        style={styles.emptyButton}
      />
    </View>
  </View>
);

export const EmptyActivity: React.FC = () => (
  <View style={styles.activity}>
    <ClockIcon size={ms(18)} color={colors.textSecondary} />
    <Text style={styles.activityText}>No unit activity yet.</Text>
  </View>
);

const STAT_TILE = ms(44);
/** "No properties found" card height (the photo matches it) */
const EMPTY_CARD_H = ms(168);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successDark,
  },
  pillDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.success,
    borderWidth: 1,
    borderColor: colors.successLight,
  },
  pillText: {
    ...typographyPresets.badge,
    color: colors.white,
    letterSpacing: 0.6,
  },
  statsBox: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    ...shadows.sm,
  },
  statsRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  vRule: {
    width: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.border,
  },
  hRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  statTile: {
    width: STAT_TILE,
    height: STAT_TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    ...typographyPresets.label,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.body.semiBold,
  },
  statValue: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: typography.fontSize.xxl,
    lineHeight: typography.lineHeight.xxl,
    color: colors.navy,
    marginTop: spacing.xxs,
  },
  statNote: {
    ...typographyPresets.label,
  },
  // Design: soft blue-grey card, room photo on the left ~2/3 melting into
  // the card colour, content on the right
  empty: {
    height: EMPTY_CARD_H,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  // Full card height, width from the crop's shape (620 x 423), pinned
  // left. Exact numbers: % height + aspectRatio drew the photo at its
  // natural pixel size (zoomed in)
  emptyPhoto: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: EMPTY_CARD_H,
    width: Math.round(EMPTY_CARD_H * (620 / 423)),
  },
  // Photo clear on the left, fading into the card colour (#F1F5F9) by the
  // text column
  emptyFade: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      'linear-gradient(90deg, rgba(241,245,249,0) 30%, rgba(241,245,249,0.7) 44%, #F1F5F9 56%, #F1F5F9 100%)',
  },
  // Content column on the right
  emptyText: {
    alignSelf: 'flex-end',
    width: '50%',
    paddingRight: spacing.lg,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.base,
    color: colors.textPrimary,
  },
  emptyBody: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: TILE_BG,
  },
  activityText: {
    ...typographyPresets.body,
    color: colors.textSecondary,
  },
});

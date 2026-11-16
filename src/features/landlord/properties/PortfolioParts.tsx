/**
 * Portfolio Overview pieces (app theme colours and presets):
 *  - OwnerModePill: green "OWNER MODE: ACTIVE" status pill
 *  - PortfolioStats: 2 x 2 summary in a white box (read-only summary rule:
 *    white, radius xl, TILE_BORDER, shadows.sm), tinted icon tiles
 *  - EmptyPropertiesCard: as the design: room photo (cropped from it) on
 *    the left melting into the card, "No properties found" + Add Property right
 *  - ManagedAssetCard: a property in the Managed Assets list (photo + type
 *    tag, name, SELF / PM - ACTIVE pill, ⋯, address, 4 stats, View
 *    Property / View Units: app brand + soft buttons)
 *  - EmptyActivity: quiet "No unit activity yet." row
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ClockIcon, MapPinIcon, PlusIcon } from '@/components/icons';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import type { ManagedAsset } from './usePortfolioOverview';
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

/**
 * Managed asset card (design): photo left with a dark "APARTMENT" tag; name,
 * SELF / PM - ACTIVE pill, ⋯; address; Units / Occupancy / Maintenance /
 * Renewals; "View Property →" + "View Units".
 */
export const ManagedAssetCard: React.FC<{
  asset: ManagedAsset;
  onView: () => void;
  onUnits: () => void;
  onMenu: () => void;
}> = ({ asset, onView, onUnits, onMenu }) => {
  // 2 x 2 so each stat has room (one row of four was too tight)
  const stats = [
    { label: 'Units', value: `${asset.units} Total`, color: colors.navy },
    { label: 'Occupancy', value: `${asset.occupancy}%`, color: colors.warning },
    { label: 'Maintenance', value: `${asset.maintenanceOpen} Open`, color: colors.successDark },
    { label: 'Renewals', value: `${asset.renewalsUpcoming} Upcoming`, color: colors.navy },
  ];
  const statRows = [stats.slice(0, 2), stats.slice(2)];
  const pm = asset.managedBy === 'pm';
  return (
    <View style={styles.asset}>
      <View style={styles.assetPhotoWrap}>
        <Image source={asset.photo} style={styles.assetPhoto} resizeMode="cover" />
        <View style={styles.assetType}>
          <Text style={styles.assetTypeText}>{asset.type}</Text>
        </View>
      </View>

      <View style={styles.assetBody}>
        <View style={styles.assetHead}>
          <Text style={styles.assetName} numberOfLines={1}>
            {asset.name}
          </Text>
          <View style={[styles.managed, pm && styles.managedPm]}>
            <Text style={[styles.managedText, pm && styles.managedTextPm]}>
              {pm ? 'PM - Active' : 'Self'}
            </Text>
          </View>
          <Pressable
            onPress={onMenu}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`${asset.name} options`}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <RenterIcon name="ellipsis" size={ms(16)} color={colors.navy} />
          </Pressable>
        </View>
        <View style={styles.assetAddress}>
          <MapPinIcon size={ms(10)} color={colors.textSecondary} />
          <Text style={styles.assetAddressText} numberOfLines={1}>
            {asset.address}
          </Text>
        </View>

        {/* Stats: soft panel, 2 x 2 (Units | Occupancy, Maintenance | Renewals) */}
        <View style={styles.assetStats}>
          {statRows.map((row, r) => (
            <View key={`row-${r}`} style={[styles.assetStatRow, r > 0 && styles.assetStatRowRule]}>
              {row.map((s, c) => (
                <View key={s.label} style={[styles.assetStat, c > 0 && styles.assetStatRule]}>
                  <Text style={styles.assetStatLabel} numberOfLines={1}>
                    {s.label}
                  </Text>
                  <Text style={[styles.assetStatValue, { color: s.color }]} numberOfLines={1}>
                    {s.value}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.assetActions}>
          {/* App buttons, compact size: brand + light (white, hairline) */}
          <Button
            title="View Property"
            variant="brand"
            size="sm"
            onPress={onView}
            style={styles.assetAction}
          />
          <Button
            title={`View Units (${asset.units})`}
            variant="light"
            size="sm"
            onPress={onUnits}
            style={[styles.assetAction, styles.assetActionLight]}
          />
        </View>
      </View>
    </View>
  );
};

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
  // Managed asset card (design): white box, small inset photo with its
  // own rounded corners on the left, compact text column
  asset: {
    flexDirection: 'row',
    gap: spacing.sm + 1,
    padding: spacing.xs + 2,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  assetPhotoWrap: {
    width: '31%',
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
  },
  // Pinned to the column's edges (no % size) so "cover" crops the photo
  // to the card height instead of stretching it
  assetPhoto: {
    ...StyleSheet.absoluteFill,
    width: undefined,
    height: undefined,
  },
  assetType: {
    position: 'absolute',
    top: spacing.xs + 2,
    left: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11,29,58,0.72)',
  },
  assetTypeText: {
    ...typographyPresets.tagSmall,
    color: colors.white,
  },
  assetBody: {
    flex: 1,
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
    paddingRight: spacing.xs,
  },
  assetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  assetName: {
    ...typographyPresets.bodyBold,
    flex: 1,
    color: colors.navy,
  },
  managed: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  managedPm: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  managedText: {
    ...typographyPresets.tagSmall,
    color: colors.textSecondary,
  },
  managedTextPm: {
    color: colors.primary,
  },
  assetAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: -spacing.xs,
  },
  assetAddressText: {
    ...typographyPresets.microText,
    flex: 1,
  },
  // Soft tinted panel holding the 2 x 2 stats
  assetStats: {
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: TILE_BG,
  },
  assetStatRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs + 2,
  },
  assetStatRowRule: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  assetStat: {
    flex: 1,
    gap: 1,
  },
  // Second column: hairline on its left, text set in from it
  assetStatRule: {
    paddingLeft: spacing.sm,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: TILE_BORDER,
  },
  assetStatLabel: {
    ...typographyPresets.microLabel,
  },
  assetStatValue: {
    ...typographyPresets.microValue,
  },
  assetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  assetAction: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  assetActionLight: {
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  pressed: {
    opacity: 0.7,
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

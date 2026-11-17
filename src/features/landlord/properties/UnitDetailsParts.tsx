/**
 * Landlord Unit Details pieces (layout from the "Unit Details" design, app
 * theme colours / presets / buttons; shared frame from PropertyDetailsParts):
 *  - UnitBreadcrumb: Properties › LL01 › Unit 101
 *  - UnitTitleBlock: name + status pill, Edit + ⋯, "LL01 • 1st Floor • Apartment"
 *  - UnitGallery: large photo (Virtual Tour, 1 / N) + 3 side thumbs ("+N")
 *  - UnitStatsGrid: Rent / Beds / Baths / Lease in one row
 * The section cards below the stats are in UnitSectionCards.
 */

import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { TintIcon } from './PropertyDetailsParts';
import { DETAIL_ICONS } from './usePropertyDetails';
import { UNIT_ICONS, UnitStat } from './useUnitDetails';

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

export const UnitBreadcrumb: React.FC<{
  propertyName: string;
  unitName: string;
  onProperties: () => void;
  onProperty: () => void;
}> = ({ propertyName, unitName, onProperties, onProperty }) => (
  <View style={styles.crumbs} accessibilityRole="header">
    <Pressable onPress={onProperties} hitSlop={6} accessibilityRole="link">
      <Text style={styles.crumb}>Properties</Text>
    </Pressable>
    <TintIcon source={DETAIL_ICONS.chevron} size={ms(12)} color={colors.textMuted} />
    <Pressable onPress={onProperty} hitSlop={6} accessibilityRole="link">
      <Text style={[styles.crumb, styles.crumbLink]}>{propertyName}</Text>
    </Pressable>
    <TintIcon source={DETAIL_ICONS.chevron} size={ms(12)} color={colors.textMuted} />
    <Text style={[styles.crumb, styles.crumbCurrent]} numberOfLines={1}>
      {unitName}
    </Text>
  </View>
);

export const UnitTitleBlock: React.FC<{
  name: string;
  status: string;
  meta: readonly string[];
  onEdit: () => void;
  onMore: () => void;
}> = ({ name, status, meta, onEdit, onMore }) => (
  <View>
    <View style={styles.titleRow}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.statusPill}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{status}</Text>
      </View>
      <View style={styles.flex} />
      <Button
        title="Edit"
        variant="light"
        size="sm"
        onPress={onEdit}
        leftIcon={<TintIcon source={DETAIL_ICONS.pencil} size={ms(14)} color={colors.navy} />}
        style={styles.lightButton}
      />
      <Pressable
        onPress={onMore}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="More options"
        style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
      >
        <RenterIcon name="ellipsis" size={ms(16)} color={colors.navy} />
      </Pressable>
    </View>
    <View style={styles.metaRow}>
      <TintIcon source={UNIT_ICONS.building} size={ms(14)} color={colors.textSecondary} />
      <Text style={styles.metaText} numberOfLines={1}>
        {meta.join('  •  ')}
      </Text>
    </View>
  </View>
);

/* ------------------------------------------------------------------ */
/* Gallery                                                            */
/* ------------------------------------------------------------------ */

const GALLERY_H = ms(200);

export const UnitGallery: React.FC<{
  photos: readonly ImageSourcePropType[];
  count: number;
  onOpen: () => void;
  onTour: () => void;
}> = ({ photos, count, onOpen, onTour }) => {
  const extra = Math.max(0, count - 2);
  return (
    <View style={styles.gallery}>
      <Pressable
        onPress={onOpen}
        style={styles.galleryMain}
        accessibilityRole="imagebutton"
        accessibilityLabel={`Photo 1 of ${count}`}
      >
        <Image source={photos[0]} style={styles.fill} resizeMode="cover" />
        <View style={styles.galleryBar}>
          <Button
            title="Virtual Tour"
            variant="light"
            size="sm"
            onPress={onTour}
            leftIcon={<View style={styles.play} />}
            style={styles.photoButton}
          />
          <View style={styles.counter}>
            <Text style={styles.counterText}>1 / {count}</Text>
          </View>
        </View>
      </Pressable>
      <View style={styles.thumbs}>
        {photos.slice(1, 4).map((p, i) => {
          const last = i === 2 && extra > 0;
          return (
            <Pressable
              key={`thumb-${i}`}
              onPress={onOpen}
              style={({ pressed }) => [styles.thumb, pressed && styles.pressed]}
              accessibilityRole="imagebutton"
              accessibilityLabel={last ? `${extra} more photos` : `Photo ${i + 2}`}
            >
              <Image source={p} style={styles.fill} resizeMode="cover" />
              {last ? (
                <View style={styles.more}>
                  <Text style={styles.moreText}>+{extra}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Stats + facts                                                      */
/* ------------------------------------------------------------------ */

const StatCell: React.FC<{ stat: UnitStat }> = ({ stat }) => (
  <View style={styles.statCell} accessibilityLabel={`${stat.label}, ${stat.value}`}>
    <View style={styles.statDisc}>
      <TintIcon source={stat.icon} size={ms(14)} color={colors.primary} />
    </View>
    <View style={styles.statText}>
      <Text style={styles.statLabel} numberOfLines={1}>
        {stat.label}
      </Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
        {stat.value}
      </Text>
    </View>
  </View>
);

/**
 * Rent / Beds / Baths / Lease in one row (design): round icon disc, label
 * over value, thin dividers. Cells size to their content so "Fixed-Term"
 * gets the room it needs at phone width.
 */
export const UnitStatsGrid: React.FC<{ stats: readonly UnitStat[] }> = ({ stats }) => (
  <View style={styles.statsBox}>
    {stats.map((s, i) => (
      <React.Fragment key={s.id}>
        {i > 0 ? <View style={styles.vRule} /> : null}
        <StatCell stat={s} />
      </React.Fragment>
    ))}
  </View>
);

/* ------------------------------------------------------------------ */

const ROUND = ms(30);
const STAT_DISC = ms(26);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  // Breadcrumb
  crumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  crumb: {
    ...typographyPresets.bodyMedium,
    color: colors.textSecondary,
  },
  crumbLink: {
    color: colors.primary,
  },
  crumbCurrent: {
    flexShrink: 1,
    color: colors.navy,
  },
  // Title
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typographyPresets.heroTitleCompact,
    flexShrink: 1,
    color: colors.navy,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successLight,
  },
  statusDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.successDark,
  },
  statusText: {
    ...typographyPresets.badge,
    color: colors.successDark,
  },
  lightButton: {
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  moreButton: {
    width: ROUND,
    height: ROUND,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.sm,
  },
  metaText: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textSecondary,
  },
  // Gallery: large photo + column of 3 thumbs
  gallery: {
    flexDirection: 'row',
    gap: spacing.sm,
    height: GALLERY_H,
  },
  galleryMain: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  galleryBar: {
    position: 'absolute',
    left: spacing.sm + 2,
    right: spacing.sm + 2,
    bottom: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoButton: {
    ...shadows.sm,
  },
  // Small navy play triangle (no play icon in the set)
  play: {
    width: 0,
    height: 0,
    borderTopWidth: ms(5),
    borderBottomWidth: ms(5),
    borderLeftWidth: ms(8),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.navy,
  },
  counter: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11,29,58,0.6)',
  },
  counterText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  thumbs: {
    width: '30%',
    gap: spacing.sm,
  },
  thumb: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  more: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,29,58,0.55)',
  },
  moreText: {
    ...typographyPresets.price,
    color: colors.white,
  },
  // Stats: one row of four (design), compact-card presets so all four fit
  statsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  // Content-sized (grow / shrink from its natural width)
  statCell: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
  },
  statText: {
    flexShrink: 1,
  },
  vRule: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: spacing.xs + 1,
    backgroundColor: colors.border,
  },
  // Round light-blue disc, blue line icon (design)
  statDisc: {
    width: STAT_DISC,
    height: STAT_DISC,
    borderRadius: STAT_DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  statLabel: {
    ...typographyPresets.microLabel,
  },
  statValue: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.navy,
  },
});

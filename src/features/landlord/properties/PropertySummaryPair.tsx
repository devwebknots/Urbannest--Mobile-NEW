/**
 * PropertySummaryPair: "Property Overview" | "Property Health" side by side
 * (as the "Property Details" design), built for the half-width column
 * instead of shrinking the full-width cards:
 *  - no text under 11 (label preset); values bodyBold; big health score
 *  - Overview: one-line description, amenity chips (wrap), owner as
 *    initials + name with "100% share" under it, co-owners / manager as
 *    one short line each
 *  - Health: score + Fair pill, 4 rows (short label, value, thin bar)
 *    spread over the card so both boxes end level
 * Two equal columns, same height. The screen falls back to the full-width
 * OverviewBody / HealthBody under SUMMARY_PAIR_MIN_WIDTH.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typographyPresets,
} from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { TintIcon } from './PropertyDetailsParts';
import { DETAIL_ICONS, DetailAmenity, HealthMetric } from './usePropertyDetails';

/** Narrower screens stack the full-width cards instead */
export const SUMMARY_PAIR_MIN_WIDTH = 360;

const Head: React.FC<{ icon: typeof DETAIL_ICONS.overview; title: string }> = ({ icon, title }) => (
  <View style={styles.head}>
    <View style={styles.headIcon}>
      <TintIcon source={icon} size={ms(14)} color={colors.primary} />
    </View>
    <Text style={styles.headTitle} numberOfLines={1} accessibilityRole="header">
      {title}
    </Text>
  </View>
);

const Fact: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.fact}>
    <Text style={styles.factLabel}>{label}</Text>
    <View style={styles.factValue}>{children}</View>
  </View>
);

const InlineFact: React.FC<{ icon: typeof DETAIL_ICONS.manager; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={[styles.fact, styles.inlineFact]} accessibilityLabel={`${label}, ${value}`}>
    <TintIcon source={icon} size={ms(13)} color={colors.textSecondary} />
    <Text style={styles.factLabel} numberOfLines={1}>
      {label}
    </Text>
    <Text style={styles.inlineValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

export const PropertySummaryPair: React.FC<{
  description: string;
  amenities: readonly DetailAmenity[];
  owner: { initials: string; name: string; share: number };
  coOwners: readonly string[];
  manager: string | null;
  score: number;
  scoreLabel: string;
  metrics: readonly HealthMetric[];
}> = ({ description, amenities, owner, coOwners, manager, score, scoreLabel, metrics }) => (
  <View style={styles.row}>
    {/* Overview */}
    <View style={styles.box}>
      <Head icon={DETAIL_ICONS.overview} title="Overview" />
      <Text style={styles.description} numberOfLines={1}>
        {description}
      </Text>
      <View style={styles.chips}>
        {amenities.map(a => (
          <View key={a.id} style={styles.chip}>
            <TintIcon source={a.icon} size={ms(12)} color={colors.successDark} />
            <Text style={styles.chipText} numberOfLines={1}>
              {a.label}
            </Text>
          </View>
        ))}
      </View>
      <Fact label="Owner">
        <View style={styles.initials}>
          <Text style={styles.initialsText}>{owner.initials}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.strong} numberOfLines={1}>
            {owner.name}
          </Text>
          <Text style={styles.share}>{owner.share}% share</Text>
        </View>
      </Fact>
      {/* One line each: icon + label left, value right */}
      <InlineFact
        icon={DETAIL_ICONS.coOwners}
        label="Co-owners"
        value={coOwners.length ? String(coOwners.length) : 'None'}
      />
      <InlineFact icon={DETAIL_ICONS.manager} label="Manager" value={manager ?? 'None'} />
    </View>

    {/* Health */}
    <View style={styles.box}>
      <Head icon={DETAIL_ICONS.health} title="Health" />
      <View style={styles.scoreRow}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.scoreMax}>/100</Text>
        <View style={styles.flex} />
        <View style={styles.pill}>
          <Text style={styles.pillText}>{scoreLabel}</Text>
        </View>
      </View>
      {/* Rows share the rest of the height so both boxes end level */}
      <View style={styles.metrics}>
        {metrics.map(m => (
          <View key={m.id} accessibilityLabel={`${m.label}, ${m.value}`}>
            <View style={styles.metricHead}>
              <Text style={styles.metricLabel} numberOfLines={1}>
                {m.short}
              </Text>
              <Text style={[styles.metricValue, { color: m.color }]} numberOfLines={1}>
                {m.value}
              </Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${Math.round(m.progress * 100)}%`, backgroundColor: m.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const HEAD_ICON = ms(26);
const INITIALS = ms(24);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm + 2,
  },
  box: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  headIcon: {
    width: HEAD_ICON,
    height: HEAD_ICON,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  headTitle: {
    ...typographyPresets.cardTitle,
    flex: 1,
    color: colors.navy,
  },
  // Overview
  description: {
    ...typographyPresets.bodyMedium,
    color: colors.textPrimary,
  },
  // One line (Balcony + CCTV side by side); chips shrink rather than wrap
  chips: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs + 2,
  },
  chip: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 1,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.successLight,
  },
  chipText: {
    ...typographyPresets.label,
    color: colors.textPrimary,
  },
  fact: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.xxs,
  },
  inlineFact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  inlineValue: {
    ...typographyPresets.cardSubtitleBold,
    flex: 1,
    textAlign: 'right',
    color: colors.textSecondary,
  },
  factLabel: {
    ...typographyPresets.label,
  },
  factValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  initials: {
    width: INITIALS,
    height: INITIALS,
    borderRadius: INITIALS / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  initialsText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.navy,
  },
  strong: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  share: {
    ...typographyPresets.label,
  },
  // Health
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  score: {
    ...typographyPresets.priceLarge,
    color: colors.warning,
  },
  scoreMax: {
    ...typographyPresets.label,
    marginBottom: spacing.xs,
  },
  pill: {
    alignSelf: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warningLight,
  },
  pillText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.warningDark,
  },
  metrics: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metricHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typographyPresets.label,
    flexShrink: 1,
    color: colors.textPrimary,
  },
  metricValue: {
    ...typographyPresets.cardSubtitleBold,
  },
  track: {
    height: ms(5),
    borderRadius: ms(2.5),
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  fill: {
    height: '100%',
    borderRadius: ms(2.5),
  },
});

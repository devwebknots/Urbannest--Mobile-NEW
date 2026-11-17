/**
 * KpiTiles: the design's 2 × 2 pastel KPI tiles under the filters.
 *  - Total Units (mint): 24, "Active" pill, "Across 6 properties", faint building
 *  - Occupancy (lavender): 87.5 %, ↑ 2.3 % vs last month, faint ring
 *  - Revenue MTD (peach): $18,420, ↑ 94 % collected, faint bars
 *  - Maintenance (rose): 7, "Overdue" pill, "5 in progress", faint wrench
 *
 * Every tile has the same three rows on one left edge: icon disc + label,
 * value (+ pill), one-line caption. The art (small icon) sits inside the
 * bottom-right corner, clearly visible, never under text.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ProgressRing } from '@/features/application/components/ProgressRing';
import { moderateScale as ms } from '@/utils/responsive';
import type { PmsIconName, PmsTileTone } from '../types';
import { PmsIcon } from './PmsIcon';

const DISC = ms(30);
/** Size of the corner icon / art */
const ART = ms(34);
/** Gap between the art and the tile's right / bottom edge */
const ART_INSET = spacing.md;
/** Fixed value row height so the captions line up across tiles */
const VALUE_ROW_H = ms(36);

interface TileProps {
  tone: PmsTileTone;
  icon: PmsIconName;
  label: string;
  value: string;
  /** Next to the value ("Active", "Overdue") */
  badge?: React.ReactNode;
  footer: React.ReactNode;
  /** Small icon / art in the bottom-right corner */
  art: React.ReactNode;
  onPress: () => void;
}

const Tile: React.FC<TileProps> = ({ tone, icon, label, value, badge, footer, art, onPress }) => {
  const t = colors.pmsTiles[tone];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundImage: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)` },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={styles.art} pointerEvents="none">
        {art}
      </View>

      <View style={styles.head}>
        <View style={[styles.disc, { backgroundColor: t.accent }]}>
          <PmsIcon name={icon} size={ms(15)} color={colors.white} />
        </View>
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
          {label}
        </Text>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {value}
        </Text>
        {badge}
      </View>

      <View style={styles.footer}>{footer}</View>
    </Pressable>
  );
};

const Pill: React.FC<{ text: string; color: string; bg: string }> = ({ text, color, bg }) => (
  <View style={[styles.pill, { backgroundColor: bg }]}>
    <Text style={[typographyPresets.badge, { color }]} numberOfLines={1}>
      {text}
    </Text>
  </View>
);

/** Green ↑ figure, optionally followed by a muted note on the same line */
const Trend: React.FC<{ text: string; note?: string }> = ({ text, note }) => (
  <View style={styles.trend}>
    <PmsIcon name="arrowUp" size={ms(11)} color={colors.successDark} />
    <Text
      style={[styles.caption, styles.shrink]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.85}
    >
      <Text style={styles.trendText}>{text}</Text>
      {note ? ` ${note}` : ''}
    </Text>
  </View>
);

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <Text style={styles.caption} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
    {text}
  </Text>
);

interface Props {
  units: { total: number; status: string; properties: number };
  occupancy: { rate: number; trend: number };
  revenue: { amount: string; collected: number };
  maintenance: { overdue: number; inProgress: number };
  onPress: (title: string) => void;
}

export const KpiTiles: React.FC<Props> = ({ units, occupancy, revenue, maintenance, onPress }) => (
  <View style={styles.grid}>
    <View style={styles.row}>
      <Tile
        tone="units"
        icon="building"
        label="Total Units"
        value={String(units.total)}
        badge={<Pill text={units.status} color={colors.successDark} bg="rgba(34,160,107,0.16)" />}
        footer={<Caption text={`Across ${units.properties} properties`} />}
        art={<PmsIcon name="building" size={ART} color="rgba(34,160,107,0.4)" />}
        onPress={() => onPress('Total Units')}
      />
      <Tile
        tone="occupancy"
        icon="trendingUp"
        label="Occupancy"
        value={`${occupancy.rate}%`}
        footer={<Trend text={`${occupancy.trend}%`} note="vs last month" />}
        art={
          <ProgressRing
            progress={occupancy.rate / 100}
            size={ART}
            stroke={ms(5)}
            showLabel={false}
            color="rgba(79,95,232,0.45)"
            trackColor="rgba(79,95,232,0.12)"
            accessibilityLabel={`${occupancy.rate}% occupied`}
          />
        }
        onPress={() => onPress('Occupancy')}
      />
    </View>
    <View style={styles.row}>
      <Tile
        tone="revenue"
        icon="circleDollar"
        label="Revenue MTD"
        value={revenue.amount}
        footer={<Trend text={`${revenue.collected}%`} note="collected" />}
        art={
          <View style={styles.bars}>
            {[0.45, 0.7, 1].map(h => (
              <View key={h} style={[styles.bar, { height: ART * h }]} />
            ))}
          </View>
        }
        onPress={() => onPress('Revenue MTD')}
      />
      <Tile
        tone="maintenance"
        icon="wrench"
        label="Maintenance"
        value={String(maintenance.overdue)}
        badge={<Pill text="Overdue" color={colors.error} bg={colors.errorLight} />}
        footer={<Caption text={`${maintenance.inProgress} in progress`} />}
        art={<PmsIcon name="wrench" size={ART} color="rgba(219,76,130,0.4)" />}
        onPress={() => onPress('Maintenance')}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    overflow: 'hidden',
    boxShadow: '0px 6px 16px rgba(15,23,42,0.06)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  art: {
    position: 'absolute',
    right: ART_INSET,
    bottom: ART_INSET,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typographyPresets.tag,
    flex: 1,
    color: colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: VALUE_ROW_H,
    marginTop: spacing.md,
  },
  value: {
    ...typographyPresets.heroTitleCompact,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(3),
    borderRadius: borderRadius.pill,
  },
  // Leaves room for the corner art on the right
  footer: {
    marginTop: spacing.xs,
    paddingRight: ART + spacing.xs,
  },
  caption: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  shrink: {
    flexShrink: 1,
  },
  trendText: {
    fontFamily: typographyPresets.cardSubtitleBold.fontFamily,
    color: colors.successDark,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: ms(3),
  },
  bar: {
    width: ms(8),
    borderTopLeftRadius: ms(4),
    borderTopRightRadius: ms(4),
    backgroundColor: 'rgba(245,158,11,0.4)',
  },
});

export default KpiTiles;

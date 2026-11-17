/**
 * KpiTiles: the design's 2 × 2 KPI tiles under the filters, in the page's
 * one palette (colors.pmsTiles = the Property Snapshot colours as soft
 * tints, gradient icon discs, navy values, pills / trends in the tile ink):
 *  - Total Units (blue): 24, "Active" pill, "Across 6 properties", faint building
 *  - Occupancy (teal): 87.5 %, ↑ 2.3 % vs last month, faint ring
 *  - Revenue MTD (amber): $18,420, ↑ 94 % collected, faint bars
 *  - Maintenance (violet): 7, "Overdue" pill, "5 in progress", faint wrench
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
        <View
          style={[
            styles.disc,
            { backgroundImage: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentTo} 100%)` },
          ]}
        >
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

/** Faint corner art in the tile's colour */
const artColor = (tone: PmsTileTone) => `rgba(${colors.pmsTiles[tone].rgb},0.4)`;

/** Pill in the tile's colour ("Active", "Overdue") */
const Pill: React.FC<{ text: string; tone: PmsTileTone }> = ({ text, tone }) => (
  <View style={[styles.pill, { backgroundColor: `rgba(${colors.pmsTiles[tone].rgb},0.14)` }]}>
    <Text style={[typographyPresets.badge, { color: colors.pmsTiles[tone].ink }]} numberOfLines={1}>
      {text}
    </Text>
  </View>
);

/** ↑ figure in the tile's ink colour, optionally followed by a muted note */
const Trend: React.FC<{ text: string; note?: string; tone: PmsTileTone }> = ({ text, note, tone }) => (
  <View style={styles.trend}>
    <PmsIcon name="arrowUp" size={ms(11)} color={colors.pmsTiles[tone].ink} />
    <Text
      style={[styles.caption, styles.shrink]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.85}
    >
      <Text style={[styles.trendText, { color: colors.pmsTiles[tone].ink }]}>{text}</Text>
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
        badge={<Pill tone="units" text={units.status} />}
        footer={<Caption text={`Across ${units.properties} properties`} />}
        art={<PmsIcon name="building" size={ART} color={artColor('units')} />}
        onPress={() => onPress('Total Units')}
      />
      <Tile
        tone="occupancy"
        icon="trendingUp"
        label="Occupancy"
        value={`${occupancy.rate}%`}
        footer={<Trend tone="occupancy" text={`${occupancy.trend}%`} note="vs last month" />}
        art={
          <ProgressRing
            progress={occupancy.rate / 100}
            size={ART}
            stroke={ms(5)}
            showLabel={false}
            color={artColor('occupancy')}
            trackColor={`rgba(${colors.pmsTiles.occupancy.rgb},0.12)`}
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
        footer={<Trend tone="revenue" text={`${revenue.collected}%`} note="collected" />}
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
        badge={<Pill tone="maintenance" text="Overdue" />}
        footer={<Caption text={`${maintenance.inProgress} in progress`} />}
        art={<PmsIcon name="wrench" size={ART} color={artColor('maintenance')} />}
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
    color: colors.navy,
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
  // Colour comes from the tile (ink)
  trendText: {
    fontFamily: typographyPresets.cardSubtitleBold.fontFamily,
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
    backgroundColor: `rgba(${colors.pmsTiles.revenue.rgb},0.4)`,
  },
});

export default KpiTiles;

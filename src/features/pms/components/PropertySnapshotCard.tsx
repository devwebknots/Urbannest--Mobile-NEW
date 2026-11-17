/**
 * PropertySnapshotCard: "Property Snapshot" card from the design: a donut
 * of the portfolio by property type ("24 TOTAL" in the hole) and a legend
 * (dot, name, count, thin bar in the type's colour, length = share of the
 * biggest type).
 *
 * The donut is drawn with plain Views (no SVG in the app): each slice is a
 * half-disc turned inside a right-half clip, the whole clip turned to the
 * slice's start angle; slices over 180° are split in two.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { PropertyTypeShare } from '../types';
import { PmsCard } from './PmsCard';

const DONUT = ms(132);
const HOLE = ms(70);

interface Arc {
  key: string;
  start: number;
  sweep: number;
  color: string;
}

/** Slices of at most 180° each, clockwise from 12 o'clock */
function arcsFor(types: readonly PropertyTypeShare[], total: number): Arc[] {
  const arcs: Arc[] = [];
  let start = 0;
  types.forEach(t => {
    let sweep = total > 0 ? (t.count / total) * 360 : 0;
    let part = 0;
    while (sweep > 0) {
      const s = Math.min(180, sweep);
      arcs.push({ key: `${t.id}-${part}`, start, sweep: s, color: t.color });
      start += s;
      sweep -= s;
      part += 1;
    }
  });
  return arcs;
}

const Slice: React.FC<{ arc: Arc }> = ({ arc }) => {
  const r = DONUT / 2;
  return (
    <View style={[styles.full, { transform: [{ rotate: `${arc.start}deg` }] }]}>
      {/* Right half window */}
      <View style={[styles.clip, { left: r, width: r, height: DONUT }]}>
        {/* Left half-disc turned by the sweep: shows 0 → sweep in the window */}
        <View
          style={[
            styles.full,
            { left: -r, transform: [{ rotate: `${arc.sweep + 0.6}deg` }] },
          ]}
        >
          <View
            style={{
              width: r,
              height: DONUT,
              borderTopLeftRadius: r,
              borderBottomLeftRadius: r,
              backgroundColor: arc.color,
            }}
          />
        </View>
      </View>
    </View>
  );
};

interface Props {
  types: readonly PropertyTypeShare[];
  total: number;
}

export const PropertySnapshotCard: React.FC<Props> = ({ types, total }) => {
  const max = Math.max(1, ...types.map(t => t.count));
  return (
    <PmsCard icon="pieChart" title="Property Snapshot" subtitle="Portfolio by property type">
      <View style={styles.body}>
        <View
          style={styles.donut}
          accessible
          accessibilityRole="image"
          accessibilityLabel={`${total} properties: ${types
            .map(t => `${t.label} ${t.count}`)
            .join(', ')}`}
        >
          {arcsFor(types, total).map(arc => (
            <Slice key={arc.key} arc={arc} />
          ))}
          <View style={styles.hole}>
            <Text style={styles.total}>{total}</Text>
            <Text style={styles.totalLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.legend}>
          {types.map(t => (
            <View key={t.id}>
              <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: t.color }]} />
                <Text style={[typographyPresets.bodyMedium, styles.legendLabel]} numberOfLines={1}>
                  {t.label}
                </Text>
                <Text style={typographyPresets.bodyBold}>{t.count}</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${(t.count / max) * 100}%`, backgroundColor: t.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </PmsCard>
  );
};

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  donut: {
    width: DONUT,
    height: DONUT,
    borderRadius: DONUT / 2,
    overflow: 'hidden',
    backgroundColor: colors.borderLight,
  },
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DONUT,
    height: DONUT,
  },
  clip: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  hole: {
    position: 'absolute',
    top: (DONUT - HOLE) / 2,
    left: (DONUT - HOLE) / 2,
    width: HOLE,
    height: HOLE,
    borderRadius: HOLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: '0px 2px 8px rgba(15,23,42,0.08)',
  },
  total: {
    ...typographyPresets.price,
    fontSize: typographyPresets.sectionHeading.fontSize,
    lineHeight: typographyPresets.sectionHeading.lineHeight,
  },
  totalLabel: {
    ...typographyPresets.tagSmall,
    color: colors.textSecondary,
  },
  legend: {
    flex: 1,
    gap: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  legendLabel: {
    flex: 1,
  },
  track: {
    height: ms(4),
    borderRadius: ms(2),
    marginTop: ms(6),
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  fill: {
    height: ms(4),
    borderRadius: ms(2),
  },
});

export default PropertySnapshotCard;

/**
 * PropertySnapshotCard: "Property Snapshot" card from the design: a donut
 * of the portfolio by property type and a legend with bars.
 *
 * Premium look: four distinct colours from the app (colors.pmsSnapshot:
 * primary blue, teal, gold, violet, each a deep → light gradient on the
 * bars, swatches and slices); slim ring with white gaps
 * between slices, soft blue glow, raised white centre with the total in
 * the serif heading font; legend rows = rounded swatch, name, count + share
 * %, thicker bars with a gradient fill on a pale blue track.
 *
 * The donut is drawn with plain Views (no SVG in the app): each slice is a
 * half-disc turned inside a right-half clip, the whole clip turned to the
 * slice's start angle; slices over 180° are split in two. Gaps are thin
 * white spokes at each slice start.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { PropertyTypeShare } from '../types';
import { PmsCard } from './PmsCard';

const DONUT = ms(128);
const RING = ms(18);
const HOLE = DONUT - RING * 2;
const GAP = ms(3);
const BAR_H = ms(7);

interface Arc {
  key: string;
  start: number;
  sweep: number;
  gradient: readonly [string, string];
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
      arcs.push({ key: `${t.id}-${part}`, start, sweep: s, gradient: t.gradient });
      start += s;
      sweep -= s;
      part += 1;
    }
  });
  return arcs;
}

/** Start angle of each type (where the white gaps go) */
function startsFor(types: readonly PropertyTypeShare[], total: number): number[] {
  let a = 0;
  return types.map(t => {
    const s = a;
    a += total > 0 ? (t.count / total) * 360 : 0;
    return s;
  });
}

const Slice: React.FC<{ arc: Arc }> = ({ arc }) => {
  const r = DONUT / 2;
  return (
    <View style={[styles.full, { transform: [{ rotate: `${arc.start}deg` }] }]}>
      {/* Right half window */}
      <View style={[styles.clip, { left: r, width: r, height: DONUT }]}>
        {/* Left half-disc turned by the sweep: shows 0 → sweep in the window */}
        <View style={[styles.full, { left: -r, transform: [{ rotate: `${arc.sweep + 0.6}deg` }] }]}>
          <View
            style={{
              width: r,
              height: DONUT,
              borderTopLeftRadius: r,
              borderBottomLeftRadius: r,
              backgroundImage: `linear-gradient(180deg, ${arc.gradient[1]} 0%, ${arc.gradient[0]} 100%)`,
            }}
          />
        </View>
      </View>
    </View>
  );
};

/** White spoke from the centre to 12 o'clock, turned to `angle` */
const Gap: React.FC<{ angle: number }> = ({ angle }) => (
  <View style={[styles.full, { transform: [{ rotate: `${angle}deg` }] }]}>
    <View style={styles.spoke} />
  </View>
);

interface Props {
  types: readonly PropertyTypeShare[];
  total: number;
}

export const PropertySnapshotCard: React.FC<Props> = ({ types, total }) => {
  const max = Math.max(1, ...types.map(t => t.count));
  return (
    <PmsCard icon="pieChart" title="Property Snapshot" subtitle="Portfolio by property type">
      <View style={styles.body}>
        <View style={styles.donutGlow}>
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
            {types.length > 1
              ? startsFor(types, total).map((a, i) => <Gap key={types[i].id} angle={a} />)
              : null}
            <View style={styles.hole}>
              <Text style={styles.total}>{total}</Text>
              <Text style={styles.totalLabel}>Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.legend}>
          {types.map(t => {
            const share = total > 0 ? Math.round((t.count / total) * 100) : 0;
            return (
              <View key={t.id}>
                <View style={styles.legendRow}>
                  <View
                    style={[
                      styles.swatch,
                      { backgroundImage: `linear-gradient(135deg, ${t.gradient[1]} 0%, ${t.gradient[0]} 100%)` },
                    ]}
                  />
                  <Text style={[typographyPresets.bodyMedium, styles.legendLabel]} numberOfLines={1}>
                    {t.label}
                  </Text>
                  <Text style={styles.count}>{t.count}</Text>
                  <Text style={styles.share}>{share}%</Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${(t.count / max) * 100}%`,
                        backgroundImage: `linear-gradient(90deg, ${t.gradient[0]} 0%, ${t.gradient[1]} 100%)`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
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
  // Soft blue halo around the ring
  donutGlow: {
    width: DONUT,
    height: DONUT,
    borderRadius: DONUT / 2,
    boxShadow: '0px 8px 22px rgba(37,99,235,0.18)',
  },
  donut: {
    width: DONUT,
    height: DONUT,
    borderRadius: DONUT / 2,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
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
  spoke: {
    position: 'absolute',
    top: 0,
    left: DONUT / 2 - GAP / 2,
    width: GAP,
    height: DONUT / 2,
    backgroundColor: colors.white,
  },
  // Raised white centre
  hole: {
    position: 'absolute',
    top: RING,
    left: RING,
    width: HOLE,
    height: HOLE,
    borderRadius: HOLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: '0px 3px 12px rgba(11,42,91,0.14)',
  },
  total: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
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
  swatch: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(3),
  },
  legendLabel: {
    flex: 1,
  },
  count: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  share: {
    ...typographyPresets.caption,
    minWidth: ms(28),
    textAlign: 'right',
  },
  track: {
    height: BAR_H,
    borderRadius: BAR_H / 2,
    marginTop: ms(6),
    backgroundColor: colors.tileBlue,
    overflow: 'hidden',
  },
  fill: {
    height: BAR_H,
    borderRadius: BAR_H / 2,
  },
});

export default PropertySnapshotCard;

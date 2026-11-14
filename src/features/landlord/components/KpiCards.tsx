/**
 * KPI widgets under the landlord hero:
 *  - RentCollectionCard: rate %, trend pill, progress bar, collected of expected
 *  - OccupancyCard: rate %, "25 of 28 units occupied", ring
 *  - QuickStatGrid: 2 x 2 tiles (Signed leases, Rent collected, Open tickets, Overdue)
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ProgressRing } from '@/features/application/components/ProgressRing';
import { moderateScale as ms } from '@/utils/responsive';
import type { QuickStat } from '../types';
import { formatInr } from '../utils';
import { CardTitle, DashboardCard, ToneTile, TrendPill } from './DashboardParts';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

/** Fill bar that grows to `progress` (0 - 1) */
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const value = useRef(new Animated.Value(IS_TEST ? progress : 0)).current;
  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    Animated.timing(value, {
      toValue: progress,
      duration: 900,
      delay: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, value]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            transformOrigin: 'left',
            transform: [{ scaleX: value }],
          },
        ]}
      />
    </View>
  );
};

export const RentCollectionCard: React.FC<{
  rate: number;
  trend: number;
  trendCaption: string;
  collected: number;
  expected: number;
  onPress: () => void;
}> = ({ rate, trend, trendCaption, collected, expected, onPress }) => (
  <Pressable onPress={onPress} style={styles.half} accessibilityRole="button">
    <DashboardCard style={styles.fill1}>
      <CardTitle icon="database" title="Rent Collection" />
      <View style={styles.valueRow}>
        <Text style={[typographyPresets.priceLarge, styles.value]}>{rate}%</Text>
        <View style={styles.trendCol}>
          <TrendPill value={trend} />
          <Text style={[typographyPresets.caption, styles.trendCaption]} numberOfLines={1}>
            {trendCaption}
          </Text>
        </View>
      </View>
      <ProgressBar progress={collected / expected} />
      <Text style={[typographyPresets.cardSubtitle, styles.foot]} numberOfLines={1}>
        <Text style={styles.footStrong}>{formatInr(collected)}</Text> of {formatInr(expected)}
      </Text>
    </DashboardCard>
  </Pressable>
);

export const OccupancyCard: React.FC<{
  rate: number;
  occupied: number;
  total: number;
  onPress: () => void;
}> = ({ rate, occupied, total, onPress }) => (
  <Pressable onPress={onPress} style={styles.half} accessibilityRole="button">
    <DashboardCard style={styles.fill1}>
      <CardTitle icon="house" title="Occupancy Rate" />
      <View style={styles.occupancyRow}>
        <View style={styles.flex}>
          <Text style={[typographyPresets.priceLarge, styles.value]}>{rate}%</Text>
          <Text style={[typographyPresets.cardSubtitle, styles.occupancyNote]}>
            {occupied} of {total} units occupied
          </Text>
        </View>
        <ProgressRing
          progress={rate / 100}
          size={ms(58)}
          stroke={ms(6)}
          color={colors.primary}
          trackColor={colors.chipBlue}
          accessibilityLabel={`${rate}% occupied`}
        />
      </View>
    </DashboardCard>
  </Pressable>
);

export const QuickStatGrid: React.FC<{
  stats: readonly QuickStat[];
  onPress: (stat: QuickStat) => void;
}> = ({ stats, onPress }) => (
  <View style={styles.grid}>
    {stats.map(stat => (
      <Pressable
        key={stat.id}
        onPress={() => onPress(stat)}
        style={({ pressed }) => [styles.gridItem, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${stat.value} ${stat.label ?? ''} ${stat.caption}`}
      >
        <DashboardCard style={styles.statCard}>
          <ToneTile icon={stat.icon} tone={stat.tone} />
          <View style={styles.flex}>
            <Text style={[typographyPresets.price, styles.value]} numberOfLines={1}>
              {stat.value}
            </Text>
            {stat.label ? (
              <Text style={typographyPresets.bodyBold} numberOfLines={1}>
                {stat.label}
              </Text>
            ) : null}
            <Text style={typographyPresets.caption} numberOfLines={1}>
              {stat.caption}
            </Text>
          </View>
        </DashboardCard>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  half: {
    flex: 1,
  },
  fill1: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  value: {
    color: colors.navy,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  trendCol: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  trendCaption: {
    marginTop: ms(3),
  },
  track: {
    height: ms(6),
    marginTop: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.pill,
    backgroundImage: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.headerGradientEnd} 100%)`,
  },
  foot: {
    marginTop: spacing.sm,
  },
  footStrong: {
    color: colors.textPrimary,
  },
  occupancyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  occupancyNote: {
    marginTop: spacing.xxs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    // Two per row: half the row minus half the gap
    width: '48%',
    flexGrow: 1,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
});

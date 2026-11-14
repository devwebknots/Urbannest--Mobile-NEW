/**
 * OpenOperationsCard: count badge + tappable rows (Maintenance tickets,
 * Lease renewals, Inspection due).
 * VendorPerformanceCard: reliability score, trend pill, caption and a soft
 * area sparkline drawn with thin gradient columns (no SVG in the app).
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { OperationItem, VendorPerformance } from '../types';
import { CardTitle, DashboardCard, TrendPill } from './DashboardParts';
import { LandlordIcon } from './LandlordIcon';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

// colors.headerGradientEnd (#518EF9) as rgb
const BLUE = '81,142,249';

export const OpenOperationsCard: React.FC<{
  items: readonly OperationItem[];
  total: number;
  onPress: (item: OperationItem) => void;
}> = ({ items, total, onPress }) => (
  <DashboardCard>
    <CardTitle
      icon="clipboard"
      title="Open Operations"
      right={
        <View style={styles.countBadge}>
          <Text style={[typographyPresets.badge, styles.countText]}>{total}</Text>
        </View>
      }
    />
    <View style={styles.rows}>
      {items.map((item, i) => (
        <Pressable
          key={item.id}
          onPress={() => onPress(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.label}: ${item.count}`}
          style={({ pressed }) => [styles.row, i > 0 && styles.rowDivider, pressed && styles.pressed]}
        >
          <LandlordIcon name={item.icon} size={ms(16)} color={colors.textSecondary} />
          <Text style={[typographyPresets.bodyMedium, styles.rowLabel]} numberOfLines={1}>
            {item.label}
          </Text>
          <Text style={typographyPresets.bodyBold}>{item.count}</Text>
          <LandlordIcon name="chevronRight" size={ms(14)} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
  </DashboardCard>
);

/** Area sparkline: one thin column per sample, linearly interpolated */
const Sparkline: React.FC<{ points: readonly number[]; width: number; height: number }> = ({
  points,
  width,
  height,
}) => {
  const columns = 36;
  const reveal = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;

  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    Animated.timing(reveal, {
      toValue: 1,
      duration: 900,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [reveal]);

  const heights = useMemo(
    () =>
      Array.from({ length: columns }, (_, i) => {
        const pos = (i / (columns - 1)) * (points.length - 1);
        const lo = Math.floor(pos);
        const hi = Math.min(points.length - 1, lo + 1);
        const v = points[lo] + (points[hi] - points[lo]) * (pos - lo);
        return Math.max(ms(3), v * height);
      }),
    [points, height],
  );

  return (
    <Animated.View
      style={[
        styles.spark,
        { width, height, transformOrigin: 'bottom', transform: [{ scaleY: reveal }] },
      ]}
      pointerEvents="none"
    >
      {heights.map((h, i) => (
        <View key={i} style={[styles.sparkCol, { height: h }]} />
      ))}
    </Animated.View>
  );
};

export const VendorPerformanceCard: React.FC<{
  vendor: VendorPerformance;
  onPress: () => void;
}> = ({ vendor, onPress }) => (
  <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => pressed && styles.pressed}>
    <DashboardCard>
      <CardTitle icon="target" title="Vendor Performance" />
      <View style={styles.vendorBody}>
        <View style={styles.vendorCopy}>
          <View style={styles.scoreRow}>
            <Text style={[typographyPresets.priceLarge, styles.score]}>{vendor.score}%</Text>
            <TrendPill value={vendor.trend} />
          </View>
          <Text style={[typographyPresets.cardSubtitle, styles.vendorCaption]}>
            {vendor.caption}
          </Text>
        </View>
        <Sparkline points={vendor.history} width={ms(120)} height={ms(64)} />
      </View>
    </DashboardCard>
  </Pressable>
);

const styles = StyleSheet.create({
  countBadge: {
    minWidth: ms(22),
    height: ms(22),
    paddingHorizontal: ms(6),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  countText: {
    color: colors.white,
  },
  rows: {
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowLabel: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  vendorBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  vendorCopy: {
    flex: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  score: {
    color: colors.navy,
  },
  vendorCaption: {
    marginTop: spacing.xs,
  },
  spark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  sparkCol: {
    flex: 1,
    borderTopWidth: 2,
    borderTopColor: colors.headerGradientEnd,
    backgroundImage: `linear-gradient(180deg, rgba(${BLUE},0.4) 0%, rgba(${BLUE},0.04) 100%)`,
  },
});

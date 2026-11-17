/**
 * DashboardFilters: the period switch (Today / This week / This month /
 * Custom: pale track, white pill under the selected label) and the scope
 * row under it ("All Cities • All Properties • 24 units" + chevron).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { PmsPeriod } from '../types';
import { PmsIcon } from './PmsIcon';

interface Props {
  periods: readonly { key: PmsPeriod; label: string }[];
  period: PmsPeriod;
  onPeriodChange: (period: PmsPeriod) => void;
  scopeLabel: string;
  onScopePress: () => void;
}

export const DashboardFilters: React.FC<Props> = ({
  periods,
  period,
  onPeriodChange,
  scopeLabel,
  onScopePress,
}) => (
  <View style={styles.wrap}>
    <View style={styles.track} accessibilityRole="tablist">
      {periods.map(p => {
        const selected = p.key === period;
        return (
          <Pressable
            key={p.key}
            onPress={() => onPeriodChange(p.key)}
            style={[styles.segment, selected && styles.segmentOn]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text
              style={[styles.segmentText, selected && styles.segmentTextOn]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </View>

    <Pressable
      onPress={onScopePress}
      style={({ pressed }) => [styles.scope, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Filter: ${scopeLabel}`}
    >
      <PmsIcon name="building" size={ms(16)} color={colors.primary} />
      <Text style={styles.scopeText} numberOfLines={1}>
        {scopeLabel}
      </Text>
      <PmsIcon name="chevronRight" size={ms(16)} color={colors.textMuted} />
    </Pressable>
  </View>
);

const SEGMENT_H = ms(40);

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  track: {
    flexDirection: 'row',
    padding: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.tileBlue,
  },
  segment: {
    flex: 1,
    height: SEGMENT_H - ms(8),
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  segmentOn: {
    backgroundColor: colors.white,
    ...shadows.md,
  },
  segmentText: {
    ...typographyPresets.segmentLabel,
    color: colors.textSecondary,
  },
  // Same weight when selected (segmentLabel rule); only the colour changes
  segmentTextOn: {
    color: colors.textPrimary,
  },
  scope: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: ms(44),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scopeText: {
    ...typographyPresets.bodyMedium,
    flex: 1,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default DashboardFilters;

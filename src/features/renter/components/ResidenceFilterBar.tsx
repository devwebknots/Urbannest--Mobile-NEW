/**
 * ResidenceFilterBar: segmented control (All Rentals / Active / Past)
 * with counts. Active segment is a navy pill.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { FILTERS } from '../constants';
import type { ResidenceFilter } from '../types';

interface Props {
  value: ResidenceFilter;
  counts: Record<ResidenceFilter, number>;
  onChange: (value: ResidenceFilter) => void;
}

export const ResidenceFilterBar: React.FC<Props> = ({ value, counts, onChange }) => (
  <View style={styles.track}>
    {FILTERS.map(f => {
      const active = f.key === value;
      return (
        <Pressable
          key={f.key}
          onPress={() => onChange(f.key)}
          style={[styles.segment, active && styles.segmentActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          accessibilityLabel={`${f.label} homes`}
        >
          <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
            {f.label}
          </Text>
          <View style={[styles.badge, active && styles.badgeActive]}>
            <Text style={[styles.badgeText, active && styles.badgeTextActive]}>
              {counts[f.key]}
            </Text>
          </View>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenHorizontal,
    padding: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(7),
    height: ms(44),
    borderRadius: borderRadius.pill,
  },
  segmentActive: {
    flex: 1.25,
    backgroundColor: colors.navy,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(13.5),
    color: colors.navy,
  },
  labelActive: {
    fontFamily: typography.fontFamily.body.semiBold,
    color: colors.white,
  },
  badge: {
    minWidth: ms(22),
    height: ms(22),
    paddingHorizontal: ms(5),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  badgeText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11),
    color: colors.textSecondary,
  },
  badgeTextActive: {
    color: colors.white,
  },
});

export default ResidenceFilterBar;

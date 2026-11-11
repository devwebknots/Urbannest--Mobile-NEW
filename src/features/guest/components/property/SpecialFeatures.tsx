/**
 * SpecialFeatures: soft blue feature chips in two columns (icon + label).
 * Built row by row so both chips in a row share the taller one's height.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { PropertyFeature } from '../../types';
import { PropertyIcon } from './PropertyIcon';

export const SpecialFeatures: React.FC<{ features: PropertyFeature[] }> = ({ features }) => {
  const rows: PropertyFeature[][] = [];
  for (let i = 0; i < features.length; i += 2) {
    rows.push(features.slice(i, i + 2));
  }
  return (
    <View style={styles.grid}>
      {rows.map(row => (
        <View key={row[0].id} style={styles.row}>
          {row.map(f => (
            <View key={f.id} style={styles.chip}>
              <PropertyIcon name={f.icon} size={ms(17)} color={colors.navy} />
              <Text style={styles.label}>{f.label}</Text>
            </View>
          ))}
          {row.length === 1 ? <View style={styles.spacer} /> : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: ms(48),
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(220, 232, 251, 0.6)',
  },
  spacer: {
    flex: 1,
  },
  label: {
    flex: 1,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    lineHeight: scaleFont(16),
    color: colors.navy,
  },
});

export default SpecialFeatures;

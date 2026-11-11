/**
 * ChecklistProgress: "n of N confirmed" + percent, over a thin brand
 * gradient bar. Shared by the move-in checklist and the inspection page.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  done: number;
  total: number;
}

export const ChecklistProgress: React.FC<Props> = ({ done, total }) => {
  const ratio = total > 0 ? done / total : 0;
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>
          <Text style={styles.count}>{done}</Text> of {total} confirmed
        </Text>
        <Text style={styles.pct}>{Math.round(ratio * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${ratio * 100}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  label: {
    ...typographyPresets.body,
    color: colors.textSecondary,
  },
  count: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  pct: {
    ...typographyPresets.sectionLink,
    color: colors.navy,
  },
  track: {
    height: ms(4),
    marginTop: spacing.sm,
    borderRadius: ms(2),
    backgroundColor: colors.chipBlue,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: ms(2),
  },
});

export default ChecklistProgress;

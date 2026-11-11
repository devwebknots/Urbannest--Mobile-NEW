/**
 * CompletedBadge: the app's "done" marker for checklist items. A small
 * light-blue pill with a secondary-blue tick and "Completed" in navy.
 * Done items keep their normal card (no border / fill change); they only
 * get this badge and, where there is one, a soft secondary-blue tick or
 * number (DONE_BLUE).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon } from '../dashboard/RenterIcon';

/** Secondary blue (#518EF9) at 70%: done ticks, numbers and lines */
export const DONE_BLUE = `${colors.headerGradientEnd}B3`;

interface Props {
  label?: string;
}

export const CompletedBadge: React.FC<Props> = ({ label = 'Completed' }) => (
  <View style={styles.badge}>
    <View style={styles.tick}>
      <RenterIcon name="check" size={ms(8)} color={colors.white} />
    </View>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingLeft: spacing.xxs + 1,
    paddingRight: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  tick: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerGradientEnd,
  },
  text: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
});

export default CompletedBadge;

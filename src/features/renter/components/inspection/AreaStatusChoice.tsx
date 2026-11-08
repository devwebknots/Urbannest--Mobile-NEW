/**
 * AreaStatusChoice: "All good" / "Report issues" switch at the top of an
 * area page. Two equal pill tabs in the same style as the Check-In
 * "Around Your Home" tabs (white with a hairline edge; selected = navy).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WarningTriangleIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { AreaStatus } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  status: AreaStatus;
  onAllGood: () => void;
  onReportIssues: () => void;
}

const Tab: React.FC<{
  label: string;
  selected: boolean;
  icon: React.ReactNode;
  onPress: () => void;
}> = ({ label, selected, icon, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
    style={({ pressed }) => [styles.tab, selected && styles.tabOn, pressed && styles.pressed]}
  >
    {icon}
    <Text style={[styles.tabText, selected && styles.tabTextOn]}>{label}</Text>
  </Pressable>
);

export const AreaStatusChoice: React.FC<Props> = ({ status, onAllGood, onReportIssues }) => {
  const good = status === 'allGood';
  const issues = status === 'issues';
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      <Tab
        label="All good"
        selected={good}
        icon={<RenterIcon name="check" size={ms(13)} color={good ? colors.white : colors.navy} />}
        onPress={onAllGood}
      />
      <Tab
        label="Report issues"
        selected={issues}
        icon={<WarningTriangleIcon size={ms(15)} color={issues ? colors.white : colors.navy} />}
        onPress={onReportIssues}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: ms(44),
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabOn: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  tabText: {
    ...typographyPresets.segmentLabel,
    color: colors.navy,
  },
  tabTextOn: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default AreaStatusChoice;

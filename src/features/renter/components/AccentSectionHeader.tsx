/**
 * AccentSectionHeader: section title with a short blue bar on its left
 * ("Active Tickets", "News & Alerts") and an optional slot on the right
 * (a count, a link or arrow buttons). Shared by the light renter pages.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  title: string;
  /** Shown on the right, e.g. "2 items pending" or arrow buttons */
  right?: React.ReactNode;
}

export const AccentSectionHeader: React.FC<Props> = ({ title, right }) => (
  <View style={styles.row}>
    <View style={styles.bar} />
    <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
      {title}
    </Text>
    {right ? <View style={styles.right}>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  bar: {
    width: 4,
    height: ms(24),
    marginRight: spacing.md,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  title: {
    ...typographyPresets.sectionHeading,
    flex: 1,
    color: colors.navy,
  },
  right: {
    marginLeft: spacing.md,
  },
});

export default AccentSectionHeader;

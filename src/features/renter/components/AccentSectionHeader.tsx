/**
 * AccentSectionHeader: section title with a short blue bar on its left
 * ("Active Tickets", "News & Alerts") and an optional slot on the right
 * (a count, a link or arrow buttons). Shared by the light renter pages.
 * `page` makes it the page heading (bigger title, e.g. "Maintenance
 * Request"); `subtitle` adds a line under the title.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  title: string;
  subtitle?: string;
  /** Page heading size (heroTitleCompact) instead of a section title */
  page?: boolean;
  /** Shown on the right, e.g. "2 items pending" or arrow buttons */
  right?: React.ReactNode;
}

export const AccentSectionHeader: React.FC<Props> = ({ title, subtitle, page = false, right }) => (
  <View style={styles.wrap}>
    <View style={styles.row}>
      <View style={[styles.bar, page && styles.barPage]} />
      <Text
        style={[styles.title, page && styles.titlePage]}
        accessibilityRole="header"
        numberOfLines={1}
      >
        {title}
      </Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const BAR = 4;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    width: BAR,
    height: ms(24),
    marginRight: spacing.md,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  barPage: {
    height: ms(30),
  },
  title: {
    ...typographyPresets.sectionHeading,
    flex: 1,
    color: colors.navy,
  },
  titlePage: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
  },
  // Lines up with the title, past the bar
  subtitle: {
    ...typographyPresets.body,
    marginTop: spacing.xs,
    marginLeft: BAR + spacing.md,
    color: colors.textSecondary,
  },
  right: {
    marginLeft: spacing.md,
  },
});

export default AccentSectionHeader;

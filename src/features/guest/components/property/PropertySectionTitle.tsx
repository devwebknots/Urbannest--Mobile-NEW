/**
 * PropertySectionTitle: icon in a soft blue circle + section title
 * ("Costs & Fees", "Special features", "Similar Deals"), with an optional
 * slot on the right (chevron, "See all" link).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { PropertyIconName } from '../../types';
import { PropertyIcon } from './PropertyIcon';

interface Props {
  icon: PropertyIconName;
  title: string;
  right?: React.ReactNode;
  /** Icon circle fill (default chipBlue; white on a chipBlue strip) */
  badgeColor?: string;
}

export const PropertySectionTitle: React.FC<Props> = ({ icon, title, right, badgeColor }) => (
  <View style={styles.row}>
    <View style={[styles.badge, badgeColor ? { backgroundColor: badgeColor } : null]}>
      <PropertyIcon name={icon} size={ms(18)} color={colors.primary} />
    </View>
    <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
      {title}
    </Text>
    {right ? <View style={styles.right}>{right}</View> : null}
  </View>
);

export const SECTION_BADGE = ms(38);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: SECTION_BADGE,
    height: SECTION_BADGE,
    borderRadius: SECTION_BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  title: {
    ...typographyPresets.sectionHeading,
    flex: 1,
    marginLeft: spacing.md,
    color: colors.navy,
  },
  right: {
    marginLeft: spacing.md,
  },
});

export default PropertySectionTitle;

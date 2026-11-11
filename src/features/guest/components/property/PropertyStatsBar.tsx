/**
 * PropertyStatsBar: bed / bath / area in one soft strip, split by thin
 * dividers (under the price on the property details page).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { BathIcon, BedIcon } from '../GuestIcons';
import { PropertyIcon } from './PropertyIcon';

interface Props {
  beds: string;
  baths: string;
  sqft: string;
}

const ICON = ms(20);

export const PropertyStatsBar: React.FC<Props> = ({ beds, baths, sqft }) => {
  const stats = [
    { key: 'beds', label: beds, icon: <BedIcon size={ICON} color={colors.navy} /> },
    { key: 'baths', label: baths, icon: <BathIcon size={ICON} color={colors.navy} /> },
    {
      key: 'sqft',
      label: sqft,
      icon: <PropertyIcon name="house" size={ICON} color={colors.navy} />,
    },
  ];
  return (
    <View style={styles.bar}>
      {stats.map((s, i) => (
        <React.Fragment key={s.key}>
          {i > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.stat}>
            {s.icon}
            <Text style={styles.label} numberOfLines={1}>
              {s.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  divider: {
    width: 1,
    height: ms(26),
    backgroundColor: colors.border,
  },
  label: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(13.5),
    color: colors.navy,
    fontWeight: typography.fontWeight.medium,
  },
});

export default PropertyStatsBar;

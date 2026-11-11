/**
 * PremiumPill: navy "Premium" pill with a gold crown, on listing photos.
 * `size="lg"` for the details hero, `sm` for small cards.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { PropertyIcon } from './PropertyIcon';

export const PremiumPill: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => {
  const lg = size === 'lg';
  return (
    <View style={[styles.pill, lg && styles.pillLg]}>
      <PropertyIcon name="crown" size={lg ? ms(14) : ms(11)} color={colors.gold} />
      <Text style={[styles.text, lg && styles.textLg]}>Premium</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    height: ms(22),
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11, 42, 91, 0.9)',
  },
  pillLg: {
    gap: ms(6),
    height: ms(30),
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typographyPresets.badge,
    fontSize: scaleFont(10),
    color: colors.white,
  },
  textLg: {
    fontSize: scaleFont(12.5),
  },
});

export default PremiumPill;

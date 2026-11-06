/**
 * LeaseSummaryCard: three key lease facts (rent, renewal, unit) in one
 * white card at the top of the content sheet.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CalendarIcon, KeyIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { DollarIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';

interface Props {
  rent: string;
  renewalLabel: string;
  renewal: string;
  unit: string;
}

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; suffix?: string }> = ({
  icon,
  label,
  value,
  suffix,
}) => (
  <View style={styles.stat}>
    <View style={styles.iconWrap}>{icon}</View>
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
    <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
      {value}
      {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
    </Text>
  </View>
);

export const LeaseSummaryCard: React.FC<Props> = ({ rent, renewalLabel, renewal, unit }) => (
  <View style={styles.card}>
    <Stat
      icon={<DollarIcon size={ms(17)} color={colors.navy} />}
      label="Monthly Rent"
      value={rent}
      suffix="/mo"
    />
    <View style={styles.divider} />
    <Stat
      icon={<CalendarIcon size={ms(16)} color={colors.navy} />}
      label={renewalLabel}
      value={renewal}
    />
    <View style={styles.divider} />
    <Stat icon={<KeyIcon size={ms(16)} color={colors.navy} />} label="Your Unit" value={unit} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xxl + 2,
    backgroundColor: colors.surface,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 8,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: ms(4),
  },
  iconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  label: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  value: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: scaleFont(14.5),
    color: colors.navy,
    marginTop: 2,
  },
  suffix: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11.5),
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    height: ms(52),
    backgroundColor: colors.borderLight,
  },
});

export default LeaseSummaryCard;

/**
 * Small shared pieces of the landlord dashboard:
 *  - DashboardCard: white widget card (radius xl, soft blue hairline, shadows.sm)
 *  - CardTitle: line icon + cardTitle, optional right slot
 *  - TrendPill: green "↑ +4.8%" chip
 *  - ToneTile: rounded square icon tile in a status colour
 */

import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { TONE_COLORS } from '../constants';
import type { LandlordIconName, LandlordTone } from '../types';
import { formatTrend } from '../utils';
import { LandlordIcon } from './LandlordIcon';

export const CARD_PADDING = spacing.lg;

export const DashboardCard: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

export const CardTitle: React.FC<{
  icon: LandlordIconName;
  title: string;
  right?: React.ReactNode;
  /** Title colour, e.g. white on a dark panel */
  color?: string;
  iconColor?: string;
}> = ({ icon, title, right, color = colors.textPrimary, iconColor = colors.primary }) => (
  <View style={styles.titleRow}>
    <LandlordIcon name={icon} size={ms(20)} color={iconColor} />
    <Text style={[typographyPresets.cardTitle, styles.title, { color }]} numberOfLines={2}>
      {title}
    </Text>
    {right}
  </View>
);

export const TrendPill: React.FC<{ value: number }> = ({ value }) => (
  <View style={[commonPill, styles.trend]}>
    <LandlordIcon name="arrowUp" size={ms(11)} color={colors.successDark} />
    <Text style={[typographyPresets.badge, styles.trendText]}>{formatTrend(value)}</Text>
  </View>
);

export const ToneTile: React.FC<{
  icon: LandlordIconName;
  tone: LandlordTone;
  size?: number;
}> = ({ icon, tone, size = ms(40) }) => (
  <View
    style={[
      styles.tile,
      { width: size, height: size, backgroundColor: TONE_COLORS[tone].bg },
    ]}
  >
    <LandlordIcon name={icon} size={size * 0.5} color={TONE_COLORS[tone].fg} />
  </View>
);

const commonPill: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: ms(3),
  paddingHorizontal: spacing.sm,
  paddingVertical: ms(3),
  borderRadius: borderRadius.pill,
};

const styles = StyleSheet.create({
  card: {
    padding: CARD_PADDING,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  trend: {
    backgroundColor: colors.successLight,
  },
  trendText: {
    color: colors.successDark,
  },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
});

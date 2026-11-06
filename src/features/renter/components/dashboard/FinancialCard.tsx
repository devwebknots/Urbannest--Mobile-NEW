/**
 * FinancialCard: navy "Rental Amount Due" panel (amount, due chip,
 * Pay Now) joined to a white "Pending HOA Fee" row.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { CalendarIcon } from '@/components/icons';
import { borderRadius, colors, gradients, spacing, typography } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { FinancialSummary } from '../../types';
import { RenterIcon } from './RenterIcon';

interface Props {
  summary: FinancialSummary;
  onPayNow: () => void;
  onViewHoa: () => void;
}

/** Faint tower outlines on the right of the navy panel. */
const Skyline: React.FC = () => (
  <View pointerEvents="none" style={styles.skyline}>
    <View style={styles.glow} />
    <View style={[styles.tower, styles.towerBack]}>
      {[0, 1, 2].map(r => (
        <View key={r} style={styles.windowRow}>
          <View style={styles.window} />
          <View style={styles.window} />
        </View>
      ))}
    </View>
    <View style={[styles.tower, styles.towerFront]}>
      {[0, 1, 2, 3].map(r => (
        <View key={r} style={styles.windowRow}>
          <View style={styles.window} />
          <View style={styles.window} />
          <View style={styles.window} />
        </View>
      ))}
    </View>
  </View>
);

export const FinancialCard: React.FC<Props> = ({ summary, onPayNow, onViewHoa }) => (
  <View style={styles.card}>
    <LinearGradient
      colors={gradients.button}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.panel}
    >
      <Skyline />
      <View style={styles.dueRow}>
        <View style={styles.dueText}>
          <Text style={styles.dueLabel}>Rental Amount Due</Text>
          <Text style={styles.amount}>{summary.rentDue}</Text>
        </View>
        <View style={styles.dueChip}>
          <CalendarIcon size={ms(13)} color={colors.white} />
          <Text style={styles.dueChipText}>{summary.dueIn}</Text>
        </View>
      </View>
      <Pressable
        onPress={onPayNow}
        accessibilityRole="button"
        accessibilityLabel="Pay now"
        style={({ pressed }) => [styles.pay, pressed && styles.pressed]}
      >
        <Text style={styles.payText}>Pay Now</Text>
        <ArrowRightIcon size={ms(15)} color={colors.navy} />
      </Pressable>
    </LinearGradient>

    <View style={styles.hoa}>
      <View style={styles.hoaIcon}>
        <RenterIcon name="bank" size={ms(22)} color={colors.navy} />
      </View>
      <View style={styles.hoaText}>
        <Text style={styles.hoaLabel}>Pending HOA Fee</Text>
        <Text style={styles.hoaAmount}>{summary.hoaFee}</Text>
        <View style={styles.scheduled}>
          <CalendarIcon size={ms(12)} color={colors.navy} />
          <Text style={styles.scheduledText}>{summary.hoaScheduled}</Text>
        </View>
      </View>
      <Pressable
        onPress={onViewHoa}
        accessibilityRole="button"
        accessibilityLabel="View HOA fee details"
        style={({ pressed }) => [styles.view, pressed && styles.pressed]}
      >
        <Text style={styles.viewText}>View Details</Text>
        <ArrowRightIcon size={ms(13)} color={colors.navy} />
      </Pressable>
    </View>
  </View>
);

const RADIUS = borderRadius.xxl + 2;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: RADIUS,
    backgroundColor: colors.surface,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  panel: {
    padding: spacing.xl,
    borderRadius: RADIUS,
  },
  skyline: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ms(150),
    height: '100%',
  },
  glow: {
    position: 'absolute',
    right: -ms(60),
    top: -ms(70),
    width: ms(200),
    height: ms(200),
    borderRadius: ms(100),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tower: {
    position: 'absolute',
    bottom: 0,
    paddingTop: ms(10),
    paddingHorizontal: ms(8),
    gap: ms(8),
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  towerBack: {
    right: ms(78),
    width: ms(46),
    height: ms(80),
  },
  towerFront: {
    right: ms(16),
    width: ms(60),
    height: ms(112),
  },
  windowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  window: {
    width: ms(9),
    height: ms(9),
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dueText: {
    flexShrink: 1,
  },
  dueLabel: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(13),
    color: 'rgba(255,255,255,0.82)',
  },
  amount: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: scaleFont(30),
    lineHeight: scaleFont(38),
    color: colors.white,
    marginTop: 2,
  },
  dueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    height: ms(30),
    paddingHorizontal: spacing.md,
    marginTop: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dueChipText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(12),
    color: colors.white,
  },
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    minWidth: '58%',
    height: ms(46),
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  payText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(14.5),
    color: colors.navy,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  hoa: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  hoaIcon: {
    width: ms(48),
    height: ms(48),
    borderRadius: borderRadius.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueTile,
  },
  hoaText: {
    flex: 1,
  },
  hoaLabel: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    color: colors.textSecondary,
  },
  hoaAmount: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: scaleFont(19),
    lineHeight: scaleFont(25),
    color: colors.navy,
  },
  scheduled: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ms(5),
    height: ms(24),
    paddingHorizontal: spacing.sm + 2,
    marginTop: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.pageTint,
  },
  scheduledText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11),
    color: colors.navy,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    height: ms(38),
    paddingHorizontal: spacing.md + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.blueTile,
  },
  viewText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(12.5),
    color: colors.navy,
  },
});

export default FinancialCard;

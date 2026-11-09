/**
 * RentDueCard: navy gradient card for the next rent payment. Eyebrow,
 * amount, due date and a light "Pay Now" button on the left; the
 * CountdownRing (days left in the billing cycle) on the right, on two
 * soft light circles for depth.
 *
 * `compact`: half-width card beside Quick Actions (Manage page). Label +
 * amount with a small ring top right, due date under them, white
 * "Pay Now" pill at the bottom; fills the height it is given.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { LinearGradient } from '@/components/LinearGradient';
import {
  borderRadius,
  colors,
  gradients,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { CountdownRing } from './CountdownRing';

interface Props {
  rentAmount: string;
  dueDate: string;
  daysLeft: number;
  cycleDays: number;
  onPayNow: () => void;
  compact?: boolean;
}

export const RentDueCard: React.FC<Props> = ({
  rentAmount,
  dueDate,
  daysLeft,
  cycleDays,
  onPayNow,
  compact,
}) =>
  compact ? (
    <View style={[styles.shadow, styles.compactShadow]}>
      <LinearGradient
        colors={gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.compactCard]}
      >
        <View pointerEvents="none" style={styles.compactGlow} />

        <View style={styles.compactTop}>
          <View style={styles.text}>
            <Text style={[styles.label, styles.compactLabel]}>Rent Due</Text>
            <Text
              style={[styles.amount, styles.compactAmount]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {rentAmount}
            </Text>
          </View>
          <CountdownRing daysLeft={daysLeft} cycleDays={cycleDays} size={ms(56)} />
        </View>
        <Text style={[styles.date, styles.compactDate]} numberOfLines={2}>
          Payable by {dueDate}
        </Text>

        <Pressable
          onPress={onPayNow}
          accessibilityRole="button"
          accessibilityLabel={`Pay rent of ${rentAmount}`}
          style={({ pressed }) => [styles.payPill, pressed && styles.pressed]}
        >
          <Text style={styles.payText}>Pay Now</Text>
          <ArrowRightIcon size={ms(12)} color={colors.navy} />
        </Pressable>
      </LinearGradient>
    </View>
  ) : (
    <View style={styles.shadow}>
      <LinearGradient
        colors={gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <View pointerEvents="none" style={styles.glowLarge} />
        <View pointerEvents="none" style={styles.glowSmall} />

        <View style={styles.row}>
          <View style={styles.text}>
            <Text style={styles.label}>Rent Due</Text>
            <Text style={styles.amount} numberOfLines={1}>
              {rentAmount}
            </Text>
            <Text style={styles.date}>Payable by {dueDate}</Text>
            <Button
              title="Pay Now"
              variant="light"
              size="md"
              onPress={onPayNow}
              accessibilityLabel={`Pay rent of ${rentAmount}`}
              rightIcon={<ArrowRightIcon size={ms(15)} color={colors.navy} />}
              style={styles.pay}
            />
          </View>
          <CountdownRing daysLeft={daysLeft} cycleDays={cycleDays} />
        </View>
      </LinearGradient>
    </View>
  );

const RADIUS = borderRadius.xxl + 2;

const styles = StyleSheet.create({
  shadow: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: RADIUS,
    backgroundColor: colors.navy,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 6,
  },
  card: {
    padding: spacing.xl,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  glowLarge: {
    position: 'absolute',
    width: ms(220),
    height: ms(220),
    right: -ms(70),
    top: -ms(60),
    borderRadius: 9999,
    backgroundColor: 'rgba(81,142,249,0.18)',
  },
  glowSmall: {
    position: 'absolute',
    width: ms(120),
    height: ms(120),
    right: ms(30),
    bottom: -ms(70),
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  text: {
    flex: 1,
    alignItems: 'flex-start',
  },
  label: {
    ...typographyPresets.eyebrow,
    color: 'rgba(199,210,254,0.85)',
  },
  amount: {
    ...typographyPresets.heroTitleCompact,
    marginTop: spacing.sm,
  },
  date: {
    ...typographyPresets.heroSubtitle,
    marginTop: spacing.xs,
  },
  pay: {
    marginTop: spacing.lg,
  },
  // ---- compact (half width) ----
  compactShadow: {
    flex: 1,
    marginHorizontal: 0,
    borderRadius: borderRadius.xl,
  },
  compactCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
  },
  // Soft violet light sweeping in from the bottom right
  compactGlow: {
    position: 'absolute',
    width: ms(150),
    height: ms(150),
    right: -ms(60),
    bottom: -ms(70),
    borderRadius: 9999,
    backgroundColor: 'rgba(167,139,250,0.28)',
  },
  compactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  compactLabel: {
    fontSize: ms(9),
    letterSpacing: 1.2,
  },
  compactAmount: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: ms(19),
    lineHeight: ms(24),
    marginTop: spacing.xs,
  },
  compactDate: {
    fontSize: ms(10.5),
    lineHeight: ms(14),
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  // White pill, navy text + arrow, pinned to the bottom
  payPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ms(6),
    marginTop: 'auto',
    paddingVertical: ms(7),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  payText: {
    ...typographyPresets.badge,
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.navy,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});

export default RentDueCard;

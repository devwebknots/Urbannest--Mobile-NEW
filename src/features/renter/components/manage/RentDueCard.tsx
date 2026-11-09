/**
 * RentDueCard: navy gradient card for the next rent payment. Eyebrow,
 * amount, due date and a light "Pay Now" button on the left; the
 * CountdownRing (days left in the billing cycle) on the right, on two
 * soft light circles for depth.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { LinearGradient } from '@/components/LinearGradient';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { CountdownRing } from './CountdownRing';

interface Props {
  rentAmount: string;
  dueDate: string;
  daysLeft: number;
  cycleDays: number;
  onPayNow: () => void;
}

export const RentDueCard: React.FC<Props> = ({ rentAmount, dueDate, daysLeft, cycleDays, onPayNow }) => (
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
});

export default RentDueCard;

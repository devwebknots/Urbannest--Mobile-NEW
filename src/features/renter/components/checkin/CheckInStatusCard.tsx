/**
 * CheckInStatusCard: navy "Current Status" panel for a move-in-ready home.
 * Verified chip, Playfair "Move-In Ready", short note, lease facts
 * (lease ID, move-in date, key window) and the white "Access Digital Key"
 * button (white on dark panels, per the button rules).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { CheckInSummary } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  summary: CheckInSummary;
  onAccessKey: () => void;
}

const Fact: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.fact}>
    <Text style={styles.factLabel}>{label}</Text>
    <Text style={styles.factValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

export const CheckInStatusCard: React.FC<Props> = ({ summary, onAccessKey }) => (
  <View style={styles.card}>
    <LinearGradient
      colors={gradients.button}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.panel}
    >
      {/* Soft light rings, top right */}
      <View pointerEvents="none" style={styles.ringOuter} />
      <View pointerEvents="none" style={styles.ringInner} />

      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>Current Status</Text>
        <View style={styles.verified}>
          <View style={styles.verifiedDot}>
            <RenterIcon name="check" size={ms(10)} color={colors.navy} />
          </View>
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <Text style={styles.title}>Move-In Ready</Text>
      <Text style={styles.body}>{summary.description}</Text>

      <View style={styles.facts}>
        <Fact label="Lease ID" value={summary.leaseId} />
        <View style={styles.factDivider} />
        <Fact label="Move-In" value={summary.moveInDate} />
      </View>

      <Pressable
        onPress={onAccessKey}
        accessibilityRole="button"
        accessibilityLabel="Access digital key"
        style={({ pressed }) => [styles.keyButton, pressed && styles.pressed]}
      >
        <View style={styles.keyIcon}>
          <RenterIcon name="key" size={ms(17)} color={colors.white} />
        </View>
        <View style={styles.keyText}>
          <Text style={styles.keyTitle}>Access Digital Key</Text>
          <Text style={styles.keyHint}>{summary.keyWindow}</Text>
        </View>
      </Pressable>
    </LinearGradient>
  </View>
);

const RADIUS = borderRadius.xxl + 2;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: RADIUS,
    backgroundColor: colors.navy,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 6,
  },
  panel: {
    padding: spacing.xl,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  ringOuter: {
    position: 'absolute',
    top: -ms(90),
    right: -ms(70),
    width: ms(220),
    height: ms(220),
    borderRadius: ms(110),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ringInner: {
    position: 'absolute',
    top: -ms(40),
    right: -ms(20),
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: colors.heroAccent,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    height: ms(28),
    paddingLeft: ms(5),
    paddingRight: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  verifiedDot: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  verifiedText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  title: {
    ...typographyPresets.heroTitle,
    marginTop: spacing.md,
  },
  body: {
    ...typographyPresets.body,
    color: colors.textInverseMuted,
    marginTop: spacing.sm,
  },
  facts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  fact: {
    flex: 1,
  },
  factDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  factLabel: {
    ...typographyPresets.eyebrow,
    color: 'rgba(255,255,255,0.6)',
  },
  factValue: {
    ...typographyPresets.bodyBold,
    color: colors.white,
    marginTop: ms(4),
  },
  keyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: ms(6),
    paddingRight: spacing.xl,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  keyIcon: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
  keyText: {
    flex: 1,
  },
  keyTitle: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  keyHint: {
    ...typographyPresets.cardSubtitle,
    marginTop: 1,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
});

export default CheckInStatusCard;

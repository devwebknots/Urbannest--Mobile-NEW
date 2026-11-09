/**
 * QuickAlertCard: frosted white card beside the Rent Due card on the
 * Manage page (the "Quick Actions" section heading sits above both).
 *  - inner white panel with one row per alert, thin dividers between:
 *    pastel icon chip, label, bold value ("Pending HOA Fee : $200.00",
 *    "Pest Control on Nov 14", ...)
 * Alerts with an amount (fees) come first.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { LayersIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { QuickAlert } from '../../types';
import { ACCENTS } from '../dashboard/ConciergeGrid';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  alerts: readonly QuickAlert[];
  onPress: (alert: QuickAlert) => void;
}

const CHIP = ms(24);
const CHIP_ICON = ms(13);

/** "NOV" + "14" -> "Nov 14" */
const shortDate = (a: QuickAlert) => `${a.month.charAt(0)}${a.month.slice(1).toLowerCase()} ${a.day}`;

const rowText = (a: QuickAlert) =>
  a.amount
    ? { label: `Pending ${a.title} : `, value: a.amount }
    : { label: `${a.title} on `, value: shortDate(a) };

/** Icon chip: fee -> currency sign (violet), maintenance -> wrench
 *  (green), anything else -> layers (blue) */
const Chip: React.FC<{ alert: QuickAlert }> = ({ alert }) => {
  if (alert.amount) {
    const a = ACCENTS.violet;
    return (
      <View style={[styles.chip, { backgroundColor: a.bg }]}>
        <Text style={[styles.currency, { color: a.fg }]}>$</Text>
      </View>
    );
  }
  if (/maint/i.test(alert.title)) {
    const a = ACCENTS.green;
    return (
      <View style={[styles.chip, { backgroundColor: a.bg }]}>
        <RenterIcon name="lineWrench" size={CHIP_ICON} color={a.fg} />
      </View>
    );
  }
  const a = ACCENTS.navy;
  return (
    <View style={[styles.chip, { backgroundColor: a.bg }]}>
      <LayersIcon size={CHIP_ICON} color={colors.navy} />
    </View>
  );
};

export const QuickAlertCard: React.FC<Props> = ({ alerts, onPress }) => {
  const rows = [...alerts.filter(a => a.amount), ...alerts.filter(a => !a.amount)];
  return (
    <View style={styles.card}>
      <View style={[StyleSheet.absoluteFill, styles.sheen]} />

      <View style={styles.panel}>
        {rows.map((alert, i) => {
          const { label, value } = rowText(alert);
          return (
            <Pressable
              key={alert.id}
              onPress={() => onPress(alert)}
              accessibilityRole="button"
              accessibilityLabel={`${label}${value}`}
              style={({ pressed }) => [
                styles.row,
                i > 0 && styles.rowDivider,
                pressed && styles.pressedRow,
              ]}
            >
              <Chip alert={alert} />
              <Text style={styles.rowText} numberOfLines={2}>
                {label}
                <Text style={styles.rowValue}>{value}</Text>
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Frosted white card with a soft rim and shadow
  card: {
    flex: 1,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    boxShadow: '0px 8px 20px rgba(11, 29, 58, 0.07)',
  },
  sheen: {
    backgroundImage:
      'linear-gradient(135deg, rgba(237,233,254,0.55) 0%, rgba(255,255,255,0) 60%)',
  },
  // Inner white panel holding the rows
  panel: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(148,163,184,0.45)',
  },
  pressedRow: {
    opacity: 0.6,
  },
  chip: {
    width: CHIP,
    height: CHIP,
    borderRadius: ms(7),
    alignItems: 'center',
    justifyContent: 'center',
  },
  currency: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: ms(13),
    lineHeight: ms(16),
  },
  rowText: {
    flex: 1,
    fontFamily: typography.fontFamily.body.medium,
    fontSize: ms(11.5),
    lineHeight: ms(15),
    color: colors.navy,
  },
  rowValue: {
    fontFamily: typography.fontFamily.body.bold,
    color: colors.navy,
  },
});

export default QuickAlertCard;

/**
 * RecentTransactionsCard: "Recent Transactions" card from the design: a
 * small table (PROPERTY / TYPE / AMOUNT) with a chevron per row. Income in
 * green, costs in red, overdue rent (type and amount) in amber.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { Transaction, TransactionTone } from '../types';
import { PmsIcon } from './PmsIcon';
import { ChevronButton, PmsCard } from './PmsCard';

const AMOUNT_COLOR: Record<TransactionTone, string> = {
  in: colors.success,
  out: colors.error,
  overdue: colors.warning,
};

interface Props {
  transactions: readonly Transaction[];
  onOpen: (transaction: Transaction) => void;
  onViewAll: () => void;
}

export const RecentTransactionsCard: React.FC<Props> = ({ transactions, onOpen, onViewAll }) => (
  <PmsCard
    icon="receipt"
    tint={colors.success}
    title="Recent Transactions"
    subtitle="Money-related activity"
    right={<ChevronButton onPress={onViewAll} label="All transactions" />}
  >
    <View style={[styles.row, styles.head]}>
      <Text style={[typographyPresets.tableHeader, styles.property]}>Property</Text>
      <Text style={[typographyPresets.tableHeader, styles.type]}>Type</Text>
      <Text style={[typographyPresets.tableHeader, styles.amount]}>Amount</Text>
      <View style={styles.chevron} />
    </View>
    {transactions.map(t => (
      <Pressable
        key={t.id}
        onPress={() => onOpen(t)}
        style={({ pressed }) => [styles.row, styles.divider, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${t.property}, ${t.type}, ${t.amount}`}
      >
        <Text style={[typographyPresets.cardSubtitle, styles.cell, styles.property]} numberOfLines={1}>
          {t.property}
        </Text>
        <Text
          style={[
            typographyPresets.cardSubtitle,
            styles.type,
            t.tone === 'overdue' && { color: colors.warning },
          ]}
          numberOfLines={1}
        >
          {t.type}
        </Text>
        <Text
          style={[typographyPresets.cardSubtitleBold, styles.amount, { color: AMOUNT_COLOR[t.tone] }]}
          numberOfLines={1}
        >
          {t.amount}
        </Text>
        <View style={styles.chevron}>
          <PmsIcon name="chevronRight" size={ms(13)} color={colors.textMuted} />
        </View>
      </Pressable>
    ))}
  </PmsCard>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: ms(9),
  },
  head: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  cell: {
    color: colors.textPrimary,
  },
  property: {
    flex: 1.1,
  },
  type: {
    flex: 1.3,
  },
  amount: {
    flex: 0.9,
    textAlign: 'right',
  },
  chevron: {
    width: ms(14),
    alignItems: 'flex-end',
  },
});

export default RecentTransactionsCard;

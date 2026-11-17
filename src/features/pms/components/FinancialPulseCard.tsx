/**
 * FinancialPulseCard: "Financial Pulse" in the layout of the design
 * ("Screenshot 2026-11-17 182715"), on the guest search card's frosted
 * light-blue background (PmsCard `frosted` → CardBackground). Text and
 * accents use only the app theme (navy, primary / secondary blue, greys):
 *  - header: wallet disc, title / subtitle, chipBlue "94% collected" pill;
 *  - Net Income: big navy figure + label on the left, secondary-blue trend chart
 *    on the right;
 *  - one row of three stats with a coloured bar on the left of each:
 *    Revenue MTD (primary blue), Expenses MTD (grey), Pending Rent
 *    (secondary blue);
 *  - Collection Rate + navy → blue bar (gradients.header);
 *  - `soft` View P&L (file icon) and `brand` Export (download icon).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { FinancialFigure, MoneyTone } from '../types';
import { PmsIcon } from './PmsIcon';
import { GradientBar, PmsCard } from './PmsCard';
import { TrendChart } from './TrendChart';

/** Side bar / value colour of the three small stats (app theme blues only) */
const STAT_TONE: Record<Exclude<MoneyTone, 'net'>, { bar: string; value: string }> = {
  income: { bar: colors.primary, value: colors.navy },
  expense: { bar: colors.textMuted, value: colors.navy },
  pending: { bar: colors.headerGradientEnd, value: colors.navy },
};

interface Props {
  figures: readonly FinancialFigure[];
  collectionRate: number;
  /** Net income, oldest → latest month */
  trend: readonly number[];
  onFigurePress: (figure: FinancialFigure) => void;
  onViewPnl: () => void;
  onExport: () => void;
}

export const FinancialPulseCard: React.FC<Props> = ({
  figures,
  collectionRate,
  trend,
  onFigurePress,
  onViewPnl,
  onExport,
}) => {
  const net = figures.find(f => f.tone === 'net');
  const stats = figures.filter(f => f.tone !== 'net');

  return (
    <PmsCard
      frosted
      icon="wallet"
      title="Financial Pulse"
      subtitle="Month to date overview"
      right={
        <View style={styles.collected}>
          <PmsIcon name="check" size={ms(11)} color={colors.navy} />
          <Text style={[typographyPresets.badge, styles.collectedText]}>
            {collectionRate}% Collected
          </Text>
        </View>
      }
    >
      {/* Net income + trend */}
      {net ? (
        <View style={styles.hero}>
          <Pressable
            onPress={() => onFigurePress(net)}
            style={({ pressed }) => [styles.net, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`${net.label}: ${net.amount}`}
          >
            <Text style={styles.netAmount} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {net.amount}
            </Text>
            <Text style={typographyPresets.cardSubtitle} numberOfLines={1}>
              {net.label}
            </Text>
          </Pressable>
          <View style={styles.chart}>
            <TrendChart values={trend} />
          </View>
        </View>
      ) : null}

      {/* Revenue / Expenses / Pending */}
      <View style={styles.stats}>
        {stats.map(f => {
          const tone = STAT_TONE[f.tone as Exclude<MoneyTone, 'net'>];
          return (
            <Pressable
              key={f.id}
              onPress={() => onFigurePress(f)}
              style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${f.label}: ${f.amount}`}
            >
              <View style={[styles.statBar, { backgroundColor: tone.bar }]} />
              <View style={styles.statText}>
                <Text
                  style={[typographyPresets.bodyBold, { color: tone.value }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {f.amount}
                </Text>
                <Text style={typographyPresets.caption} numberOfLines={1}>
                  {f.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Collection rate */}
      <View style={styles.rateRow}>
        <Text style={typographyPresets.bodyBold}>Collection Rate</Text>
        <Text style={[typographyPresets.bodyBold, styles.rate]}>{collectionRate}%</Text>
      </View>
      <GradientBar
        progress={collectionRate / 100}
        from={gradients.header[0]}
        to={gradients.header[1]}
        track="rgba(81,142,249,0.14)"
      />

      <View style={styles.actions}>
        <Button
          title="View P&L"
          variant="soft"
          size="md"
          onPress={onViewPnl}
          leftIcon={<PmsIcon name="fileText" size={ms(16)} color={colors.navy} />}
          style={styles.action}
        />
        <Button
          title="Export"
          variant="brand"
          size="md"
          onPress={onExport}
          leftIcon={<PmsIcon name="download" size={ms(16)} color={colors.white} />}
          style={styles.action}
        />
      </View>
    </PmsCard>
  );
};

const styles = StyleSheet.create({
  collected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: ms(9),
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  collectedText: {
    color: colors.navy,
  },
  pressed: {
    opacity: 0.75,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  net: {
    flexShrink: 0,
  },
  netAmount: {
    ...typographyPresets.priceLarge,
    color: colors.navy,
  },
  chart: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(81,142,249,0.25)',
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.xs,
  },
  statBar: {
    width: 3,
    borderRadius: 2,
  },
  statText: {
    flex: 1,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  rate: {
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  action: {
    flex: 1,
  },
});

export default FinancialPulseCard;

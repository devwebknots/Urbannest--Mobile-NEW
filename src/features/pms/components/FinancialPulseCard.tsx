/**
 * FinancialPulseCard: the design's dark "Financial Pulse" panel: header
 * with the green "94% COLLECTED" pill, 2 × 2 glass figure tiles (Revenue,
 * Expenses in red, Net Income in green, Pending Rent on an amber tile),
 * the collection-rate bar (teal → green) and the View P&L / Export buttons.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { FinancialFigure, MoneyTone } from '../types';
import { PmsIcon } from './PmsIcon';
import { GradientBar, PMS_HEADER_DISC } from './PmsCard';

const TONE: Record<MoneyTone, { value: string; icon: string; tile?: string; rim?: string }> = {
  income: { value: colors.white, icon: '#4ADE80' },
  expense: { value: '#FCA5A5', icon: '#F87171' },
  net: { value: '#4ADE80', icon: '#4ADE80' },
  pending: {
    value: '#FCD34D',
    icon: '#FBBF24',
    tile: 'rgba(245,158,11,0.16)',
    rim: 'rgba(251,191,36,0.28)',
  },
};

const FIGURE_BUTTON = ms(28);

interface Props {
  figures: readonly FinancialFigure[];
  collectionRate: number;
  onFigurePress: (figure: FinancialFigure) => void;
  onViewPnl: () => void;
  onExport: () => void;
}

export const FinancialPulseCard: React.FC<Props> = ({
  figures,
  collectionRate,
  onFigurePress,
  onViewPnl,
  onExport,
}) => (
  <View style={styles.card}>
    <View style={styles.glow} pointerEvents="none" />

    <View style={styles.header}>
      <View style={styles.disc}>
        <PmsIcon name="wallet" size={ms(19)} color={colors.white} />
      </View>
      <View style={styles.headerText}>
        <Text style={[typographyPresets.cardTitle, styles.white]} accessibilityRole="header">
          Financial Pulse
        </Text>
        <Text style={[typographyPresets.cardSubtitle, styles.muted]}>Month to date overview</Text>
      </View>
      <View style={styles.collected}>
        <PmsIcon name="arrowUp" size={ms(10)} color={colors.white} />
        <Text style={[typographyPresets.tagSmall, styles.white]}>{collectionRate}% Collected</Text>
      </View>
    </View>

    <View style={styles.grid}>
      {figures.map(f => {
        const tone = TONE[f.tone];
        return (
          <Pressable
            key={f.id}
            onPress={() => onFigurePress(f)}
            style={({ pressed }) => [
              styles.figure,
              tone.tile ? { backgroundColor: tone.tile, borderColor: tone.rim } : null,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${f.label}: ${f.amount}`}
          >
            <View style={styles.figureTop}>
              <Text
                style={[styles.figureLabel, f.tone === 'pending' && { color: tone.value }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {f.label}
              </Text>
              <View style={[styles.figureIcon, { backgroundColor: `${tone.icon}26` }]}>
                <PmsIcon name={f.icon} size={ms(14)} color={tone.icon} />
              </View>
            </View>
            <Text
              style={[styles.amount, { color: tone.value }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {f.amount}
            </Text>
          </Pressable>
        );
      })}
    </View>

    <View style={styles.rateRow}>
      <Text style={[typographyPresets.tag, styles.rateLabel]}>Collection Rate</Text>
      <Text style={[typographyPresets.bodyBold, styles.rate]}>{collectionRate}%</Text>
    </View>
    <GradientBar
      progress={collectionRate / 100}
      from={gradients.pmsCollect[0]}
      to={gradients.pmsCollect[1]}
      track="rgba(255,255,255,0.12)"
    />

    <View style={styles.actions}>
      <Button title="View P&L" variant="glass" size="md" onPress={onViewPnl} style={styles.action} />
      <Button
        title="Export"
        variant="light"
        size="md"
        onPress={onExport}
        leftIcon={<PmsIcon name="download" size={ms(16)} color={colors.pmsNavy} />}
        style={[styles.action, styles.export]}
        textStyle={styles.exportText}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.pmsNavy,
    overflow: 'hidden',
    boxShadow: '0px 10px 24px rgba(14,33,71,0.22)',
  },
  // Soft light behind the header (design: faint waves top right)
  glow: {
    position: 'absolute',
    top: -ms(120),
    right: -ms(80),
    width: ms(300),
    height: ms(260),
    backgroundImage:
      'radial-gradient(circle at center, rgba(81,142,249,0.22) 0%, rgba(81,142,249,0) 70%)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  disc: {
    width: PMS_HEADER_DISC,
    height: PMS_HEADER_DISC,
    borderRadius: PMS_HEADER_DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerText: {
    flex: 1,
  },
  white: {
    color: colors.white,
  },
  muted: {
    color: colors.textInverseMuted,
  },
  collected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: ms(9),
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(16,185,129,0.85)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  figure: {
    // Two per row: half the row minus half the gap
    width: '47.5%',
    flexGrow: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pressed: {
    opacity: 0.8,
  },
  figureTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  figureLabel: {
    ...typographyPresets.tagSmall,
    flex: 1,
    color: colors.textInverseMuted,
  },
  figureIcon: {
    width: FIGURE_BUTTON,
    height: FIGURE_BUTTON,
    borderRadius: FIGURE_BUTTON / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    ...typographyPresets.price,
    fontSize: typographyPresets.sectionHeading.fontSize,
    lineHeight: typographyPresets.sectionHeading.lineHeight,
    marginTop: spacing.xs,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  rateLabel: {
    color: colors.white,
  },
  rate: {
    color: '#4ADE80',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  action: {
    flex: 1,
  },
  // Design: teal → green Export button
  export: {
    backgroundImage: `linear-gradient(90deg, ${gradients.pmsCollect[0]} 0%, ${gradients.pmsCollect[1]} 100%)`,
  },
  exportText: {
    color: colors.pmsNavy,
  },
});

export default FinancialPulseCard;

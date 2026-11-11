/**
 * CostsFeesCard: interactive "monthly cost estimator" for Costs & Fees.
 * One soft card (chipBlue -> white wash, soft blue shadow):
 *  - "ESTIMATED MONTHLY" + big live total (base rent range + the extras
 *    the guest picked), "/ month", and what the base covers
 *  - the optional charges as tiles in two columns (no heading); tap to
 *    include one in the estimate. Picked tiles show only the soft
 *    secondary-blue tick (no stroke / fill change, per the UI rules);
 *    others show nothing
 *  - "Due at move-in": the one-time fees as compact label / value rows
 * The total pops softly whenever it changes.
 * Groups: [0] rent, [1] optional extras, [2] one-time fees (PROPERTY_COSTS).
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckmarkIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { CostGroup } from '../../types';
import { PropertySectionTitle } from './PropertySectionTitle';

interface Props {
  groups: CostGroup[];
  /** Labels of the optional extras included in the estimate */
  selected: Set<string>;
  onToggle: (label: string) => void;
}

/** Secondary blue at 70%, the app's "done / selected" tick colour */
const TICK_BLUE = `${colors.headerGradientEnd}B3`;

/** "Pet rent :" -> "Pet rent" */
const cleanLabel = (label: string) => label.replace(/\s*:\s*$/, '');

/** Every dollar amount in a value: "$2,725 – $4,850 / Month" -> [2725, 4850] */
const amounts = (value: string) =>
  (value.match(/\$\s?[\d,]+/g) ?? []).map(a => Number(a.replace(/[$,\s]/g, '')));

const money = (n: number) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export const CostsFeesCard: React.FC<Props> = ({ groups, selected, onToggle }) => {
  const [rent, extras, oneTime] = groups;
  const [base, ...baseNotes] = rent?.rows ?? [];
  const [low = 0, high = low] = base ? amounts(base.value) : [];

  const extrasTotal = (extras?.rows ?? [])
    .filter(r => selected.has(r.label))
    .reduce((sum, r) => sum + (amounts(r.value)[0] ?? 0), 0);
  const total =
    high > low
      ? `${money(low + extrasTotal)} – ${money(high + extrasTotal)}`
      : money(low + extrasTotal);

  // Soft pop on every change of the total
  const pop = useRef(new Animated.Value(1)).current;
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pop.setValue(0.94);
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, damping: 9, stiffness: 220 }).start();
  }, [total, pop]);

  if (!rent || !base) {
    return null;
  }

  return (
    <View>
      <PropertySectionTitle icon="coins" title="Costs & Fees" />

      <View style={styles.card}>
        {/* Live estimate */}
        <Text style={styles.eyebrow}>Estimated monthly</Text>
        <Animated.View style={[styles.totalRow, { transform: [{ scale: pop }] }]}>
          <Text style={styles.total} numberOfLines={1} adjustsFontSizeToFit>
            {total}
          </Text>
          <Text style={styles.per}> / month</Text>
        </Animated.View>
        <Text style={styles.note}>
          {cleanLabel(base.label)} {base.value.replace(/\s*\/\s*Month$/i, '')}
          {baseNotes.map(n => ` · ${cleanLabel(n.label)} ${n.value.toLowerCase()}`).join('')}
          {extrasTotal > 0 ? ` · Extras +${money(extrasTotal)}` : ''}
        </Text>

        {/* Optional extras */}
        {extras ? (
          <View style={styles.block}>
            <View style={styles.tiles}>
              {extras.rows.map(r => {
                const on = selected.has(r.label);
                const price = amounts(r.value)[0];
                return (
                  <Pressable
                    key={r.label}
                    onPress={() => onToggle(r.label)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={cleanLabel(r.label)}
                    style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
                  >
                    <View style={styles.tileText}>
                      <Text style={styles.tileLabel} numberOfLines={2}>
                        {cleanLabel(r.label)}
                      </Text>
                      <Text style={styles.tilePrice}>
                        {price !== undefined ? money(price) : r.value}
                        <Text style={styles.tilePer}> /mo</Text>
                      </Text>
                    </View>
                    {on ? (
                      <View style={styles.mark}>
                        <CheckmarkIcon size={ms(10)} color={colors.white} />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* One-time fees */}
        {oneTime ? (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Due at move-in</Text>
            <View style={styles.dueList}>
              {oneTime.rows.map((r, i) => (
                <View key={r.label} style={[styles.dueRow, i > 0 && styles.dueDivider]}>
                  <Text style={styles.dueLabel}>{cleanLabel(r.label)}</Text>
                  <Text style={styles.dueValue}>{r.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const MARK = ms(22);

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundImage: `linear-gradient(170deg, ${colors.chipBlue} 0%, ${colors.white} 45%)`,
    shadowColor: colors.headerGradientEnd,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 3,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: colors.textSecondary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.sm,
  },
  total: {
    ...typographyPresets.priceLarge,
    flexShrink: 1,
  },
  per: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(13),
    color: colors.textSecondary,
  },
  note: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  block: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  blockTitle: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  tile: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.pageTint,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  tileText: {
    flex: 1,
  },
  tileLabel: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  tilePrice: {
    ...typographyPresets.bodyBold,
    marginTop: spacing.xxs,
    color: colors.navy,
  },
  tilePer: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(10.5),
    color: colors.textMuted,
  },
  // Shown only on picked tiles
  mark: {
    width: MARK,
    height: MARK,
    borderRadius: MARK / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TICK_BLUE,
  },
  dueList: {
    marginTop: spacing.xs,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  dueDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  dueLabel: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textSecondary,
  },
  dueValue: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
    textAlign: 'right',
  },
});

export default CostsFeesCard;

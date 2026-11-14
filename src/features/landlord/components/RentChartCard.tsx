/**
 * RentChartCard: "Monthly Rent Collection". Selected month's total + trend
 * vs. the month before, range chip (Last 3 / 6 / 12 Months) and a bar chart
 * drawn with plain Views (no SVG in the app). Bars grow in; tap a bar to
 * select it (navy bar + amount tooltip). The current month starts selected.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RENT_CHART_MAX, RENT_CHART_STEPS } from '../constants';
import type { MonthlyRent } from '../types';
import { formatInr, formatLakh } from '../utils';
import { CardTitle, DashboardCard, TrendPill } from './DashboardParts';
import { LandlordIcon } from './LandlordIcon';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

const PLOT_H = ms(132);
const AXIS_W = ms(40);

interface Props {
  months: readonly MonthlyRent[];
  selectedIndex: number;
  /** % change vs. the month before the selected one (null: no earlier month) */
  trend: number | null;
  rangeLabel: string;
  onSelect: (index: number) => void;
  onRangePress: () => void;
}

const barWidthFor = (count: number) => (count <= 3 ? ms(40) : count <= 6 ? ms(30) : ms(14));

export const RentChartCard: React.FC<Props> = ({
  months,
  selectedIndex,
  trend,
  rangeLabel,
  onSelect,
  onRangePress,
}) => {
  const grow = useRef(new Animated.Value(IS_TEST ? 1 : 0)).current;

  // Re-grow the bars whenever the range changes
  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    grow.setValue(0);
    Animated.timing(grow, {
      toValue: 1,
      duration: 700,
      delay: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [months.length, grow]);

  const selected = months[selectedIndex];
  const barWidth = barWidthFor(months.length);
  const ticks = Array.from({ length: RENT_CHART_STEPS + 1 }, (_, i) =>
    Math.round((RENT_CHART_MAX / RENT_CHART_STEPS) * (RENT_CHART_STEPS - i)),
  );

  return (
    <DashboardCard>
      <CardTitle
        icon="chart"
        title="Monthly Rent Collection"
        right={
          <Pressable
            onPress={onRangePress}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Range: ${rangeLabel}`}
            style={({ pressed }) => [styles.range, pressed && styles.pressed]}
          >
            <Text style={[typographyPresets.badge, styles.rangeText]}>{rangeLabel}</Text>
            <LandlordIcon name="chevronDown" size={ms(12)} color={colors.textSecondary} />
          </Pressable>
        }
      />

      <View style={styles.totalRow}>
        <Text style={[typographyPresets.priceLarge, styles.total]}>
          {selected ? formatInr(selected.amount) : '—'}
        </Text>
        {trend !== null ? (
          <View style={styles.trendCol}>
            <TrendPill value={trend} />
            <Text style={[typographyPresets.caption, styles.trendCaption]}>
              vs. previous month
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.chart}>
        {/* Y axis */}
        <View style={[styles.axis, { height: PLOT_H }]}>
          {ticks.map(t => (
            <Text key={t} style={typographyPresets.caption}>
              {t === 0 ? '₹0' : formatLakh(t, 1)}
            </Text>
          ))}
        </View>

        <View style={styles.plotCol}>
          <View style={[styles.plot, { height: PLOT_H }]}>
            {/* Grid lines, aligned with the axis label centres */}
            {ticks.map((t, i) => (
              <View
                key={t}
                style={[
                  styles.gridLine,
                  i === RENT_CHART_STEPS && styles.baseLine,
                  { top: (PLOT_H / RENT_CHART_STEPS) * i },
                ]}
              />
            ))}

            <View style={styles.bars}>
              {months.map((m, i) => {
                const isSelected = i === selectedIndex;
                const h = Math.max(ms(4), (m.amount / RENT_CHART_MAX) * PLOT_H);
                return (
                  <Pressable
                    key={`${m.month}-${i}`}
                    onPress={() => onSelect(i)}
                    style={styles.column}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${m.month}: ${formatInr(m.amount)}`}
                  >
                    {isSelected ? (
                      <View style={[styles.tipWrap, { bottom: h + ms(6) }]} pointerEvents="none">
                        <View style={styles.tip}>
                          <Text style={[typographyPresets.badge, styles.tipText]}>
                            {formatLakh(m.amount)}
                          </Text>
                        </View>
                        <View style={styles.tipArrow} />
                      </View>
                    ) : null}
                    <Animated.View
                      style={[
                        styles.bar,
                        isSelected ? styles.barSelected : styles.barIdle,
                        {
                          width: barWidth,
                          height: h,
                          transformOrigin: 'bottom',
                          transform: [{ scaleY: grow }],
                        },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.months}>
            {months.map((m, i) => (
              <Text
                key={`${m.month}-${i}`}
                style={[
                  typographyPresets.caption,
                  styles.month,
                  i === selectedIndex && styles.monthSelected,
                ]}
                numberOfLines={1}
              >
                {months.length > 6 ? m.month.charAt(0) : m.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </DashboardCard>
  );
};

const styles = StyleSheet.create({
  range: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    paddingHorizontal: spacing.sm,
    paddingVertical: ms(5),
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  rangeText: {
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  total: {
    color: colors.navy,
  },
  trendCol: {
    gap: ms(3),
  },
  trendCaption: {
    color: colors.textSecondary,
  },
  chart: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
  },
  // Labels are centred on the grid lines (half a line above / below the plot)
  axis: {
    width: AXIS_W,
    justifyContent: 'space-between',
    marginTop: -ms(7),
    marginBottom: -ms(7),
  },
  plotCol: {
    flex: 1,
  },
  plot: {
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  baseLine: {
    height: 1,
    backgroundColor: colors.textSubtle,
  },
  bars: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    borderTopLeftRadius: borderRadius.sm,
    borderTopRightRadius: borderRadius.sm,
  },
  barIdle: {
    backgroundImage: `linear-gradient(180deg, ${colors.chipBlue} 0%, ${colors.tileBlue} 100%)`,
  },
  barSelected: {
    backgroundImage: `linear-gradient(180deg, ${gradients.button[1]} 0%, ${gradients.button[0]} 100%)`,
  },
  tipWrap: {
    position: 'absolute',
    left: -ms(30),
    right: -ms(30),
    alignItems: 'center',
    zIndex: 2,
  },
  tip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: ms(3),
    borderRadius: borderRadius.sm,
    backgroundColor: colors.navy,
  },
  tipText: {
    color: colors.white,
  },
  tipArrow: {
    width: ms(8),
    height: ms(8),
    marginTop: -ms(4),
    backgroundColor: colors.navy,
    transform: [{ rotate: '45deg' }],
  },
  months: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  month: {
    flex: 1,
    textAlign: 'center',
  },
  monthSelected: {
    color: colors.navy,
  },
});

export default RentChartCard;

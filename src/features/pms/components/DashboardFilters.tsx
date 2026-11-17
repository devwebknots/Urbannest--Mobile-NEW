/**
 * DashboardFilters: the period + scope filters, built as the guest home's
 * search card ("Find your next home") so it sits on the hero the same way:
 * frosted light-blue card (CARD_BG + CardBackground, glassy white edge,
 * blue shadow) overlapping the hero's fade, with
 *  - header: "Portfolio Overview" (listingTitle) over the scope line
 *    ("All Cities • All Properties • 24 units", caption) and a round white
 *    building button that opens the scope picker (guest search button);
 *  - the period switch (Today / This week / This month / Custom) in the
 *    guest Rent / Buy style: muted track, navy pill + white text when selected.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG, CardBackground } from '@/features/guest/components/CardBackground';
import { moderateScale as ms } from '@/utils/responsive';
import type { PmsPeriod } from '../types';
import { PmsIcon } from './PmsIcon';

/** Round header button, same size as the guest search card's */
const ACTION_SIZE = ms(40);
/** Clear space between a tab label and the edges of the selected pill */
const SEGMENT_PAD = spacing.md;

interface Props {
  periods: readonly { key: PmsPeriod; label: string }[];
  period: PmsPeriod;
  onPeriodChange: (period: PmsPeriod) => void;
  scopeLabel: string;
  onScopePress: () => void;
}

export const DashboardFilters: React.FC<Props> = ({
  periods,
  period,
  onPeriodChange,
  scopeLabel,
  onScopePress,
}) => (
  <View style={styles.card}>
    <CardBackground />

    <View style={styles.header}>
      <Pressable
        onPress={onScopePress}
        style={styles.headerText}
        accessibilityRole="button"
        accessibilityLabel={`Filter: ${scopeLabel}`}
      >
        <Text style={typographyPresets.listingTitle} numberOfLines={1}>
          Portfolio Overview
        </Text>
        <Text style={styles.scope} numberOfLines={1}>
          {scopeLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={onScopePress}
        hitSlop={6}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Choose cities and properties"
      >
        <PmsIcon name="building" size={ms(18)} color={colors.navy} />
      </Pressable>
    </View>

    <View style={styles.segment} accessibilityRole="tablist">
      {periods.map(p => {
        const selected = p.key === period;
        return (
          <Pressable
            key={p.key}
            onPress={() => onPeriodChange(p.key)}
            style={[styles.segmentItem, selected && styles.segmentItemActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text
              style={[styles.segmentText, { color: selected ? colors.white : colors.textSecondary }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {p.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  // Same as the guest search card
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xxl,
    backgroundColor: CARD_BG.base,
    borderWidth: 1.5,
    borderColor: CARD_BG.edge,
    ...shadows.lg,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  scope: {
    ...typographyPresets.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
  // Guest search button: white circle with a hairline border
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.75,
  },
  // Guest Rent / Buy switch
  segment: {
    flexDirection: 'row',
    padding: ms(4),
    marginTop: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  // Width follows the label (longer "This month" gets more room), then the
  // spare space is shared; the label always keeps SEGMENT_PAD on each side
  segmentItem: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    height: ms(38),
    paddingHorizontal: SEGMENT_PAD,
    borderRadius: borderRadius.pill,
  },
  segmentItemActive: {
    backgroundColor: colors.navy,
  },
  segmentText: {
    ...typographyPresets.segmentLabel,
  },
});

export default DashboardFilters;

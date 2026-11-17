/**
 * LeasingActivityCard: "Leasing Activity" card from the design: header with
 * the navy LIVE pill, one row of four stat tiles (Leads, Apps, Expiring in
 * red, Avg Days) and the Lease Cycle Efficiency bar (blue → green).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { LeasingStat } from '../types';
import { PmsIcon } from './PmsIcon';
import { GradientBar, PmsCard } from './PmsCard';

const ICON_DISC = ms(26);

interface Props {
  stats: readonly LeasingStat[];
  cycleDays: number;
  cycleProgress: number;
  onStatPress: (stat: LeasingStat) => void;
}

export const LeasingActivityCard: React.FC<Props> = ({
  stats,
  cycleDays,
  cycleProgress,
  onStatPress,
}) => (
  <PmsCard
    icon="contact"
    title="Leasing Activity"
    subtitle="Current pipeline overview"
    right={
      <View style={styles.live}>
        <View style={styles.liveDot} />
        <Text style={[typographyPresets.tagSmall, styles.liveText]}>Live</Text>
      </View>
    }
  >
    <View style={styles.stats}>
      {stats.map(stat => {
        const tint = stat.alert ? colors.error : colors.primary;
        return (
          <Pressable
            key={stat.id}
            onPress={() => onStatPress(stat)}
            style={({ pressed }) => [
              styles.stat,
              stat.alert && styles.statAlert,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <View style={[styles.statDisc, { backgroundColor: `${tint}1A` }]}>
              <PmsIcon name={stat.icon} size={ms(13)} color={tint} />
            </View>
            <View style={styles.statText}>
              <Text
                style={[styles.statLabel, stat.alert && { color: colors.error }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {stat.label}
              </Text>
              <Text style={[styles.statValue, stat.alert && { color: colors.error }]}>
                {stat.value}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>

    <View style={styles.cycleRow}>
      <Text style={typographyPresets.bodyBold}>Lease Cycle Efficiency</Text>
      <Text style={typographyPresets.bodyBold}>{cycleDays} days</Text>
    </View>
    <GradientBar
      progress={cycleProgress}
      from={gradients.pmsProgress[0]}
      to={gradients.pmsProgress[1]}
    />
  </PmsCard>
);

const styles = StyleSheet.create({
  live: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    paddingHorizontal: ms(10),
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.pmsNavy,
  },
  liveDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.liveBadge.dot,
  },
  liveText: {
    color: colors.white,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  // Design: icon to the left of label / value, light tile
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(5),
    paddingVertical: spacing.md,
    paddingHorizontal: ms(6),
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSoft,
  },
  statAlert: {
    backgroundColor: '#FEF4F4',
  },
  pressed: {
    opacity: 0.75,
  },
  statDisc: {
    width: ICON_DISC,
    height: ICON_DISC,
    borderRadius: ICON_DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    ...typographyPresets.tagSmall,
    color: colors.textSecondary,
  },
  statValue: {
    ...typographyPresets.price,
    color: colors.textPrimary,
    marginTop: 2,
  },
  cycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
});

export default LeasingActivityCard;

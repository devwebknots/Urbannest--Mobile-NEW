/**
 * PmsCard: white PMS home card with the design's header row: soft round
 * icon disc, title over subtitle, and an optional right element (LIVE
 * pill, chevron button). Also exports the small round chevron button and
 * the gradient progress bar shared by several cards.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { PmsIconName } from '../types';
import { PmsIcon } from './PmsIcon';

export const PMS_HEADER_DISC = ms(40);

interface CardProps {
  icon: PmsIconName;
  /** Icon colour (disc is the same colour at 12 %) */
  tint?: string;
  title: string;
  subtitle?: string;
  /** Small count badge after the title ("6") */
  count?: number;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export const PmsCard: React.FC<CardProps> = ({
  icon,
  tint = colors.primary,
  title,
  subtitle,
  count,
  right,
  children,
}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={[styles.disc, { backgroundColor: `${tint}1F` }]}>
        <PmsIcon name={icon} size={ms(19)} color={tint} />
      </View>
      <View style={styles.headerText}>
        <View style={styles.titleRow}>
          <Text style={typographyPresets.cardTitle} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
          {count !== undefined ? (
            <View style={styles.count}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          ) : null}
        </View>
        {subtitle ? (
          <Text style={typographyPresets.cardSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
    {children}
  </View>
);

/** Round light-blue chevron button at the right of a card header */
export const ChevronButton: React.FC<{ onPress: () => void; label: string }> = ({
  onPress,
  label,
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <PmsIcon name="chevronRight" size={ms(16)} color={colors.navy} />
  </Pressable>
);

/** Thin rounded bar with a left → right gradient fill (0 – 1) */
export const GradientBar: React.FC<{
  progress: number;
  from: string;
  to: string;
  track?: string;
  height?: number;
}> = ({ progress, from, to, track = colors.borderLight, height = ms(6) }) => {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: track }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(p * 100) }}
    >
      <View
        style={{
          width: `${p * 100}%`,
          height,
          borderRadius: height / 2,
          backgroundImage: `linear-gradient(90deg, ${from} 0%, ${to} 100%)`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadows.sm,
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
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  count: {
    minWidth: ms(22),
    paddingHorizontal: ms(6),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  countText: {
    ...typographyPresets.cardSubtitleBold,
    color: colors.navy,
  },
  chevron: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pressed: {
    opacity: 0.7,
  },
  track: {
    overflow: 'hidden',
  },
});

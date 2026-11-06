/**
 * ConciergeGrid: 2-column grid of white service cards. Each card has a
 * soft-tinted rounded-square icon (own accent per service), a small arrow
 * chip, and a left-aligned label + hint. Last card = "All Services".
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { ArrowUpRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { ConciergeAccent, ConciergeService } from '../../types';
import { RenterIcon } from './RenterIcon';

interface Props {
  services: readonly ConciergeService[];
  onPress: (service: ConciergeService) => void;
  onViewAll: () => void;
}

/** Accent tints, all from the theme's status / avatar palettes */
const ACCENTS: Record<ConciergeAccent, { bg: string; fg: string }> = {
  amber: { bg: colors.warningLight, fg: colors.warningDark },
  blue: { bg: colors.infoLight, fg: colors.primary },
  green: { bg: colors.successLight, fg: colors.successDark },
  violet: { bg: colors.avatarPurple.bg, fg: colors.avatarPurple.text },
  navy: { bg: colors.tileBlue, fg: colors.navy },
};

const ICON_BOX = ms(44);

const Card: React.FC<{
  label: string;
  hint: string;
  onPress: () => void;
  icon: React.ReactNode;
  iconBg: string;
  highlight?: boolean;
}> = ({ label, hint, onPress, icon, iconBg, highlight }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.card, highlight && styles.cardHighlight, pressed && styles.pressed]}
  >
    <View style={styles.top}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={[styles.arrow, highlight && styles.arrowHighlight]}>
        <ArrowUpRightIcon size={ms(13)} color={highlight ? colors.white : colors.navy} />
      </View>
    </View>
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
    <Text style={styles.hint} numberOfLines={1}>
      {hint}
    </Text>
  </Pressable>
);

/** 2 x 2 rounded squares, for the "All Services" card */
const GridGlyph: React.FC = () => (
  <View style={styles.glyph}>
    {[0, 1, 2, 3].map(i => (
      <View key={i} style={styles.glyphCell} />
    ))}
  </View>
);

export const ConciergeGrid: React.FC<Props> = ({ services, onPress, onViewAll }) => {
  const cards = [
    ...services.map(s => {
      // Fallback keeps the card safe if a service has no (or an unknown) accent
      const accent = ACCENTS[s.accent] ?? ACCENTS.navy;
      return (
        <Card
          key={s.id}
          label={s.label}
          hint={s.hint}
          onPress={() => onPress(s)}
          iconBg={accent.bg}
          icon={<RenterIcon name={s.icon} size={ms(22)} color={accent.fg} />}
        />
      );
    }),
    <Card
      key="all"
      label="All Services"
      hint="View everything"
      onPress={onViewAll}
      iconBg={colors.white}
      icon={<GridGlyph />}
      highlight
    />,
  ];

  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  card: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  cardHighlight: {
    backgroundColor: colors.chipBlue,
    borderColor: colors.chipBlue,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageTint,
  },
  arrowHighlight: {
    backgroundColor: colors.navy,
  },
  label: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(14.5),
    color: colors.navy,
    marginTop: spacing.md + 2,
  },
  hint: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    color: colors.textSecondary,
    marginTop: 2,
  },
  glyph: {
    width: ms(20),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(4),
  },
  glyphCell: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(2.5),
    backgroundColor: colors.navy,
  },
});

export default ConciergeGrid;

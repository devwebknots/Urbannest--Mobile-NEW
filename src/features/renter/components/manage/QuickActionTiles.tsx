/**
 * QuickActionTiles: four pastel tiles under "Quick Actions" (Rent Due,
 * Maintenance, HOA Fee, More). Each tile is tinted with its accent from
 * the shared ACCENTS palette, with a soft white sheen from the top, the
 * accent icon and a two-line navy label.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BellIcon, CalendarIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { LayersIcon } from '@/features/guest/components/GuestIcons';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
import type { ManageQuickAction, ManageQuickActionIcon } from '../../types';
import { ACCENTS } from '../dashboard/ConciergeGrid';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  items: readonly ManageQuickAction[];
  onPress: (item: ManageQuickAction) => void;
}

const ICON = ms(22);

const TileIcon: React.FC<{ name: ManageQuickActionIcon; color: string }> = ({ name, color }) => {
  switch (name) {
    case 'calendar':
      return <CalendarIcon size={ICON} color={color} />;
    case 'wrench':
      return <RenterIcon name="lineWrench" size={ICON} color={color} />;
    case 'bell':
      return <BellIcon size={ICON} color={color} />;
    default:
      return <LayersIcon size={ICON} color={color} />;
  }
};

export const QuickActionTiles: React.FC<Props> = ({ items, onPress }) => (
  <View style={styles.row}>
    {items.map(item => {
      const accent = ACCENTS[item.accent] ?? ACCENTS.navy;
      return (
        <Pressable
          key={item.id}
          onPress={() => onPress(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title} ${item.detail}`}
          style={({ pressed }) => [styles.tile, { backgroundColor: accent.bg }, pressed && styles.pressed]}
        >
          <Scrim edge="top" extent={0.7} maxOpacity={0.55} color={colors.white} />
          <TileIcon name={item.icon} color={accent.fg} />
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.detail} numberOfLines={1}>
            {item.detail}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.screenHorizontal,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  title: {
    ...typographyPresets.badge,
    marginTop: spacing.md,
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.navy,
  },
  detail: {
    ...typographyPresets.caption,
    marginTop: ms(1),
    color: colors.textSecondary,
  },
});

export default QuickActionTiles;

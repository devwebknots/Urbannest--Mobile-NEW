/**
 * QuickActionTiles: 2 x 2 grid under "Quick Actions" (Rent Due,
 * Maintenance, HOA Fee, More Actions). Each wide pastel tile is tinted
 * with its accent from the shared ACCENTS palette (soft white sheen from
 * the top left): accent icon on the left, bold navy title over the
 * detail line, chevron on the right. A highlighted detail ("in 3 days")
 * takes the accent colour.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BellIcon, CalendarIcon, ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { ManageQuickAction, ManageQuickActionIcon } from '../../types';
import { ACCENTS } from '../dashboard/ConciergeGrid';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  items: readonly ManageQuickAction[];
  onPress: (item: ManageQuickAction) => void;
  /** Half-width grid beside the Rent Due card: smaller tiles, no gutter */
  compact?: boolean;
}

const ICON = ms(24);
const ICON_COMPACT = ms(18);

/** Four rounded squares (2 x 2), drawn with Views */
// Same box as the other line icons: the drawing is inset ~1/8 on each
// side with a ~2/24 stroke, so it matches CalendarIcon / UsersIcon
export const GridIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const pad = size * 0.125;
  const inner = size - pad * 2;
  const cell = inner * 0.42;
  const box = {
    width: cell,
    height: cell,
    borderRadius: cell * 0.25,
    borderWidth: Math.max(1.5, size * 0.085),
    borderColor: color,
  };
  return (
    <View style={{ width: size, height: size, padding: pad }}>
      <View style={[styles.grid, { width: inner, height: inner }]}>
        <View style={box} />
        <View style={box} />
        <View style={box} />
        <View style={box} />
      </View>
    </View>
  );
};

const TileIcon: React.FC<{ name: ManageQuickActionIcon; color: string; size: number }> = ({
  name,
  color,
  size,
}) => {
  switch (name) {
    case 'calendar':
      return <CalendarIcon size={size} color={color} />;
    case 'wrench':
      return <RenterIcon name="lineWrench" size={size} color={color} />;
    case 'bell':
      return <BellIcon size={size} color={color} />;
    default:
      return <GridIcon size={size} color={color} />;
  }
};

export const QuickActionTiles: React.FC<Props> = ({ items, onPress, compact }) => {
  if (!compact) {
    return (
      <View style={styles.wrap}>
        {items.map(item => (
          <Tile key={item.id} item={item} onPress={onPress} />
        ))}
      </View>
    );
  }
  // Compact: two rows sharing the height the parent gives, so the boxes
  // grow or shrink to match the Rent Due card beside them
  const rows = [items.slice(0, 2), items.slice(2, 4)];
  return (
    <View style={styles.compactWrap}>
      {rows.map((row, r) => (
        <View key={r} style={styles.compactRow}>
          {row.map(item => (
            <Tile key={item.id} item={item} onPress={onPress} compact />
          ))}
        </View>
      ))}
    </View>
  );
};

const Tile: React.FC<{
  item: ManageQuickAction;
  onPress: (item: ManageQuickAction) => void;
  compact?: boolean;
}> = ({ item, onPress, compact }) => {
  const accent = ACCENTS[item.accent] ?? ACCENTS.navy;
  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title} ${item.detail}`}
      style={({ pressed }) => [
        styles.tile,
        compact && styles.tileCompact,
        { backgroundColor: accent.bg },
        pressed && styles.pressed,
      ]}
    >
      <View style={[StyleSheet.absoluteFill, styles.sheen]} />
      {compact ? (
        // Compact: icon + chevron on top, so the text gets the full width
        <View style={styles.compactTop}>
          <TileIcon name={item.icon} color={accent.fg} size={ICON_COMPACT} />
          <ChevronRightIcon size={ms(12)} color={colors.navy} />
        </View>
      ) : (
        <TileIcon name={item.icon} color={accent.fg} size={ICON} />
      )}
      <View style={[styles.copy, compact && styles.copyCompact]}>
        <Text
          style={[styles.title, compact && styles.textCompact]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.detail,
            compact && styles.textCompact,
            item.highlight && { color: accent.fg },
          ]}
          numberOfLines={1}
        >
          {item.detail}
        </Text>
      </View>
      {compact ? null : <ChevronRightIcon size={ms(14)} color={colors.navy} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
  },
  tile: {
    width: '48.2%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingLeft: spacing.md + 2,
    paddingRight: spacing.sm + 2,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    boxShadow: '0px 6px 14px rgba(11, 29, 58, 0.06)',
  },
  // Soft white light from the top left
  sheen: {
    backgroundImage:
      'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  copy: {
    flex: 1,
  },
  title: {
    ...typographyPresets.badge,
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.navy,
  },
  detail: {
    ...typographyPresets.badge,
    marginTop: ms(2),
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.navy,
  },
  // ---- compact (half width) ----
  compactWrap: {
    flex: 1,
    gap: spacing.sm,
  },
  compactRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  // Column: icon row on top, text at the bottom using the full width
  tileCompact: {
    width: undefined,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  compactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyCompact: {
    flex: 0,
  },
  textCompact: {
    fontSize: ms(12),
    lineHeight: ms(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
});

export default QuickActionTiles;

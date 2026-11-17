/**
 * RecentActivityCard: "Recent Activity" card from the design: round
 * coloured icon, title over place, time on the right, chevron, hairline
 * dividers, and a soft "View all activity" button.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { ActivityItem } from '../types';
import { PmsIcon } from './PmsIcon';
import { ChevronButton, PmsCard } from './PmsCard';

const DISC = ms(34);

interface Props {
  items: readonly ActivityItem[];
  onOpen: (item: ActivityItem) => void;
  onViewAll: () => void;
}

export const RecentActivityCard: React.FC<Props> = ({ items, onOpen, onViewAll }) => (
  <PmsCard
    icon="history"
    title="Recent Activity"
    subtitle="Latest events across your portfolio"
    right={<ChevronButton onPress={onViewAll} label="All activity" />}
  >
    <View style={styles.list}>
      {items.map((item, i) => (
        <Pressable
          key={item.id}
          onPress={() => onOpen(item)}
          style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${item.place}, ${item.time}`}
        >
          <View style={[styles.disc, { backgroundColor: `${item.color}1F` }]}>
            <PmsIcon name={item.icon} size={ms(16)} color={item.color} />
          </View>
          <View style={styles.text}>
            <Text style={typographyPresets.bodyBold} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={typographyPresets.cardSubtitle} numberOfLines={1}>
              {item.place}
            </Text>
          </View>
          <Text style={typographyPresets.caption}>{item.time}</Text>
          <PmsIcon name="chevronRight" size={ms(14)} color={colors.textMuted} />
        </Pressable>
      ))}
    </View>
    <Button title="View all activity" variant="soft" size="md" onPress={onViewAll} />
  </PmsCard>
);

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});

export default RecentActivityCard;

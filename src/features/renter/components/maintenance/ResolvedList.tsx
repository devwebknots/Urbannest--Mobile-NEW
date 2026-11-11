/**
 * ResolvedList: "Recently Resolved" card on the Maintenance page. Pale
 * secondary-blue wash (done colour, not green), tick badge, title and a
 * "View All →" link; then one row per ticket: blue dot, title on the left,
 * completion time on the right.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckmarkIcon } from '@/components/icons';
import { colors, spacing, typography, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { DONE_BLUE } from '../checkin/CompletedBadge';
import type { ResolvedTicket } from '../../types';
import { CARD_RADIUS } from './cardStyle';

interface Props {
  items: readonly ResolvedTicket[];
  onViewAll: () => void;
}

export const ResolvedList: React.FC<Props> = ({ items, onViewAll }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.tick}>
        <CheckmarkIcon size={ms(14)} color={colors.white} />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        Recently Resolved
      </Text>
      <Pressable
        onPress={onViewAll}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="View all resolved requests"
        style={({ pressed }) => [styles.link, pressed && styles.pressed]}
      >
        <Text style={styles.linkText}>View All</Text>
        <ArrowRightIcon size={ms(13)} color={colors.navy} />
      </Pressable>
    </View>

    {items.map(item => (
      <View key={item.id} style={styles.row}>
        <View style={styles.dot} />
        <Text style={styles.rowTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.rowMeta} numberOfLines={1}>
          {item.completed}
        </Text>
      </View>
    ))}
  </View>
);

const TICK = ms(26);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.lg,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundImage: `linear-gradient(135deg, rgba(81,142,249,0.12) 0%, rgba(255,255,255,0.85) 100%)`,
    boxShadow: '0px 8px 20px rgba(11,29,58,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
  },
  title: {
    ...typographyPresets.sectionTitle,
    flex: 1,
    color: colors.navy,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  pressed: {
    opacity: 0.6,
  },
  linkText: {
    ...typographyPresets.sectionLink,
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.navy,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  dot: {
    width: ms(6),
    height: ms(6),
    marginLeft: spacing.sm,
    borderRadius: ms(3),
    backgroundColor: colors.primary,
  },
  rowTitle: {
    ...typographyPresets.bodyBold,
    flex: 1,
    color: colors.navy,
  },
  rowMeta: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
});

export default ResolvedList;

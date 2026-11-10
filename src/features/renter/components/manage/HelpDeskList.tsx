/**
 * HelpDeskList: service requests in one white card, split by hairlines.
 * Each row: photo, category eyebrow, title, ticket number + date, a status
 * pill and a chevron.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { HelpDeskStatus, HelpDeskTicket } from '../../types';

const STATUS_STYLE: Record<HelpDeskStatus, { bg: string; fg: string }> = {
  Pending: { bg: colors.warningLight, fg: colors.warningDark },
  'In Progress': { bg: colors.infoLight, fg: colors.primaryDark },
  Resolved: { bg: colors.successLight, fg: colors.successDark },
};

interface Props {
  tickets: readonly HelpDeskTicket[];
  onPress: (ticket: HelpDeskTicket) => void;
}

export const HelpDeskList: React.FC<Props> = ({ tickets, onPress }) => (
  <View style={styles.card}>
    {tickets.map((ticket, i) => {
      const status = STATUS_STYLE[ticket.status];
      return (
        <Pressable
          key={ticket.id}
          onPress={() => onPress(ticket)}
          accessibilityRole="button"
          accessibilityLabel={`${ticket.category}: ${ticket.title}, ${ticket.status}`}
          style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && styles.pressed]}
        >
          <Image source={ticket.image} style={styles.photo} resizeMode="cover" />
          <View style={styles.body}>
            <Text style={styles.category} numberOfLines={1}>
              {ticket.category}
            </Text>
            <Text style={styles.title} numberOfLines={1}>
              {ticket.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              #{ticket.id} · {ticket.date}
            </Text>
          </View>
          <View style={[styles.status, { backgroundColor: status.bg }]}>
            <View style={[styles.dot, { backgroundColor: status.fg }]} />
            <Text style={[styles.statusText, { color: status.fg }]}>{ticket.status}</Text>
          </View>
          <ChevronRightIcon size={ms(12)} color={colors.textMuted} />
        </Pressable>
      );
    })}
  </View>
);

const PHOTO_W = ms(64);
const PHOTO_H = ms(56);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xxl + 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
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
  photo: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: borderRadius.lg,
  },
  body: {
    flex: 1,
  },
  category: {
    ...typographyPresets.eyebrow,
    color: colors.secondary,
  },
  title: {
    ...typographyPresets.cardTitle,
    marginTop: ms(3),
    color: colors.navy,
  },
  meta: {
    ...typographyPresets.caption,
    marginTop: ms(2),
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
  },
  dot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(2.5),
  },
  statusText: {
    ...typographyPresets.badge,
  },
});

export default HelpDeskList;

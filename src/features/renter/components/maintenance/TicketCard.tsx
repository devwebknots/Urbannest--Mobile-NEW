/**
 * TicketCard: one active maintenance request on the Maintenance page.
 * White card: tinted icon tile on the left; category / status pill and
 * ticket ID on top, title, short description, then meta items (date,
 * technician or parts status) and a round chevron button.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarIcon, ChevronRightIcon, ClockIcon, UserIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { CircleIconButton } from '../CircleIconButton';
import { ACCENTS } from '../dashboard/ConciergeGrid';
import { RenterIcon } from '../dashboard/RenterIcon';
import type { MaintenanceTicket, MaintenanceTicketMeta } from '../../types';
import { CARD_RADIUS } from './cardStyle';

interface Props {
  ticket: MaintenanceTicket;
  onPress: (ticket: MaintenanceTicket) => void;
}

const META_ICON = ms(14);

const MetaIcon: React.FC<{ icon: MaintenanceTicketMeta['icon'] }> = ({ icon }) => {
  if (icon === 'calendar') return <CalendarIcon size={META_ICON} color={colors.navy} />;
  if (icon === 'user') return <UserIcon size={META_ICON} color={colors.navy} />;
  return <ClockIcon size={META_ICON} color={colors.navy} />;
};

export const TicketCard: React.FC<Props> = ({ ticket, onPress }) => {
  const accent = ACCENTS[ticket.accent];
  return (
    <Pressable
      onPress={() => onPress(ticket)}
      accessibilityRole="button"
      accessibilityLabel={`${ticket.title}, ${ticket.category}, ticket ${ticket.id}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.tile, { backgroundColor: accent.bg }]}>
        <RenterIcon
          name={ticket.icon}
          size={ms(30)}
          color={ticket.accent === 'amber' ? colors.warning : accent.fg}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.top}>
          <View style={[styles.pill, { backgroundColor: accent.bg }]}>
            <Text style={[styles.pillText, { color: accent.fg }]} numberOfLines={1}>
              {ticket.category}
            </Text>
          </View>
          <Text style={styles.id} numberOfLines={1}>
            ID: #{ticket.id}
          </Text>
        </View>

        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.description}>{ticket.description}</Text>

        <View style={styles.footer}>
          <View style={styles.meta}>
            {ticket.meta.map(item => (
              <View key={item.label} style={styles.metaItem}>
                <MetaIcon icon={item.icon} />
                <Text style={styles.metaText}>{item.label}</Text>
              </View>
            ))}
          </View>
          <CircleIconButton
            onPress={() => onPress(ticket)}
            accessibilityLabel={`Open ticket ${ticket.id}`}
            icon={<ChevronRightIcon size={ms(12)} color={colors.navy} />}
          />
        </View>
      </View>
    </Pressable>
  );
};

const TILE = ms(56);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.lg,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 8px 20px rgba(11,29,58,0.06)',
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pill: {
    flexShrink: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(3),
    borderRadius: borderRadius.pill,
  },
  pillText: {
    ...typographyPresets.badge,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  id: {
    ...typographyPresets.caption,
    marginLeft: 'auto',
    color: colors.textSecondary,
  },
  title: {
    ...typographyPresets.cardTitle,
    marginTop: spacing.sm,
    color: colors.navy,
  },
  description: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
  },
  metaText: {
    ...typographyPresets.eyebrow,
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.6,
    color: colors.navy,
  },
});

export default TicketCard;

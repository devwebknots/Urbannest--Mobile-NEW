/**
 * TicketSummaryCard: top card on the Ticket Details page. Status pill,
 * ticket title, ticket ID + unit, description and when it was reported;
 * the same tinted icon tile as the ticket's card on the Maintenance page
 * at the top right; then a pale "Assigned to" strip with the technician's
 * initials and a navy message button.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarIcon, MessageBubbleIcon } from '@/components/icons';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { ACCENTS } from '../../dashboard/ConciergeGrid';
import { RenterIcon } from '../../dashboard/RenterIcon';
import type { MaintenanceTicket, MaintenanceTicketDetails } from '../../../types';
import { CARD_RADIUS } from '../cardStyle';

interface Props {
  ticket: MaintenanceTicket;
  details: MaintenanceTicketDetails;
  unit: string;
  onMessage: () => void;
}

export const TicketSummaryCard: React.FC<Props> = ({ ticket, details, unit, onMessage }) => {
  const accent = ACCENTS[ticket.accent];
  const status = ACCENTS[details.statusAccent];
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.heading}>
          <View style={[styles.pill, { backgroundColor: status.bg }]}>
            <Text style={[styles.pillText, { color: status.fg }]} numberOfLines={1}>
              {details.status}
            </Text>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {ticket.title}
          </Text>
        </View>
        <View style={[styles.tile, { backgroundColor: accent.bg }]}>
          <RenterIcon
            name={ticket.icon}
            size={ms(30)}
            color={ticket.accent === 'amber' ? colors.warning : accent.fg}
          />
        </View>
      </View>

      <Text style={styles.ref}>
        Ticket #{ticket.id}
        <Text style={styles.dot}>{'  •  '}</Text>
        {unit}
      </Text>
      <Text style={styles.description}>{details.description}</Text>

      <View style={styles.reported}>
        <CalendarIcon size={ms(14)} color={colors.textSecondary} />
        <Text style={styles.reportedText}>{details.reported}</Text>
      </View>

      <View style={styles.assignee}>
        <View style={styles.avatar}>
          {details.assignee.photo ? (
            <Image
              source={details.assignee.photo}
              style={styles.photo}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Text style={styles.initials}>{details.assignee.initials}</Text>
          )}
        </View>
        <View style={styles.assigneeText}>
          <Text style={styles.assignedLabel}>Assigned to</Text>
          <Text style={styles.assigneeName} numberOfLines={1}>
            {details.assignee.name}
          </Text>
        </View>
        <Pressable
          onPress={onMessage}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={`Message ${details.assignee.name}`}
          style={({ pressed }) => [styles.message, pressed && styles.pressed]}
        >
          <MessageBubbleIcon size={ms(18)} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
};

const TILE = ms(56);
const AVATAR = ms(44);
const MESSAGE = ms(42);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.lg,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.surface,
    // Soft blue wash from the top left, like the design's glassy card
    backgroundImage: 'linear-gradient(160deg, rgba(220,232,251,0.7) 0%, rgba(255,255,255,1) 55%)',
    boxShadow: '0px 8px 20px rgba(11,29,58,0.06)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  heading: {
    flex: 1,
    alignItems: 'flex-start',
  },
  pill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(3),
    borderRadius: borderRadius.pill,
  },
  pillText: {
    ...typographyPresets.badge,
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.sm,
    color: colors.navy,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ref: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  dot: {
    color: colors.textMuted,
  },
  description: {
    ...typographyPresets.body,
    marginTop: spacing.md,
  },
  reported: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: spacing.md,
  },
  reportedText: {
    ...typographyPresets.cardSubtitle,
  },
  assignee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.pageTint,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
    borderWidth: 2,
    borderColor: colors.white,
    boxShadow: '0px 4px 10px rgba(11,29,58,0.12)',
  },
  // Fills the circle inside the white rim
  photo: {
    width: AVATAR - 4,
    height: AVATAR - 4,
  },
  initials: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  assigneeText: {
    flex: 1,
  },
  assignedLabel: {
    ...typographyPresets.label,
  },
  assigneeName: {
    ...typographyPresets.cardTitle,
    marginTop: ms(2),
    color: colors.navy,
  },
  message: {
    width: MESSAGE,
    height: MESSAGE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(135deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default TicketSummaryCard;

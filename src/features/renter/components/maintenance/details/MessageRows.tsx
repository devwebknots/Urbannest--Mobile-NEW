/**
 * Rows for a ticket's notifications and chats. Shared by the preview card
 * on Ticket Details and the full "Notification & Chats" page, so both look
 * the same. Round icon / photo on the left; pale tint inside the white
 * card, white card look (`onPage`) when laid straight on the page.
 *  - NotificationRow: bell circle, title + time, "Maintenance Id: #…", message
 *  - ChatRow: photo (or initials), name + time (day if older), message (2 lines)
 * (The full page shows chats as a bubble conversation, see ChatThread.)
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BellIcon, RefreshIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { TicketChat, TicketNotification } from '../../../types';
import { RenterIcon } from '../../dashboard/RenterIcon';

interface NotificationRowProps {
  item: TicketNotification;
  ticketId: string;
  /** White card look for rows laid on the page (full list) */
  onPage?: boolean;
}

/** Round icon on the left: blue bell, or a green status icon (completed design) */
const NotificationIcon: React.FC<{ icon: TicketNotification['icon'] }> = ({ icon }) => {
  if (icon === 'done') {
    return (
      <View style={[styles.bell, styles.iconDone]}>
        <RenterIcon name="check" size={ms(16)} color={colors.white} />
      </View>
    );
  }
  if (icon === 'progress') {
    return (
      <View style={[styles.bell, styles.iconGreen]}>
        <RefreshIcon size={ms(18)} color={colors.successDark} />
      </View>
    );
  }
  if (icon === 'assigned') {
    return (
      <View style={[styles.bell, styles.iconGreen]}>
        <RenterIcon name="lineNote" size={ms(18)} color={colors.successDark} />
      </View>
    );
  }
  return (
    <View style={styles.bell}>
      <BellIcon size={ms(18)} color={colors.primary} />
    </View>
  );
};

export const NotificationRow: React.FC<NotificationRowProps> = ({ item, ticketId, onPage }) => (
  <View style={[styles.row, onPage && styles.rowOnPage]}>
    <NotificationIcon icon={item.icon} />
    <View style={styles.body}>
      <View style={styles.head}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.time} numberOfLines={1}>
          {item.time}
        </Text>
      </View>
      {/* System notices carry the ticket ID; status updates just the message */}
      {item.icon ? null : (
        <Text style={styles.text}>
          Maintenance Id: <Text style={styles.id}>#{ticketId}</Text>
        </Text>
      )}
      <Text style={styles.text}>{item.message}</Text>
    </View>
  </View>
);

interface ChatRowProps {
  item: TicketChat;
  onPress: (item: TicketChat) => void;
  /** White card look for rows laid on the page (full list) */
  onPage?: boolean;
}

export const ChatRow: React.FC<ChatRowProps> = ({ item, onPress, onPage }) => (
  <Pressable
    onPress={() => onPress(item)}
    accessibilityRole="button"
    accessibilityLabel={`${item.name}, ${item.day} ${item.time}: ${item.message}`}
    style={({ pressed }) => [styles.row, onPage && styles.rowOnPage, pressed && styles.pressed]}
  >
    <View style={styles.avatar}>
      {item.photo ? (
        <Image
          source={item.photo}
          style={styles.photo}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={styles.initials}>{item.initials}</Text>
      )}
    </View>
    <View style={styles.body}>
      <View style={styles.head}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.time} numberOfLines={1}>
          {item.day === 'Today' ? item.time : item.day}
        </Text>
      </View>
      <Text style={styles.text} numberOfLines={2}>
        {item.message}
      </Text>
    </View>
  </Pressable>
);

const CIRCLE = ms(44);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.pageTint,
  },
  // Same light card as the other page cards (hairline + soft shadow)
  rowOnPage: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 6px 16px rgba(11,29,58,0.05)',
  },
  pressed: {
    opacity: 0.7,
  },
  bell: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoLight,
  },
  iconDone: {
    backgroundColor: colors.success,
  },
  iconGreen: {
    backgroundColor: colors.successLight,
  },
  avatar: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  // Fills the circle inside the white rim
  photo: {
    width: CIRCLE - 4,
    height: CIRCLE - 4,
  },
  initials: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  body: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    ...typographyPresets.bodyBold,
    flex: 1,
    color: colors.navy,
  },
  time: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  text: {
    ...typographyPresets.body,
  },
  id: {
    color: colors.primary,
  },
});

/**
 * TicketMessages: white card under "Notification & Chats" on the Ticket
 * Details page. Tabs with counts, then only the latest few rows of the
 * chosen tab (newest first) and a "View all N …" link that opens the full
 * Notification & Chats page, so a long history never fills this page.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { MessageBubbleIcon } from '@/components/icons';
import { CARD_RADIUS } from '../cardStyle';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { TicketChat, TicketMessagesTab, TicketNotification } from '../../../types';
import { ChatRow, NotificationRow } from './MessageRows';
import { MessageTabs } from './MessageTabs';

interface Props {
  ticketId: string;
  tab: TicketMessagesTab;
  onTabChange: (tab: TicketMessagesTab) => void;
  notifications: readonly TicketNotification[];
  chats: readonly TicketChat[];
  /** Rows shown here per tab; the rest are on the full page */
  previewCount: number;
  onViewAll: (tab: TicketMessagesTab) => void;
  onOpenChat: (chat: TicketChat) => void;
  /** Completed design: full-width "New Message" button under the rows */
  onNewMessage?: () => void;
}

export const TicketMessages: React.FC<Props> = ({
  ticketId,
  tab,
  onTabChange,
  notifications,
  chats,
  previewCount,
  onViewAll,
  onOpenChat,
  onNewMessage,
}) => {
  const total = tab === 'notifications' ? notifications.length : chats.length;
  // Notifications: link only when some are hidden. Chat: offer to open the
  // conversation, unless the "New Message" button already does that.
  const showLink = tab === 'chats' ? !onNewMessage : total > previewCount;
  return (
    <View style={styles.card}>
      <MessageTabs
        tab={tab}
        onChange={onTabChange}
        counts={{ notifications: notifications.length, chats: chats.length }}
      />

      <View style={styles.list}>
        {total === 0 ? (
          <Text style={styles.empty}>
            {tab === 'notifications' ? 'No notifications yet.' : 'No chats yet.'}
          </Text>
        ) : null}

        {tab === 'notifications'
          ? notifications
              .slice(0, previewCount)
              .map(n => <NotificationRow key={n.id} item={n} ticketId={ticketId} />)
          : chats
              .slice(0, previewCount)
              .map(c => <ChatRow key={c.id} item={c} onPress={onOpenChat} />)}
      </View>

      {showLink ? (
        <Button
          title={tab === 'notifications' ? `View all ${total} notifications` : 'Open chat'}
          variant="link"
          hitSlop={10}
          onPress={() => onViewAll(tab)}
          rightIcon={<ArrowRightIcon size={ms(14)} color={colors.navy} />}
          style={styles.viewAll}
        />
      ) : null}

      {onNewMessage ? (
        <Button
          title="New Message"
          variant="soft"
          size="md"
          onPress={onNewMessage}
          leftIcon={<MessageBubbleIcon size={ms(18)} color={colors.navy} />}
          style={styles.newMessage}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 8px 20px rgba(11,29,58,0.06)',
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  empty: {
    ...typographyPresets.cardSubtitle,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  viewAll: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  newMessage: {
    marginTop: spacing.lg,
  },
});

export default TicketMessages;

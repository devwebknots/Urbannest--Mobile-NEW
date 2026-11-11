/**
 * TicketMessagesScreen: one ticket's "Notification & Chats", opened by
 * "View all", a chat row or the message button on Ticket Details. Same
 * navy header as Ticket Details; the header and the Notification / Chat
 * History tabs stay put while the content below scrolls.
 *  - Notification: full list of the same rows as Ticket Details (FlatList)
 *  - Chat History: the conversation (others left, renter right, day chips)
 *    with a message box pinned at the bottom to send new messages
 */

import React, { useCallback } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { NavyPageHeader } from '../components/NavyPageHeader';
import { ChatComposer } from '../components/maintenance/details/ChatComposer';
import { ChatThread } from '../components/maintenance/details/ChatThread';
import { NotificationRow } from '../components/maintenance/details/MessageRows';
import { MessageTabs } from '../components/maintenance/details/MessageTabs';
import { TicketMessagesNavigation, useTicketMessages } from '../hooks/useTicketMessages';
import type { TicketMessagesTab, TicketNotification } from '../types';

interface Props {
  navigation?: TicketMessagesNavigation;
  route?: { params?: { residenceId?: string; ticketId?: string; tab?: TicketMessagesTab } };
}

const Separator: React.FC = () => <View style={styles.separator} />;

export const TicketMessagesScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const vm = useTicketMessages(route?.params?.ticketId, route?.params?.tab, navigation);
  const { ticket } = vm;

  const renderNotification = useCallback(
    ({ item }: { item: TicketNotification }) => (
      <NotificationRow item={item} ticketId={ticket.id} onPage />
    ),
    [ticket.id],
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <NavyPageHeader
        title="Notification & Chats"
        subtitle={`Ticket #${ticket.id}  •  ${ticket.title}`}
        topInset={insets.top}
        onBack={vm.back}
        backLabel="Back to ticket details"
      >
        <View style={styles.tabs}>
          <MessageTabs
            tab={vm.tab}
            onChange={vm.setTab}
            counts={{ notifications: vm.notifications.length, chats: vm.chats.length }}
          />
        </View>
      </NavyPageHeader>

      {vm.tab === 'notifications' ? (
        <FlatList
          data={vm.notifications}
          keyExtractor={item => item.id}
          renderItem={renderNotification}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl },
          ]}
        />
      ) : (
        <>
          <ChatThread messages={vm.chats} />
          <ChatComposer
            value={vm.draft}
            onChange={vm.setDraft}
            onSend={vm.send}
            canSend={vm.canSend}
            bottomInset={insets.bottom}
            placeholder={`Message ${vm.assignee.name.split(' ')[0]}...`}
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  tabs: {
    marginTop: -spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
  },
  separator: {
    height: spacing.md,
  },
  empty: {
    ...typographyPresets.cardSubtitle,
    paddingVertical: spacing.xxl,
    textAlign: 'center',
  },
});

export default TicketMessagesScreen;

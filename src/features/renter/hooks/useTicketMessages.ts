/**
 * useTicketMessages: ViewModel for the full "Notification & Chats" page of
 * one ticket (opened by "View all" / a chat row / the message button on
 * Ticket Details). Exposes the ticket, its notifications and chat (newest
 * first), the selected tab and the message box. Sent messages are added to
 * the chat locally (mock until the chat API is wired).
 */

import { useCallback, useMemo, useState } from 'react';
import { goBack } from '@/navigation/navigationRef';
import { MAINTENANCE_TICKET_DETAILS, MAINTENANCE_TICKETS, RENTER_PROFILE } from '../constants';
import type { TicketChat, TicketMessagesTab } from '../types';

export interface TicketMessagesNavigation {
  goBack: () => void;
}

/** "08:40 AM" */
function clockTime(date: Date): string {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const h12 = String(h % 12 === 0 ? 12 : h % 12).padStart(2, '0');
  return `${h12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}

export function useTicketMessages(
  ticketId?: string,
  initialTab: TicketMessagesTab = 'notifications',
  navigation?: TicketMessagesNavigation,
) {
  const ticket = useMemo(
    () => MAINTENANCE_TICKETS.find(t => t.id === ticketId) ?? MAINTENANCE_TICKETS[0],
    [ticketId],
  );
  const details = MAINTENANCE_TICKET_DETAILS[ticket.id] ?? MAINTENANCE_TICKET_DETAILS['RE-5104'];

  const [tab, setTab] = useState<TicketMessagesTab>(initialTab);

  // Chat: messages sent on this page go on top of the history (newest first)
  const [sent, setSent] = useState<TicketChat[]>([]);
  const chats = useMemo(() => [...sent, ...details.chats], [sent, details.chats]);
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  const send = useCallback(() => {
    const message = draft.trim();
    if (!message) return;
    setSent(prev => [
      {
        id: `sent-${Date.now()}`,
        name: 'You',
        initials: RENTER_PROFILE.initials,
        message,
        day: 'Today',
        time: clockTime(new Date()),
        fromMe: true,
      },
      ...prev,
    ]);
    setDraft('');
  }, [draft]);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  return {
    ticket,
    assignee: details.assignee,
    notifications: details.notifications,
    chats,
    tab,
    setTab,
    draft,
    setDraft,
    canSend,
    send,
    back,
  };
}

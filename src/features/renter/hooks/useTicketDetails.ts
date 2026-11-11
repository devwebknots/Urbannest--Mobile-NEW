/**
 * useTicketDetails: ViewModel for the Ticket Details page (opened by
 * tapping an Active Ticket on the Maintenance page). Exposes the ticket,
 * its (mock) status, timeline, notifications and chats, the selected tab,
 * which sections are open (timeline open, notifications closed at first)
 * and the full-screen photo viewer. Only the latest few notifications /
 * chats show here; "View all" opens the full Notification & Chats page.
 * Actions without a page yet show a "coming soon" dialog.
 */

import { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, type ImageSourcePropType } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import {
  MAINTENANCE_TICKET_DETAILS,
  ALL_MAINTENANCE_TICKETS,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';
import type { TicketMessagesTab } from '../types';

export interface TicketDetailsNavigation {
  goBack: () => void;
  navigate?: (
    route: 'TicketMessages',
    params: { residenceId: string; ticketId: string; tab: TicketMessagesTab },
  ) => void;
}

/** Rows of each tab shown on this page; "View all" opens the rest */
const MESSAGES_PREVIEW = 3;

export function useTicketDetails(
  residenceId?: string,
  ticketId?: string,
  navigation?: TicketDetailsNavigation,
) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const ticket = useMemo(
    () => ALL_MAINTENANCE_TICKETS.find(t => t.id === ticketId) ?? ALL_MAINTENANCE_TICKETS[0],
    [ticketId],
  );
  const details = MAINTENANCE_TICKET_DETAILS[ticket.id] ?? MAINTENANCE_TICKET_DETAILS['RE-5104'];

  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const soon = useCallback(
    (title: string, message = 'Coming soon.') =>
      showDialog({ tone: 'info', title, message, actions: [{ label: 'OK', variant: 'brand' }] }),
    [showDialog],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const [tab, setTab] = useState<TicketMessagesTab>('notifications');

  // Collapsible sections: timeline open, notifications closed at first
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const toggleTimeline = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTimelineOpen(o => !o);
  }, []);
  const toggleMessages = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessagesOpen(o => !o);
  }, []);

  // "View all": the full, scrollable Notification & Chats page on that tab
  const viewAllMessages = useCallback(
    (openTab: TicketMessagesTab) => {
      const params = { residenceId: residence.id, ticketId: ticket.id, tab: openTab };
      if (navigation?.navigate) {
        navigation.navigate('TicketMessages', params);
      } else {
        navigate('TicketMessages', params);
      }
    },
    [navigation, residence.id, ticket.id],
  );
  // A chat row or the technician's message button: open the conversation
  const openChat = useCallback(() => viewAllMessages('chats'), [viewAllMessages]);

  // Full-screen view of a timeline photo
  const [photo, setPhoto] = useState<ImageSourcePropType | null>(null);
  const closePhoto = useCallback(() => setPhoto(null), []);

  return {
    profile: RENTER_PROFILE,
    ticket,
    details,
    /** Finished ticket: green completed look */
    completed: !!details.completed,
    unit: residence.unit,
    tab,
    setTab,
    messagesPreview: MESSAGES_PREVIEW,
    viewAllMessages,
    openChat,
    timelineOpen,
    toggleTimeline,
    messagesOpen,
    toggleMessages,
    photo,
    openPhoto: setPhoto,
    closePhoto,
    back,
    messageAssignee: openChat,
    openProfile: () => soon('Profile'),
    dialog: dialog.props,
  };
}

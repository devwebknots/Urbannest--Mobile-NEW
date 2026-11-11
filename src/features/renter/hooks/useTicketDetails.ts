/**
 * useTicketDetails: ViewModel for the Ticket Details page (opened by
 * tapping an Active Ticket on the Maintenance page). Exposes the ticket,
 * its (mock) status, timeline, notifications and chats, the selected tab
 * and the full-screen photo viewer. Actions without a page yet show a
 * "coming soon" dialog.
 */

import { useCallback, useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import {
  MAINTENANCE_TICKET_DETAILS,
  MAINTENANCE_TICKETS,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';

export interface TicketDetailsNavigation {
  goBack: () => void;
}

export type TicketMessagesTab = 'notifications' | 'chats';

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
    () => MAINTENANCE_TICKETS.find(t => t.id === ticketId) ?? MAINTENANCE_TICKETS[0],
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

  // Full-screen view of a timeline photo
  const [photo, setPhoto] = useState<ImageSourcePropType | null>(null);
  const closePhoto = useCallback(() => setPhoto(null), []);

  const assigneeName = details.assignee.name;

  return {
    profile: RENTER_PROFILE,
    ticket,
    details,
    unit: residence.unit,
    tab,
    setTab,
    photo,
    openPhoto: setPhoto,
    closePhoto,
    back,
    messageAssignee: () => soon(`Message ${assigneeName}`, 'Chat with your technician is coming soon.'),
    openMessages: () => soon('Notification & Chats'),
    openProfile: () => soon('Profile'),
    dialog: dialog.props,
  };
}

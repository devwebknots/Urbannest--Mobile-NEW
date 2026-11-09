/**
 * useManageResidence: ViewModel for the Manage page of an active lease
 * (opened from "Manage" on My Residences). Resolves the residence and
 * exposes the (mock) quick actions, alerts, community events and help
 * desk tickets. Features without a page yet show a "coming soon" dialog.
 */

import { useCallback, useMemo } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import {
  COMMUNITY_BUZZ,
  HELP_DESK_TICKETS,
  MANAGE_ACTIONS,
  MANAGE_QUICK_ACTIONS,
  QUICK_ALERTS,
  RENT_DUE,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';
import type { BuzzEvent, HelpDeskTicket, ManageAction, ManageQuickAction, QuickAlert } from '../types';

export interface ManageNavigation {
  goBack: () => void;
}

export function useManageResidence(residenceId?: string, navigation?: ManageNavigation) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
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

  const openAction = useCallback((action: ManageAction) => soon(action.label), [soon]);
  const openAlert = useCallback((alert: QuickAlert) => soon(alert.title), [soon]);
  const openQuickAction = useCallback(
    (item: ManageQuickAction) => soon(`${item.title} ${item.detail}`),
    [soon],
  );
  const openEvent = useCallback(
    (event: BuzzEvent) =>
      soon(event.title, event.registrationOpen ? 'Event registration is coming soon.' : 'Registration opens soon.'),
    [soon],
  );
  const openTicket = useCallback(
    (ticket: HelpDeskTicket) => soon(ticket.category, `Tracking for ticket #${ticket.id} is coming soon.`),
    [soon],
  );

  return {
    profile: RENTER_PROFILE,
    residence,
    // e.g. "$5,400" -> "$5,400.00"
    rentAmount: residence.rent.includes('.') ? residence.rent : `${residence.rent}.00`,
    rentDue: RENT_DUE,
    greeting: greetingFor(new Date().getHours()),
    actions: MANAGE_ACTIONS,
    quickActions: MANAGE_QUICK_ACTIONS,
    alerts: QUICK_ALERTS,
    events: COMMUNITY_BUZZ,
    tickets: HELP_DESK_TICKETS,
    back,
    openAction,
    openAlert,
    openQuickAction,
    openEvent,
    openTicket,
    payNow: () => soon('Pay Rent', 'Online rent payment is coming soon.'),
    openResidence: () => soon(residence.name, 'Residence details are coming soon.'),
    openNotifications: () => soon('Notifications'),
    openProfile: () => soon('Profile'),
    seeAllEvents: () => soon('Community Buzz'),
    seeAllTickets: () => soon('Help Desk'),
    seeAllQuickActions: () => soon('Quick Actions'),
    newRequest: () => soon('New Request', 'Raising a service request is coming soon.'),
    dialog: dialog.props,
  };
}

/** "Good morning" before noon, "Good afternoon" until 5 pm, then "Good evening" */
function greetingFor(hour: number): string {
  if (hour < 12) {
    return 'Good morning';
  }
  return hour < 17 ? 'Good afternoon' : 'Good evening';
}

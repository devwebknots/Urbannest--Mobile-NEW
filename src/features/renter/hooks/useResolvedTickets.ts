/**
 * useResolvedTickets: ViewModel for the Resolved Tickets page (opened by
 * "View All" on Recently Resolved). Lists every finished request, newest
 * first; tapping one opens its Ticket Details in the completed look.
 */

import { useCallback, useMemo } from 'react';
import { goBack, navigate } from '@/navigation/navigationRef';
import { RESIDENCES, RESOLVED_MAINTENANCE_TICKETS } from '../constants';
import type { MaintenanceTicket } from '../types';

export interface ResolvedTicketsNavigation {
  goBack: () => void;
  navigate?: (route: 'TicketDetails', params: { residenceId: string; ticketId: string }) => void;
}

export function useResolvedTickets(residenceId?: string, navigation?: ResolvedTicketsNavigation) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const openTicket = useCallback(
    (ticket: MaintenanceTicket) => {
      const params = { residenceId: residence.id, ticketId: ticket.id };
      if (navigation?.navigate) {
        navigation.navigate('TicketDetails', params);
      } else {
        navigate('TicketDetails', params);
      }
    },
    [navigation, residence.id],
  );

  return {
    tickets: RESOLVED_MAINTENANCE_TICKETS,
    back,
    openTicket,
  };
}

/**
 * useResidenceDashboard: ViewModel for one residence's dashboard.
 * Resolves the residence, exposes the (mock) dashboard data and the
 * actions — features without a page yet show a "coming soon" note.
 */

import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { goBack } from '@/navigation/navigationRef';
import {
  CONCIERGE_SERVICES,
  FEATURED_EVENT,
  FINANCIAL_SUMMARY,
  RECENT_REQUESTS,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';
import type { ConciergeService } from '../types';

export interface DashboardNavigation {
  goBack: () => void;
}

const soon = (title: string, message = 'Coming soon.') => Alert.alert(title, message);

export function useResidenceDashboard(residenceId?: string, navigation?: DashboardNavigation) {
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

  const openService = useCallback(
    (service: ConciergeService) => soon(service.label),
    [],
  );

  return {
    profile: RENTER_PROFILE,
    residence,
    address: `${residence.name}, ${residence.unit}`,
    services: CONCIERGE_SERVICES,
    finance: FINANCIAL_SUMMARY,
    requests: RECENT_REQUESTS,
    event: FEATURED_EVENT,
    back,
    openService,
    openResidenceDetails: () => soon(residence.name, 'Residence details are coming soon.'),
    payNow: () => soon('Pay Now', 'Online rent payment is coming soon.'),
    viewHoa: () => soon('HOA Fee', 'HOA fee details are coming soon.'),
    openRequest: () => soon('Service Request', 'Request tracking is coming soon.'),
    openEvent: () => soon(FEATURED_EVENT.title, 'Event RSVP is coming soon.'),
    exploreAll: (section: string) => soon(section),
    openProfile: () => soon('Profile'),
  };
}

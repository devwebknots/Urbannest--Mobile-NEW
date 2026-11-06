/**
 * useRenterHome: ViewModel for the renter "My Residences" page.
 * Owns the filter state, the counts and the card actions.
 * Tapping a move-in-ready residence opens check-in; an active one, its dashboard.
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { navigate } from '@/navigation/navigationRef';
import { RENTER_PROFILE, RESIDENCES } from '../constants';
import type { Residence, ResidenceFilter } from '../types';

export interface RenterHomeNavigation {
  navigate: (route: 'ResidenceDashboard' | 'CheckIn', params: { residenceId: string }) => void;
}

const isCurrent = (r: Residence) => r.status !== 'expired';

export function useRenterHome(navigation?: RenterHomeNavigation) {
  const [filter, setFilter] = useState<ResidenceFilter>('all');

  const residences = useMemo(() => {
    if (filter === 'current') {
      return RESIDENCES.filter(isCurrent);
    }
    if (filter === 'past') {
      return RESIDENCES.filter(r => !isCurrent(r));
    }
    return RESIDENCES;
  }, [filter]);

  const counts = useMemo(
    () => ({
      all: RESIDENCES.length,
      current: RESIDENCES.filter(isCurrent).length,
      past: RESIDENCES.filter(r => !isCurrent(r)).length,
    }),
    [],
  );

  const openResidence = useCallback(
    (residence: Residence) => {
      if (!isCurrent(residence)) {
        Alert.alert(residence.name, 'Past lease details are coming soon.');
        return;
      }
      // Move-in-ready homes open the check-in page; active leases their dashboard
      const route = residence.status === 'moveInReady' ? 'CheckIn' : 'ResidenceDashboard';
      const params = { residenceId: residence.id };
      if (navigation?.navigate) {
        navigation.navigate(route, params);
      } else {
        navigate(route, params);
      }
    },
    [navigation],
  );

  const openMenu = useCallback((residence: Residence) => {
    Alert.alert(residence.name, 'More options are coming soon.');
  }, []);

  return {
    profile: RENTER_PROFILE,
    filter,
    setFilter,
    counts,
    residences,
    openResidence,
    openMenu,
  };
}

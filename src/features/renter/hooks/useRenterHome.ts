/**
 * useRenterHome: ViewModel for the renter "My Residences" page.
 * Owns the filter state, the counts and the card actions.
 * Tapping a current residence opens its dashboard.
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { navigate } from '@/navigation/navigationRef';
import { RENTER_PROFILE, RESIDENCES } from '../constants';
import type { Residence, ResidenceFilter } from '../types';

export interface RenterHomeNavigation {
  navigate: (route: 'ResidenceDashboard', params: { residenceId: string }) => void;
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
      const params = { residenceId: residence.id };
      if (navigation?.navigate) {
        navigation.navigate('ResidenceDashboard', params);
      } else {
        navigate('ResidenceDashboard', params);
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

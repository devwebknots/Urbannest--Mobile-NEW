/**
 * useRenterHome: ViewModel for the renter "My Residences" page.
 * Owns the filter and tab state, the counts and the card actions.
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { RENTER_PROFILE, RESIDENCES } from '../constants';
import type { Residence, ResidenceFilter, RenterTab } from '../types';

const isCurrent = (r: Residence) => r.status !== 'expired';

export function useRenterHome() {
  const [filter, setFilter] = useState<ResidenceFilter>('all');
  const [tab, setTab] = useState<RenterTab>('residences');

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

  const openResidence = useCallback((residence: Residence) => {
    if (residence.status === 'moveInReady') {
      Alert.alert(
        'Check in',
        `Your keys for ${residence.name} are ready. Digital check-in is coming soon.`,
      );
      return;
    }
    Alert.alert(
      residence.name,
      residence.status === 'active'
        ? 'Lease management is coming soon.'
        : 'Past lease details are coming soon.',
    );
  }, []);

  const openMenu = useCallback((residence: Residence) => {
    Alert.alert(residence.name, 'More options are coming soon.');
  }, []);

  return {
    profile: RENTER_PROFILE,
    filter,
    setFilter,
    counts,
    residences,
    tab,
    setTab,
    openResidence,
    openMenu,
  };
}

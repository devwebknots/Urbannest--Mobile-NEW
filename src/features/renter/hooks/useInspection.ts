/**
 * useInspection: ViewModel for the move-in inspection page.
 * Tracks which areas the renter has confirmed. "Finalize Inspection" is
 * enabled once every area is confirmed; it returns to Check-In with
 * `inspectionSubmitted`, which ticks the Inspection tile there.
 * Later the areas and their status will come from the backend.
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { goBack, navigate } from '@/navigation/navigationRef';
import { INSPECTION_AREAS, RENTER_PROFILE, RESIDENCES } from '../constants';
import type { InspectionArea } from '../types';

export interface InspectionNavigation {
  goBack: () => void;
  navigate?: (options: {
    name: 'CheckIn';
    params: { residenceId: string; inspectionSubmitted: boolean };
    merge: boolean;
  }) => void;
}

export function useInspection(residenceId?: string, navigation?: InspectionNavigation) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const [confirmed, setConfirmed] = useState<ReadonlySet<string>>(() => new Set());

  const total = INSPECTION_AREAS.length;
  const done = confirmed.size;
  const canSubmit = done === total;

  const toggleArea = useCallback((area: InspectionArea) => {
    setConfirmed(prev => {
      const next = new Set(prev);
      if (next.has(area.id)) {
        next.delete(area.id);
      } else {
        next.add(area.id);
      }
      return next;
    });
  }, []);

  // Back to the existing Check-In screen with the inspection marked done
  const finalize = useCallback(() => {
    if (!canSubmit) {
      return;
    }
    const params = { residenceId: residence.id, inspectionSubmitted: true };
    if (navigation?.navigate) {
      navigation.navigate({ name: 'CheckIn', params, merge: true });
    } else {
      navigate('CheckIn', params);
    }
  }, [canSubmit, navigation, residence.id]);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  return {
    profile: RENTER_PROFILE,
    residence,
    areas: INSPECTION_AREAS,
    confirmed,
    done,
    total,
    canSubmit,
    toggleArea,
    finalize,
    back,
    openProfile: () => Alert.alert('Profile', 'Coming soon.'),
  };
}

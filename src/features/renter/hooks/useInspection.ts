/**
 * useInspection: ViewModel for the move-in inspection page.
 * Tapping an area opens its own page (InspectionArea). When that page is
 * finalized it comes back with `completedAreaId`, which marks the area
 * completed here; completed areas can be opened and finalized again.
 * "Finalize Inspection" is enabled once every area is completed; it
 * returns to Check-In with `inspectionSubmitted`, which ticks the
 * Inspection tile there. Later this status will come from the backend.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { goBack, navigate } from '@/navigation/navigationRef';
import { INSPECTION_AREAS, RENTER_PROFILE, RESIDENCES } from '../constants';
import type { InspectionArea } from '../types';

export interface InspectionNavigation {
  goBack: () => void;
  /** React Navigation's object form: navigate({ name, params, merge }) */
  navigate?: (options: { name: string; params: object; merge?: boolean }) => void;
}

export function useInspection(
  residenceId?: string,
  navigation?: InspectionNavigation,
  completedAreaId?: string,
) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const [completed, setCompleted] = useState<ReadonlySet<string>>(() => new Set());

  // An area page was finalized: mark that area completed
  useEffect(() => {
    if (completedAreaId) {
      setCompleted(prev => new Set(prev).add(completedAreaId));
    }
  }, [completedAreaId]);

  const total = INSPECTION_AREAS.length;
  const done = completed.size;
  const canSubmit = done === total;

  const openArea = useCallback(
    (area: InspectionArea) => {
      const params = { residenceId: residence.id, areaId: area.id };
      if (navigation?.navigate) {
        navigation.navigate({ name: 'InspectionArea', params });
      } else {
        navigate('InspectionArea', params);
      }
    },
    [navigation, residence.id],
  );

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
    completed,
    done,
    total,
    canSubmit,
    openArea,
    finalize,
    back,
    openProfile: () => Alert.alert('Profile', 'Coming soon.'),
  };
}

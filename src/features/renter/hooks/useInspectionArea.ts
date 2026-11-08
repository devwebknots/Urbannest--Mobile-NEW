/**
 * useInspectionArea: ViewModel for one area's inspection page (e.g. Living
 * Room). Finalizing returns to the Inspection page with `completedAreaId`,
 * which marks the area completed there. The area checklist itself comes
 * next (and later from the backend).
 */

import { useCallback, useMemo } from 'react';
import { goBack, navigate } from '@/navigation/navigationRef';
import { INSPECTION_AREAS, RESIDENCES } from '../constants';
import type { InspectionNavigation } from './useInspection';

export function useInspectionArea(
  residenceId?: string,
  areaId?: string,
  navigation?: InspectionNavigation,
) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const area = useMemo(
    () => INSPECTION_AREAS.find(a => a.id === areaId) ?? INSPECTION_AREAS[0],
    [areaId],
  );
  const step = INSPECTION_AREAS.indexOf(area) + 1;

  // Back to the existing Inspection page with this area completed
  const finalize = useCallback(() => {
    const params = { residenceId: residence.id, completedAreaId: area.id };
    if (navigation?.navigate) {
      navigation.navigate({ name: 'Inspection', params, merge: true });
    } else {
      navigate('Inspection', params);
    }
  }, [navigation, residence.id, area.id]);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  return {
    residence,
    area,
    step,
    total: INSPECTION_AREAS.length,
    finalize,
    back,
  };
}

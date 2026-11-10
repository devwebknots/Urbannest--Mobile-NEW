/**
 * useCheckIn: ViewModel for the move-in check-in page.
 * Tracks which checklist items the renter has confirmed, and submits the
 * check-in once all are done. Digital key, neighborhood and profile
 * actions show "coming soon" for now.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { goBack, navigate } from '@/navigation/navigationRef';
import {
  CHECK_IN_SUMMARY,
  CHECK_IN_TASKS,
  CURATED_LIVING,
  NEIGHBORHOOD,
  NEIGHBORHOOD_RADIUS,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';
import type { CheckInTask, NeighborhoodPlace } from '../types';

export interface CheckInNavigation {
  goBack: () => void;
  navigate?: (route: 'InspectionArea' | 'Utilities', params: { residenceId: string }) => void;
}

const soon = (title: string, message = 'Coming soon.') => Alert.alert(title, message);

/**
 * @param inspectionSubmitted set by the inspection room page after "Finalize Inspection".
 * @param utilitiesConfirmed set by the Utilities page after "Confirm Utilities".
 *   Later these statuses will come from the backend instead.
 */
export function useCheckIn(
  residenceId?: string,
  navigation?: CheckInNavigation,
  inspectionSubmitted?: boolean,
  utilitiesConfirmed?: boolean,
) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const [confirmed, setConfirmed] = useState<ReadonlySet<string>>(() => new Set());

  // Tick the inspection only once its own screen has been submitted
  useEffect(() => {
    if (inspectionSubmitted) {
      setConfirmed(prev => new Set(prev).add('inspection'));
    }
  }, [inspectionSubmitted]);
  useEffect(() => {
    if (utilitiesConfirmed) {
      setConfirmed(prev => new Set(prev).add('utilities'));
    }
  }, [utilitiesConfirmed]);
  const [submitted, setSubmitted] = useState(false);
  const [placeTab, setPlaceTab] = useState(NEIGHBORHOOD[0].id);

  const total = CHECK_IN_TASKS.length;
  const done = confirmed.size;
  const canSubmit = done === total && !submitted;

  const toggleTask = useCallback(
    (task: CheckInTask) => {
      if (submitted) {
        return;
      }
      // Items with their own screen open it; that screen ticks them on submit
      if (task.screen) {
        const params = { residenceId: residence.id };
        if (navigation?.navigate) {
          navigation.navigate(task.screen, params);
        } else {
          navigate(task.screen, params);
        }
        return;
      }
      setConfirmed(prev => {
        const next = new Set(prev);
        if (next.has(task.id)) {
          next.delete(task.id);
        } else {
          next.add(task.id);
        }
        return next;
      });
    },
    [submitted, navigation, residence.id],
  );

  const submit = useCallback(() => {
    if (!canSubmit) {
      return;
    }
    setSubmitted(true);
    Alert.alert(
      'Check-In Submitted',
      `Welcome to ${residence.name}. Your property manager will confirm your move-in shortly.`,
    );
  }, [canSubmit, residence.name]);

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
    summary: CHECK_IN_SUMMARY,
    tasks: CHECK_IN_TASKS,
    neighborhood: NEIGHBORHOOD,
    radius: NEIGHBORHOOD_RADIUS,
    placeTab,
    setPlaceTab,
    curated: { ...CURATED_LIVING, body: `${residence.name} ${CURATED_LIVING.body}` },
    confirmed,
    done,
    total,
    canSubmit,
    submitted,
    toggleTask,
    submit,
    back,
    openKey: () => soon('Digital Key', 'Your digital key will unlock on move-in day.'),
    openPlace: (place: NeighborhoodPlace) => soon(place.name, 'Directions are coming soon.'),
    openMap: () => soon('Neighborhood Map', 'The map view is coming soon.'),
    openProfile: () => soon('Profile'),
  };
}

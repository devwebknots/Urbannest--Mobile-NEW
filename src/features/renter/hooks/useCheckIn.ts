/**
 * useCheckIn: ViewModel for the move-in check-in page.
 * Tracks which checklist items the renter has confirmed, and submits the
 * check-in once all are done. Digital key, neighborhood and profile
 * actions show "coming soon" for now.
 */

import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { goBack } from '@/navigation/navigationRef';
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
}

const soon = (title: string, message = 'Coming soon.') => Alert.alert(title, message);

export function useCheckIn(residenceId?: string, navigation?: CheckInNavigation) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const [confirmed, setConfirmed] = useState<ReadonlySet<string>>(() => new Set());
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
    [submitted],
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

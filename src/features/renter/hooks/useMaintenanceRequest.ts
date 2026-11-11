/**
 * useMaintenanceRequest: ViewModel for the "Maintenance Request" form
 * (opened by "+ Request" on the Maintenance page).
 *  - category tile, problem title, location (room of this home, picked
 *    in a bottom sheet), detailed description (max 500), photos / videos
 *  - "Describe by Voice" is not built yet: shows "coming soon"
 *  - Submit is enabled once category, problem and location are set; it
 *    confirms in the app dialog and goes back to the Maintenance page
 *  - leaving with unsaved input asks first
 */

import { useCallback, useMemo, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import {
  INSPECTION_AREAS,
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_DESCRIPTION_MAX,
  MAINTENANCE_REQUEST_HERO,
  MAX_ISSUE_MEDIA,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';
import type { IssueMedia } from '../types';
import { useMediaPicker } from './useMediaPicker';

export interface MaintenanceRequestNavigation {
  goBack: () => void;
}

export function useMaintenanceRequest(
  residenceId?: string,
  navigation?: MaintenanceRequestNavigation,
) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const [categoryId, setCategoryId] = useState<string>();
  const [problem, setProblem] = useState('');
  const [locationId, setLocationId] = useState<string>();
  const [locationOpen, setLocationOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<readonly IssueMedia[]>([]);

  // Rooms of this home, e.g. "Kitchen, Suite 402"
  const locations = useMemo(
    () => INSPECTION_AREAS.map(a => ({ id: a.id, label: `${a.label}, ${residence.unit}` })),
    [residence.unit],
  );
  const locationLabel = locations.find(l => l.id === locationId)?.label;

  const dirty =
    Boolean(categoryId) ||
    problem.trim().length > 0 ||
    Boolean(locationId) ||
    description.trim().length > 0 ||
    media.length > 0;
  const canSubmit = Boolean(categoryId) && problem.trim().length > 0 && Boolean(locationId);

  const leave = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const back = useCallback(() => {
    if (!dirty) {
      leave();
      return;
    }
    showDialog({
      tone: 'warning',
      title: 'Discard this request?',
      message: 'What you have entered will be lost.',
      actions: [
        { label: 'Discard', variant: 'danger', onPress: leave },
        { label: 'Keep Editing', variant: 'link' },
      ],
    });
  }, [dirty, leave, showDialog]);

  const selectLocation = useCallback((id: string) => {
    setLocationId(id);
    setLocationOpen(false);
  }, []);

  const onPickMedia = useCallback((picked: readonly IssueMedia[]) => {
    setMedia(list => [...list, ...picked].slice(0, MAX_ISSUE_MEDIA));
  }, []);
  const addMedia = useMediaPicker({
    count: media.length,
    max: MAX_ISSUE_MEDIA,
    limitLabel: 'per request',
    showDialog,
    onPick: onPickMedia,
  });
  const removeMedia = useCallback((index: number) => {
    setMedia(list => list.filter((_, i) => i !== index));
  }, []);

  const recordVoice = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Describe by Voice',
        message: 'Voice notes are coming soon. Please type the details for now.',
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [showDialog],
  );

  const submit = useCallback(() => {
    if (!canSubmit) {
      return;
    }
    const category = MAINTENANCE_CATEGORIES.find(c => c.id === categoryId)?.label ?? '';
    showDialog({
      tone: 'info',
      title: 'Request submitted',
      message: `${problem.trim()} (${category}) in ${locationLabel}. Our team will get back to you shortly.`,
      actions: [{ label: 'Done', variant: 'brand', onPress: leave }],
    });
  }, [canSubmit, categoryId, problem, locationLabel, leave, showDialog]);

  return {
    profile: RENTER_PROFILE,
    heroImage: MAINTENANCE_REQUEST_HERO,
    categories: MAINTENANCE_CATEGORIES,
    categoryId,
    selectCategory: setCategoryId,
    problem,
    setProblem,
    locations,
    locationId,
    locationLabel,
    locationOpen,
    openLocation: () => setLocationOpen(true),
    closeLocation: () => setLocationOpen(false),
    selectLocation,
    description,
    setDescription,
    descriptionMax: MAINTENANCE_DESCRIPTION_MAX,
    media,
    maxMedia: MAX_ISSUE_MEDIA,
    addMedia,
    removeMedia,
    recordVoice,
    canSubmit,
    submit,
    back,
    openProfile: () =>
      showDialog({ tone: 'info', title: 'Profile', message: 'Coming soon.', actions: [{ label: 'OK' }] }),
    dialog: dialog.props,
  };
}

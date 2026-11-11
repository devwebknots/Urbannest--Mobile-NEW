/**
 * useMaintenanceRequest: ViewModel for the "Maintenance Request" form
 * (opened by "+ Request" on the Maintenance page).
 *  - category tile (fills the problem title, e.g. "Plumbing issue", unless
 *    the user typed their own), problem title, location (room of this home, picked
 *    in a bottom sheet), detailed description (max 500), photos / videos
 *  - "Describe by Voice": one voice note (useVoiceNote: record up to 2 min,
 *    play back, delete); photos / videos via the shared useMediaPicker
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
import { useVoiceNote } from './useVoiceNote';

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
  // "Describe by Voice": record / play / delete one voice note
  const voice = useVoiceNote(showDialog);

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
    media.length > 0 ||
    voice.status !== 'idle';
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

  // Picking a category fills "Problem" with its title ("Plumbing issue").
  // Switching category swaps it, but text the user typed is never replaced.
  const selectCategory = useCallback((id: string) => {
    setCategoryId(id);
    const next = MAINTENANCE_CATEGORIES.find(c => c.id === id)?.problem;
    if (!next) {
      return;
    }
    setProblem(current => {
      const text = current.trim();
      const untouched = text === '' || MAINTENANCE_CATEGORIES.some(c => c.problem === text);
      return untouched ? next : current;
    });
  }, []);

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

  // Tap a thumbnail: full-screen photo / play the video
  const [preview, setPreview] = useState<IssueMedia | null>(null);
  const closePreview = useCallback(() => setPreview(null), []);

  const submit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }
    // Still recording: keep what was said so far
    if (voice.status === 'recording') {
      await voice.stop();
    }
    const category = MAINTENANCE_CATEGORIES.find(c => c.id === categoryId)?.label ?? '';
    const extras = [
      media.length > 0 ? `${media.length} photo${media.length > 1 ? 's / videos' : ' / video'}` : '',
      voice.note || voice.status === 'recording' ? 'a voice note' : '',
    ].filter(Boolean);
    showDialog({
      tone: 'info',
      title: 'Request submitted',
      message: `${problem.trim()} (${category}) in ${locationLabel}${
        extras.length ? `, with ${extras.join(' and ')}` : ''
      }. Our team will get back to you shortly.`,
      actions: [{ label: 'Done', variant: 'brand', onPress: leave }],
    });
  }, [canSubmit, voice, categoryId, media.length, problem, locationLabel, leave, showDialog]);

  return {
    profile: RENTER_PROFILE,
    heroImage: MAINTENANCE_REQUEST_HERO,
    categories: MAINTENANCE_CATEGORIES,
    categoryId,
    selectCategory,
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
    preview,
    openPreview: setPreview,
    closePreview,
    voice,
    canSubmit,
    submit,
    back,
    openProfile: () =>
      showDialog({ tone: 'info', title: 'Profile', message: 'Coming soon.', actions: [{ label: 'OK' }] }),
    dialog: dialog.props,
  };
}

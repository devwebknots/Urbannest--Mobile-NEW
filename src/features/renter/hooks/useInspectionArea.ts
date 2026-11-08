/**
 * useInspectionArea: ViewModel for one area's inspection page (e.g. Living
 * Room). The same page serves every area; the area comes in by id.
 *
 * Flow: the renter picks "All good" or "Report issues". Reporting opens a
 * new-issue form (category from a dropdown, description, optional photos /
 * videos). "Add Issue" puts it in the list; "Add another issue" opens the
 * form again. Save is enabled once the area is all good or has at least
 * one issue; it stores the result (inspectionAreaStore) and returns to the
 * Inspection page, which then shows the area as completed.
 *
 * The room stepper lists every area (done / current / to do); tapping one
 * jumps to it. Leaving or jumping with unsaved changes asks first.
 */

import { createElement, useCallback, useMemo, useState } from 'react';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useAppDialog } from '@/components/AppDialog';
import { UploadIcon, VideoCameraIcon } from '@/components/icons';
import { colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { goBack, navigate } from '@/navigation/navigationRef';
import {
  INSPECTION_AREAS,
  ISSUE_CATEGORIES,
  MAX_ISSUE_MEDIA,
  RENTER_PROFILE,
  RESIDENCES,
} from '../constants';
import { inspectionAreaStore, useInspectionAreaStore } from '../store/inspectionAreaStore';
import type { AreaStatus, InspectionIssue, IssueMedia } from '../types';
import type { InspectionNavigation } from './useInspection';

interface Draft {
  categoryId?: string;
  description: string;
  media: readonly IssueMedia[];
}

const EMPTY_DRAFT: Draft = { description: '', media: [] };
/** Stable empty list, so "unchanged" can be checked by reference */
const NO_ISSUES: readonly InspectionIssue[] = [];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toMedia = (asset: Asset): IssueMedia | null =>
  asset.uri
    ? { uri: asset.uri, type: asset.type?.startsWith('video') ? 'video' : 'photo' }
    : null;

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

  // Start from what was saved last time (if this area was opened before)
  const storeVersion = useInspectionAreaStore();
  const saved = inspectionAreaStore.get(residence.id, area.id);
  const savedStatus = saved?.status ?? 'unset';
  const savedIssues = saved?.issues ?? NO_ISSUES;
  const [status, setStatus] = useState<AreaStatus>(savedStatus);
  const [issues, setIssues] = useState<readonly InspectionIssue[]>(savedIssues);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [categoryOpen, setCategoryOpen] = useState(false);
  // App pop-up for warnings and choices (instead of the system Alert)
  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const draftHasContent =
    Boolean(draft.categoryId) || draft.description.trim().length > 0 || draft.media.length > 0;
  const canAddIssue = Boolean(draft.categoryId) && draft.description.trim().length > 0;
  const canSave = status === 'allGood' || (status === 'issues' && issues.length > 0);
  // Something the renter would lose by leaving now
  const hasUnsaved =
    draftHasContent ||
    issues !== savedIssues ||
    (status !== savedStatus && !(status === 'issues' && issues.length === 0));

  // Room stepper: every area with its done / current state
  const rooms = useMemo(
    () =>
      INSPECTION_AREAS.map(a => ({
        area: a,
        done: inspectionAreaStore.isDone(residence.id, a.id),
        current: a.id === area.id,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [residence.id, area.id, storeVersion],
  );

  const resetDraft = () => setDraft(EMPTY_DRAFT);

  /* ---------- All good / Report issues ---------- */

  const markAllGood = useCallback(() => {
    const apply = () => {
      setStatus('allGood');
      setIssues([]);
      setFormOpen(false);
      setDraft(EMPTY_DRAFT);
    };
    if (issues.length > 0 || draftHasContent) {
      showDialog({
        tone: 'warning',
        title: 'Mark as all good?',
        message: 'This removes the issues you added for this area.',
        actions: [
          { label: 'Yes, Mark All Good', variant: 'danger', onPress: apply },
          { label: 'Keep My Issues', variant: 'link' },
        ],
      });
    } else {
      apply();
    }
  }, [issues.length, draftHasContent, showDialog]);

  const reportIssues = useCallback(() => {
    setStatus('issues');
    if (issues.length === 0) {
      setFormOpen(true);
    }
  }, [issues.length]);

  /* ---------- New issue form ---------- */

  const selectCategory = useCallback((categoryId: string) => {
    setDraft(d => ({ ...d, categoryId }));
    setCategoryOpen(false);
  }, []);

  const setDescription = useCallback((description: string) => {
    setDraft(d => ({ ...d, description }));
  }, []);

  const addMediaFrom = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      showDialog({
        tone: 'warning',
        title: 'Could not add file',
        message: response.errorMessage ?? 'Please try again.',
        actions: [{ label: 'OK' }],
      });
      return;
    }
    const picked = (response.assets ?? []).map(toMedia).filter((m): m is IssueMedia => m !== null);
    setDraft(d => ({ ...d, media: [...d.media, ...picked].slice(0, MAX_ISSUE_MEDIA) }));
  }, [showDialog]);

  const addMedia = useCallback(
    (type: 'photo' | 'video') => {
      const left = MAX_ISSUE_MEDIA - draft.media.length;
      if (left <= 0) {
        showDialog({
          tone: 'info',
          title: 'Limit reached',
          message: `You can add up to ${MAX_ISSUE_MEDIA} photos or videos per issue.`,
          actions: [{ label: 'OK' }],
        });
        return;
      }
      const isVideo = type === 'video';
      const camera = isVideo
        ? { mediaType: 'video' as const, videoQuality: 'medium' as const, durationLimit: 60 }
        : { mediaType: 'photo' as const, quality: 0.8 as const, maxWidth: 1600, maxHeight: 1600 };
      showDialog({
        tone: 'info',
        icon: createElement(isVideo ? VideoCameraIcon : UploadIcon, {
          size: ms(22),
          color: colors.navy,
        }),
        title: isVideo ? 'Add a video' : 'Add a photo',
        message: isVideo ? 'Record a short clip (up to 60s) or pick one.' : 'Take a new photo or pick one.',
        actions: [
          {
            label: isVideo ? 'Record Video' : 'Take Photo',
            onPress: () => launchCamera(camera).then(addMediaFrom),
          },
          {
            label: 'Choose from Library',
            variant: 'soft',
            onPress: () => launchImageLibrary({ ...camera, selectionLimit: left }).then(addMediaFrom),
          },
          { label: 'Cancel', variant: 'link' },
        ],
      });
    },
    [draft.media.length, addMediaFrom, showDialog],
  );

  const removeMedia = useCallback((index: number) => {
    setDraft(d => ({ ...d, media: d.media.filter((_, i) => i !== index) }));
  }, []);

  const addIssue = useCallback(() => {
    if (!canAddIssue || !draft.categoryId) {
      return;
    }
    const issue: InspectionIssue = {
      id: newId(),
      categoryId: draft.categoryId,
      description: draft.description.trim(),
      media: draft.media,
    };
    setIssues(list => [...list, issue]);
    setDraft(EMPTY_DRAFT);
    setFormOpen(false);
  }, [canAddIssue, draft]);

  const startAnotherIssue = useCallback(() => setFormOpen(true), []);

  const cancelIssue = useCallback(() => {
    resetDraft();
    setFormOpen(false);
  }, []);

  const removeIssue = useCallback((id: string) => {
    setIssues(list => {
      const next = list.filter(i => i.id !== id);
      if (next.length === 0) {
        setFormOpen(true);
      }
      return next;
    });
  }, []);

  /* ---------- Save / back ---------- */

  const save = useCallback(() => {
    if (!canSave) {
      return;
    }
    const finish = () => {
      inspectionAreaStore.save(residence.id, area.id, { status, issues });
      const params = { residenceId: residence.id };
      if (navigation?.navigate) {
        navigation.navigate({ name: 'Inspection', params, merge: true });
      } else {
        navigate('Inspection', params);
      }
    };
    // Don't silently drop a half-filled issue
    if (formOpen && draftHasContent) {
      showDialog({
        tone: 'warning',
        title: 'Discard this issue?',
        message: "The issue you're writing hasn't been added yet. Add it first, or discard it and save.",
        actions: [
          { label: 'Discard & Save', variant: 'danger', onPress: finish },
          { label: 'Keep Editing', variant: 'link' },
        ],
      });
      return;
    }
    finish();
  }, [
    canSave,
    formOpen,
    draftHasContent,
    residence.id,
    area.id,
    status,
    issues,
    navigation,
    showDialog,
  ]);

  /** Runs `leave` now, or after confirming when there are unsaved changes */
  const confirmLeave = useCallback(
    (leave: () => void) => {
      if (!hasUnsaved) {
        leave();
        return;
      }
      showDialog({
        tone: 'warning',
        title: 'Leave without saving?',
        message: `Your changes to the ${area.label} haven't been saved yet.`,
        actions: [
          { label: 'Leave Without Saving', variant: 'danger', onPress: leave },
          { label: 'Stay', variant: 'link' },
        ],
      });
    },
    [hasUnsaved, showDialog, area.label],
  );

  const back = useCallback(() => {
    confirmLeave(() => {
      if (navigation?.goBack) {
        navigation.goBack();
      } else {
        goBack();
      }
    });
  }, [confirmLeave, navigation]);

  /** Room stepper: open another area on this same page */
  const jumpTo = useCallback(
    (targetId: string) => {
      if (targetId === area.id) {
        return;
      }
      confirmLeave(() => {
        const params = { residenceId: residence.id, areaId: targetId };
        if (navigation?.navigate) {
          navigation.navigate({ name: 'InspectionArea', params });
        } else {
          navigate('InspectionArea', params);
        }
      });
    },
    [area.id, confirmLeave, navigation, residence.id],
  );

  const categoryLabel = useCallback(
    (id?: string) => ISSUE_CATEGORIES.find(c => c.id === id)?.label,
    [],
  );

  return {
    profile: RENTER_PROFILE,
    residence,
    area,
    step,
    total: INSPECTION_AREAS.length,
    categories: ISSUE_CATEGORIES,
    maxMedia: MAX_ISSUE_MEDIA,
    status,
    issues,
    formOpen,
    draft,
    categoryOpen,
    canAddIssue,
    canSave,
    categoryLabel,
    markAllGood,
    reportIssues,
    openCategory: () => setCategoryOpen(true),
    closeCategory: () => setCategoryOpen(false),
    selectCategory,
    setDescription,
    addMedia,
    removeMedia,
    addIssue,
    startAnotherIssue,
    cancelIssue,
    removeIssue,
    save,
    back,
    rooms,
    jumpTo,
    openProfile: () =>
      showDialog({ tone: 'info', title: 'Profile', message: 'Coming soon.', actions: [{ label: 'OK' }] }),
    dialog: dialog.props,
  };
}

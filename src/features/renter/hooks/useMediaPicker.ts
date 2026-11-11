/**
 * useMediaPicker: shared "add a photo / video" flow (camera or library)
 * for forms with evidence (inspection issues, maintenance requests).
 * Shows the choice in the app dialog, enforces a limit, reports errors,
 * and hands the picked files to `onPick`.
 */

import { createElement, useCallback } from 'react';
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import type { AppDialogConfig } from '@/components/AppDialog';
import { UploadIcon, VideoCameraIcon } from '@/components/icons';
import { colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { IssueMedia } from '../types';

const toMedia = (asset: Asset): IssueMedia | null =>
  asset.uri
    ? { uri: asset.uri, type: asset.type?.startsWith('video') ? 'video' : 'photo' }
    : null;

interface Options {
  /** Files already added */
  count: number;
  /** Most files allowed */
  max: number;
  /** "per issue", "per request": used in the limit message */
  limitLabel: string;
  showDialog: (config: AppDialogConfig) => void;
  onPick: (media: readonly IssueMedia[]) => void;
}

export function useMediaPicker({ count, max, limitLabel, showDialog, onPick }: Options) {
  const handle = useCallback(
    (response: ImagePickerResponse) => {
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
      const picked = (response.assets ?? [])
        .map(toMedia)
        .filter((m): m is IssueMedia => m !== null);
      onPick(picked);
    },
    [showDialog, onPick],
  );

  return useCallback(
    (type: 'photo' | 'video') => {
      const left = max - count;
      if (left <= 0) {
        showDialog({
          tone: 'info',
          title: 'Limit reached',
          message: `You can add up to ${max} photos or videos ${limitLabel}.`,
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
            onPress: () => launchCamera(camera).then(handle),
          },
          {
            label: 'Choose from Library',
            variant: 'soft',
            onPress: () => launchImageLibrary({ ...camera, selectionLimit: left }).then(handle),
          },
          { label: 'Cancel', variant: 'link' },
        ],
      });
    },
    [count, max, limitLabel, handle, showDialog],
  );
}

/**
 * useApplicationDetails: one application, opened from an Application Status
 * card. Summary facts (ID, applied date, unit, rooms), photo gallery, the
 * "Current Status" card and the "Application Journey" steps with their
 * state (done / current / upcoming), all derived from the status.
 * Journey rows and ⋮ open AppDialogs (step pages aren't built yet);
 * drafts can be continued from ⋮.
 */

import { useCallback, useMemo } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import { renterAssets } from '@/features/renter/assets/renterAssets';
import { APPLICATION_JOURNEY, APPLICATION_PROGRESS } from '../constants';
import type { ApplicationRecord, JourneyState, JourneyStep } from '../types';

export interface ApplicationDetailsNavigation {
  goBack: () => void;
  navigate?: {
    (route: 'GuestHome'): void;
    (route: 'RentalApplication', params: { propertyId: string }): void;
  };
}

export interface JourneyRow extends JourneyStep {
  readonly state: JourneyState;
  /** Done steps: when it happened ("Oct 24, 2023") */
  readonly date?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** MM/DD/YYYY -> "Dec 16, 2024" */
const longDate = (mdY: string) => {
  const [m, d, y] = mdY.split('/').map(Number);
  return m && d && y ? `${MONTHS[m - 1]} ${d}, ${y}` : mdY;
};

/** "Unit A 13.A • Room A1, A3" -> the part after `key` */
const unitPart = (unit: string, key: 'Unit' | 'Room') =>
  unit
    .split('•')
    .map(s => s.trim())
    .find(s => s.startsWith(`${key} `))
    ?.slice(key.length + 1);

const STATE_LABEL: Record<JourneyState, string> = {
  done: 'Completed',
  current: 'In progress',
  upcoming: 'Upcoming',
};

/** Gallery photos besides the application's own */
const EXTRA_PHOTOS = [renterAssets.sterling, renterAssets.azure, renterAssets.marble];

export function useApplicationDetails(
  record: ApplicationRecord,
  navigation?: ApplicationDetailsNavigation,
) {
  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const progress = APPLICATION_PROGRESS[record.status];
  const appliedOn = longDate(record.appliedOn);

  const facts = useMemo(
    () => [
      { id: 'id', icon: 'fileText' as const, label: 'Application ID', value: `#${record.id}` },
      { id: 'date', icon: 'calendar' as const, label: 'Applied On', value: appliedOn },
      {
        id: 'unit',
        icon: 'document' as const,
        label: 'Unit',
        value: record.unitNo ?? unitPart(record.unit, 'Unit') ?? '—',
      },
      // Room row hidden for now (single-family homes)
      // {
      //   id: 'room',
      //   icon: 'bed' as const,
      //   label: 'Room',
      //   value: record.rooms ?? unitPart(record.unit, 'Room') ?? '—',
      // },
    ],
    [appliedOn, record],
  );

  // Three photos: the application's own first
  const photos = useMemo(
    () => [record.image, ...EXTRA_PHOTOS.filter(p => p !== record.image)].slice(0, 3),
    [record.image],
  );

  const journey = useMemo<JourneyRow[]>(
    () =>
      APPLICATION_JOURNEY.map((step, i) => {
        const state: JourneyState =
          i < progress.step ? 'done' : i === progress.step ? 'current' : 'upcoming';
        let detail = step.detail.replace('{date}', appliedOn);
        if (step.id === 'submitted' && record.status === 'draft') {
          detail = 'Not submitted yet.';
        } else if (step.id === 'status') {
          detail = progress.statusDetail;
        }
        // Only the submission has a known date for now
        const date = state === 'done' && step.id === 'submitted' ? appliedOn : undefined;
        return { ...step, detail, state, date };
      }),
    [appliedOn, progress, record.status],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const go = useCallback(
    (route: 'GuestHome' | 'RentalApplication', propertyId?: string) => {
      if (route === 'RentalApplication' && propertyId) {
        if (navigation?.navigate) {
          navigation.navigate('RentalApplication', { propertyId });
        } else {
          navigate('RentalApplication', { propertyId });
        }
      } else if (navigation?.navigate) {
        navigation.navigate('GuestHome');
      } else {
        navigate('GuestHome');
      }
    },
    [navigation],
  );

  const openStep = useCallback(
    (row: JourneyRow) =>
      showDialog({
        tone: 'info',
        title: row.title,
        message: row.id === 'status' && row.state === 'current' ? progress.message : row.detail,
        details: [{ label: 'Step', value: STATE_LABEL[row.state] }],
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [progress.message, showDialog],
  );

  const more = useCallback(() => {
    const draftId = record.status === 'draft' ? record.propertyId : undefined;
    showDialog({
      tone: 'info',
      title: record.propertyName,
      reference: `Application ${record.id}`,
      message: draftId
        ? 'Pick up where you left off and submit your application.'
        : 'Looking for another home? Browse listings and apply in a few steps.',
      actions: [
        draftId
          ? { label: 'Continue Application', onPress: () => go('RentalApplication', draftId) }
          : { label: 'Browse Homes', onPress: () => go('GuestHome') },
        { label: 'Close', variant: 'link' },
      ],
    });
  }, [go, record, showDialog]);

  return {
    record,
    facts,
    photos,
    progress,
    journey,
    back,
    more,
    openStep,
    dialog: dialog.props,
  };
}

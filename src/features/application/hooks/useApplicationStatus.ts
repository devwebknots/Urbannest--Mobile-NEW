/**
 * useApplicationStatus: the Application Status page ("Track Application
 * Status" after submitting). Lists the user's applications (the design's
 * samples, plus the one just sent at the top), filter chips with counts,
 * sort (filter button). Tapping an application opens Application Details.
 */

import { useCallback, useMemo, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack, navigate } from '@/navigation/navigationRef';
import { GUEST_LISTINGS } from '@/features/guest/hooks/usePropertyDetails';
import { renterAssets } from '@/features/renter/assets/renterAssets';
import {
  APPLICATION_FILTERS,
  APPLICATION_RECORDS,
  APPLICATION_STATUS_META,
} from '../constants';
import type { ApplicationFilterId, ApplicationRecord } from '../types';

export interface ApplicationStatusNavigation {
  goBack: () => void;
  navigate?: {
    (route: 'GuestHome'): void;
    (route: 'ApplicationDetails', params: { record: ApplicationRecord }): void;
  };
}

export type ApplicationSort = 'newest' | 'oldest' | 'name';

export const SORT_OPTIONS: readonly { id: ApplicationSort; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'name', label: 'Property name (A–Z)' },
];

/** MM/DD/YYYY -> sortable number */
const dayValue = (mdY: string) => {
  const [m, d, y] = mdY.split('/').map(Number);
  return (y || 0) * 10000 + (m || 0) * 100 + (d || 0);
};

const toMdY = (time: number) => {
  const d = new Date(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
};

export function useApplicationStatus(
  params: { propertyId?: string; applicationId?: string; submittedAt?: number } | undefined,
  navigation?: ApplicationStatusNavigation,
) {
  const dialog = useAppDialog();
  const showDialog = dialog.show;
  const [filter, setFilter] = useState<ApplicationFilterId>('all');
  const [sort, setSort] = useState<ApplicationSort>('newest');
  const [sortOpen, setSortOpen] = useState(false);

  // The application just sent goes first (mock until the API lists it)
  const records = useMemo<ApplicationRecord[]>(() => {
    if (!params?.applicationId) {
      return [...APPLICATION_RECORDS];
    }
    const listing =
      GUEST_LISTINGS.find(l => l.id === params.propertyId) ?? GUEST_LISTINGS[0];
    return [
      {
        id: params.applicationId,
        propertyName: listing.name,
        unit: `${listing.beds} • ${listing.baths}`,
        appliedOn: toMdY(params.submittedAt ?? Date.now()),
        status: 'submitted',
        image: typeof listing.image === 'number' ? listing.image : renterAssets.sterling,
        category: 'Single Family',
      },
      ...APPLICATION_RECORDS,
    ];
  }, [params?.applicationId, params?.propertyId, params?.submittedAt]);

  const counts = useMemo(() => {
    const c: Record<ApplicationFilterId, number> = {
      all: records.length,
      draft: 0,
      progress: 0,
      approved: 0,
      waiting: 0,
      rejected: 0,
      incomplete: 0,
    };
    records.forEach(r => {
      c[APPLICATION_STATUS_META[r.status].filter] += 1;
    });
    return c;
  }, [records]);

  const visible = useMemo(() => {
    const list = records.filter(
      r => filter === 'all' || APPLICATION_STATUS_META[r.status].filter === filter,
    );
    const justSent = params?.applicationId;
    return list.sort((a, b) => {
      // Keep the one just sent on top while sorting by date
      if (sort !== 'name' && justSent) {
        if (a.id === justSent) {
          return -1;
        }
        if (b.id === justSent) {
          return 1;
        }
      }
      if (sort === 'name') {
        return a.propertyName.localeCompare(b.propertyName);
      }
      const diff = dayValue(b.appliedOn) - dayValue(a.appliedOn);
      return sort === 'newest' ? diff : -diff;
    });
  }, [filter, params?.applicationId, records, sort]);

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  /** Card tap: the Application Details page (drafts continue from its ⋮) */
  const open = useCallback(
    (record: ApplicationRecord) => {
      if (navigation?.navigate) {
        navigation.navigate('ApplicationDetails', { record });
      } else {
        navigate('ApplicationDetails', { record });
      }
    },
    [navigation],
  );

  const more = useCallback(
    () =>
      showDialog({
        tone: 'info',
        title: 'Rental Applications',
        message: 'Looking for another home? Browse listings and apply in a few steps.',
        actions: [
          {
            label: 'Browse Homes',
            onPress: () =>
              navigation?.navigate ? navigation.navigate('GuestHome') : navigate('GuestHome'),
          },
          { label: 'Close', variant: 'link' },
        ],
      }),
    [navigation, showDialog],
  );

  return {
    filters: APPLICATION_FILTERS,
    filter,
    setFilter,
    counts,
    records: visible,
    sort,
    sortOpen,
    openSort: () => setSortOpen(true),
    closeSort: () => setSortOpen(false),
    pickSort: (id: string) => {
      setSort(id as ApplicationSort);
      setSortOpen(false);
    },
    open,
    more,
    back,
    dialog: dialog.props,
  };
}

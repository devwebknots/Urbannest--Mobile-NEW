/**
 * useMaintenance: ViewModel for the Maintenance page (opened from the
 * Maintenance shortcut on the Manage page). Exposes the (mock)
 * announcements, active tickets, recently resolved list and news.
 * Actions without a page yet show a "coming soon" dialog.
 */

import { useCallback, useMemo, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { goBack } from '@/navigation/navigationRef';
import {
  MAINTENANCE_ANNOUNCEMENTS,
  MAINTENANCE_NEWS,
  MAINTENANCE_TICKETS,
  RENTER_PROFILE,
  RESIDENCES,
  RESOLVED_TICKETS,
} from '../constants';
import type { MaintenanceAnnouncement, MaintenanceNews, MaintenanceTicket } from '../types';

export interface MaintenanceNavigation {
  goBack: () => void;
}

/** News cards shown per page */
const NEWS_PER_PAGE = 2;
const NEWS_PAGES = Math.max(1, Math.ceil(MAINTENANCE_NEWS.length / NEWS_PER_PAGE));

export function useMaintenance(residenceId?: string, navigation?: MaintenanceNavigation) {
  const residence = useMemo(
    () => RESIDENCES.find(r => r.id === residenceId) ?? RESIDENCES[0],
    [residenceId],
  );
  const dialog = useAppDialog();
  const showDialog = dialog.show;

  const soon = useCallback(
    (title: string, message = 'Coming soon.') =>
      showDialog({ tone: 'info', title, message, actions: [{ label: 'OK', variant: 'brand' }] }),
    [showDialog],
  );

  const back = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      goBack();
    }
  }, [navigation]);

  const openTicket = useCallback(
    (ticket: MaintenanceTicket) => soon(ticket.title, `Tracking for ticket #${ticket.id} is coming soon.`),
    [soon],
  );
  const openNews = useCallback((item: MaintenanceNews) => soon(item.title), [soon]);
  const openAnnouncement = useCallback(
    (item: MaintenanceAnnouncement) => soon(item.title, 'Full details are coming soon.'),
    [soon],
  );

  // News & Alerts: two cards at a time, paged with the header arrows
  const [newsPage, setNewsPage] = useState(0);
  const visibleNews = useMemo(
    () => MAINTENANCE_NEWS.slice(newsPage * NEWS_PER_PAGE, (newsPage + 1) * NEWS_PER_PAGE),
    [newsPage],
  );
  const prevNews = useCallback(() => setNewsPage(p => Math.max(0, p - 1)), []);
  const nextNews = useCallback(() => setNewsPage(p => Math.min(NEWS_PAGES - 1, p + 1)), []);

  return {
    profile: RENTER_PROFILE,
    residence,
    announcements: MAINTENANCE_ANNOUNCEMENTS,
    tickets: MAINTENANCE_TICKETS,
    resolved: RESOLVED_TICKETS,
    visibleNews,
    canPrevNews: newsPage > 0,
    canNextNews: newsPage < NEWS_PAGES - 1,
    prevNews,
    nextNews,
    back,
    openAnnouncement,
    openTicket,
    openNews,
    newRequest: () => soon('New Request', 'Raising a maintenance request is coming soon.'),
    seeAllResolved: () => soon('Recently Resolved'),
    openProfile: () => soon('Profile'),
    dialog: dialog.props,
  };
}

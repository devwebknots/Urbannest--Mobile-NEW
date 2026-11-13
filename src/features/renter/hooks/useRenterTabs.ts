/**
 * useRenterTabs: bottom-bar state shared by the renter screens.
 * Homes and Tracking have pages (RenterHomeScreen swaps its body).
 * Tabs without a page yet: the capsule slides there, a "coming soon" note
 * shows once it lands, and closing it glides back to the tab it came from.
 */

import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import type { RenterTab } from '../types';

const TAB_TITLES: Record<RenterTab, string> = {
  residences: 'Homes',
  search: 'Search',
  alerts: 'Alerts',
  tracking: 'Status',
};

/** Tabs that show a page inside RenterHomeScreen */
const hasPage = (tab: RenterTab) => tab === 'residences' || tab === 'tracking';

export function useRenterTabs() {
  const [tab, setTab] = useState<RenterTab>('residences');
  // Last tab with a page: where a "coming soon" tab glides back to
  const pageRef = useRef<RenterTab>('residences');
  const [page, setPage] = useState<RenterTab>('residences');

  const onTabChange = useCallback((next: RenterTab) => {
    setTab(next);
    if (hasPage(next)) {
      pageRef.current = next;
      setPage(next);
      return;
    }
    const back = () => setTab(pageRef.current);
    setTimeout(
      () =>
        Alert.alert(TAB_TITLES[next], 'Coming soon.', [{ text: 'OK', onPress: back }], {
          cancelable: true,
          onDismiss: back,
        }),
      280,
    );
  }, []);

  /** tab: where the capsule is; page: the body on screen (last tab with a page) */
  return { tab, page, onTabChange };
}

/**
 * useRenterTabs: bottom-bar state shared by the renter screens.
 * Tabs without a page yet: the capsule slides there, a "coming soon" note
 * shows once it lands, and closing it glides back to Homes.
 * Calendar opens the Neyora maintenance module (installed SDK).
 */

import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { navigate } from '@/navigation/navigationRef';
import type { RenterTab } from '../types';

const TAB_TITLES: Record<RenterTab, string> = {
  residences: 'Homes',
  search: 'Search',
  alerts: 'Alerts',
  calendar: 'Calendar',
};

export function useRenterTabs() {
  const [tab, setTab] = useState<RenterTab>('residences');

  const onTabChange = useCallback((next: RenterTab) => {
    if (next === 'calendar') {
      // Stays on Homes, so coming back shows Homes selected
      navigate('Neyora');
      return;
    }
    setTab(next);
    if (next === 'residences') {
      return;
    }
    const back = () => setTab('residences');
    setTimeout(
      () =>
        Alert.alert(TAB_TITLES[next], 'Coming soon.', [{ text: 'OK', onPress: back }], {
          cancelable: true,
          onDismiss: back,
        }),
      280,
    );
  }, []);

  return { tab, onTabChange };
}

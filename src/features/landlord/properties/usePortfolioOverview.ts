/**
 * usePortfolioOverview: ViewModel for the landlord "Portfolio Overview"
 * (Properties tab). No properties yet: zero stats, the "No properties
 * found" card and an empty unit activity list. Add Property (card button)
 * opens the Add New Property form.
 */

import { useCallback, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { navigationRef } from '@/navigation/navigationRef';

export type PropertyFilterId = 'all' | 'active' | 'highOccupancy' | 'attention';

export const PROPERTY_FILTERS: readonly { id: PropertyFilterId; label: string }[] = [
  { id: 'all', label: 'All Properties' },
  { id: 'active', label: 'Active' },
  { id: 'highOccupancy', label: 'High Occupancy' },
  { id: 'attention', label: 'Needs Attention' },
];

/** Portfolio numbers (all zero until the first property is added) */
export const PORTFOLIO_SUMMARY = {
  totalProperties: 0,
  totalUnits: 0,
  avgOccupancy: 0,
  rentThisMonth: 0,
};

export function usePortfolioOverview(navigation?: { goBack: () => void }) {
  const [filter, setFilter] = useState<PropertyFilterId>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dialog = useAppDialog();
  const { show } = dialog;

  const comingSoon = useCallback(
    (title: string) =>
      show({
        tone: 'info',
        title,
        message: 'This section is coming soon.',
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [show],
  );

  const goBack = useCallback(() => {
    if (navigation?.goBack) {
      navigation.goBack();
    } else if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }, [navigation]);

  const addProperty = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('LandlordAddProperty');
    }
  }, []);

  return {
    summary: PORTFOLIO_SUMMARY,
    filters: PROPERTY_FILTERS,
    filter,
    setFilter,
    searchOpen,
    toggleSearch: () => setSearchOpen(open => !open),
    query,
    setQuery,
    addProperty,
    viewAllUnits: () => comingSoon('All Units'),
    goBack,
    dialog,
  };
}

/**
 * usePortfolioOverview: ViewModel for the landlord "Portfolio Overview"
 * (Properties tab).
 *  - empty portfolio: zero stats, the "No properties found" card (Add
 *    Property opens the Add New Property form)
 *  - after the demo flow (Add Property → Unit → "Save Unit & Send Invite",
 *    portfolioStore): the design's sample Managed Assets (Test Property,
 *    Idex 5, Idex4), filter chips + search, "+ Add New Property"
 * View Property / View Units / ⋯ open a "coming soon" dialog for now.
 */

import { useCallback, useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { navigationRef } from '@/navigation/navigationRef';
import { landlordAssets } from '../assets/landlordAssets';
import { usePortfolioPopulated } from '../store/portfolioStore';

export type PropertyFilterId = 'all' | 'active' | 'highOccupancy' | 'attention';

export const PROPERTY_FILTERS: readonly { id: PropertyFilterId; label: string }[] = [
  { id: 'all', label: 'All Properties' },
  { id: 'active', label: 'Active' },
  { id: 'highOccupancy', label: 'High Occupancy' },
  { id: 'attention', label: 'Needs Attention' },
];

/** Who manages it: "SELF" (owner) or "PM - ACTIVE" (property manager) */
export type ManagedBy = 'self' | 'pm';

export interface ManagedAsset {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly address: string;
  readonly city: string;
  readonly managedBy: ManagedBy;
  readonly units: number;
  readonly occupancy: number;
  readonly maintenanceOpen: number;
  readonly renewalsUpcoming: number;
  readonly photo: ImageSourcePropType;
}

/** The design's sample portfolio (shown after the demo flow) */
export const SAMPLE_ASSETS: readonly ManagedAsset[] = [
  {
    id: 'test',
    name: 'Test Property',
    type: 'Apartment',
    address: '1200 Overcup Oak, Centerton, US',
    city: 'Centerton',
    managedBy: 'self',
    units: 0,
    occupancy: 0,
    maintenanceOpen: 0,
    renewalsUpcoming: 0,
    photo: landlordAssets.sampleDusk,
  },
  {
    id: 'idex5',
    name: 'Idex 5',
    type: 'Apartment',
    address: '1471 Overcup Oak ln, Bentonville, US',
    city: 'Bentonville',
    managedBy: 'self',
    units: 3,
    occupancy: 0,
    maintenanceOpen: 0,
    renewalsUpcoming: 0,
    photo: landlordAssets.sampleSterling,
  },
  {
    id: 'idex4',
    name: 'Idex4',
    type: 'Apartment',
    address: '1492 Overcup Oak ln, Bentonville, US',
    city: 'Bentonville',
    managedBy: 'pm',
    units: 2,
    occupancy: 0,
    maintenanceOpen: 0,
    renewalsUpcoming: 0,
    photo: landlordAssets.headerBuilding,
  },
];

/** Portfolio numbers before any property is added */
export const PORTFOLIO_SUMMARY = {
  totalProperties: 0,
  totalUnits: 0,
  avgOccupancy: 0,
  rentThisMonth: 0,
};

/** Which filter chip shows which assets */
const matchesFilter = (a: ManagedAsset, f: PropertyFilterId) => {
  switch (f) {
    case 'active':
      return a.units > 0;
    case 'highOccupancy':
      return a.occupancy >= 80;
    case 'attention':
      return a.maintenanceOpen > 0;
    default:
      return true;
  }
};

export function usePortfolioOverview(navigation?: { goBack: () => void }) {
  const populated = usePortfolioPopulated();
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

  const assets = useMemo(() => {
    if (!populated) {
      return [];
    }
    const q = query.trim().toLowerCase();
    return SAMPLE_ASSETS.filter(
      a =>
        matchesFilter(a, filter) &&
        (!q || a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q)),
    );
  }, [populated, filter, query]);

  const summary = useMemo(
    () =>
      populated
        ? {
            totalProperties: SAMPLE_ASSETS.length,
            totalUnits: SAMPLE_ASSETS.reduce((n, a) => n + a.units, 0),
            avgOccupancy: 0,
            rentThisMonth: 0,
          }
        : PORTFOLIO_SUMMARY,
    [populated],
  );

  return {
    populated,
    assets,
    summary,
    filters: PROPERTY_FILTERS,
    filter,
    setFilter,
    searchOpen,
    toggleSearch: () => setSearchOpen(open => !open),
    query,
    setQuery,
    addProperty,
    viewProperty: (a: ManagedAsset) => comingSoon(a.name),
    viewUnits: (a: ManagedAsset) => comingSoon(`${a.name} Units`),
    propertyMenu: (a: ManagedAsset) => comingSoon(`${a.name} options`),
    viewAllUnits: () => comingSoon('All Units'),
    goBack,
    dialog,
  };
}

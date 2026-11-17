/**
 * useUnitDetails: ViewModel for the landlord "Unit Details" page, opened by
 * "View Unit" (or the unit card) on Property Details. Sample data follows
 * the "Unit Details" design (Unit 101 in LL01, vacant, $1,110 / mo); the
 * property name comes from the opened property. Every action opens a
 * "coming soon" AppDialog for now; replace with the backend API later.
 */

import { useCallback, useMemo, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { useAppDialog } from '@/components/AppDialog';
import { colors } from '@/config/theme';
import { applicationIcons } from '@/features/application/assets/applicationAssets';
import { renterIcons } from '@/features/renter/assets/renterAssets';
import { navigationRef } from '@/navigation/navigationRef';
import { amenityIcons, landlordAssets, landlordIcons, unitIcons } from '../assets/landlordAssets';
import { SAMPLE_ASSETS } from './usePortfolioOverview';

export interface UnitStat {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly icon: ImageSourcePropType;
}

export interface UnitFact {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  /** How the value is drawn: plain text, green pill, or blue dot + text */
  readonly kind?: 'text' | 'pill' | 'dot';
}

export interface UnitChip {
  readonly id: string;
  readonly label: string;
  readonly icon: ImageSourcePropType;
  readonly tint: string;
  readonly tile: string;
}

export interface UnitRow {
  readonly id: string;
  readonly title: string;
  /** Short label under a Quick Action tile */
  readonly short?: string;
  readonly subtitle?: string;
  readonly icon: ImageSourcePropType;
  readonly tint: string;
  readonly tile: string;
}

export type PeopleTab = 'current' | 'past';

/** A tenant or owner row (Tenant / Owner sections) */
export interface UnitPerson {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly detail: string;
}

/** Sample people per tab (dummy data for viewing) */
const TENANTS: Record<PeopleTab, readonly UnitPerson[]> = {
  current: [
    {
      id: 't-arjun',
      initials: 'AR',
      name: 'Arjun Rao',
      detail: 'Lease signed  •  Moves in Dec 1, 2026',
    },
  ],
  past: [
    {
      id: 't-maya',
      initials: 'MP',
      name: 'Maya Patel',
      detail: 'Jan 2025 – Oct 2026  •  Moved out',
    },
    {
      id: 't-daniel',
      initials: 'DC',
      name: 'Daniel Cruz',
      detail: 'Mar 2023 – Dec 2024  •  Moved out',
    },
  ],
};

const OWNERS: Record<PeopleTab, readonly UnitPerson[]> = {
  current: [
    { id: 'o-nan', initials: 'NW', name: 'Nan webknots', detail: 'Primary Owner  •  100%' },
  ],
  past: [
    {
      id: 'o-hill',
      initials: 'HE',
      name: 'Hill Estates LLC',
      detail: 'Owned 2019 – 2024  •  Sold',
    },
  ],
};

/** Section icons */
export const UNIT_ICONS = {
  building: landlordIcons.building,
  overview: landlordIcons.house,
  floorPlan: unitIcons.scan,
  features: landlordIcons.sparkles,
  services: landlordIcons.layers,
  maintenance: renterIcons.lineWrench,
  financial: landlordIcons.database,
  quickActions: renterIcons.bolt,
  vault: landlordIcons.folder,
  tenant: landlordIcons.users,
  owner: applicationIcons.user,
  download: landlordIcons.download,
};

const STATS: readonly UnitStat[] = [
  { id: 'rent', label: 'Rent / Mo', value: '$1,110', icon: applicationIcons.wallet },
  { id: 'beds', label: 'Beds', value: '1 Bed', icon: applicationIcons.bed },
  { id: 'baths', label: 'Baths', value: '0 Baths', icon: amenityIcons.geyser },
  { id: 'lease', label: 'Lease', value: 'Fixed-Term', icon: applicationIcons.calendar },
];

const FEATURES: readonly UnitChip[] = [
  { id: 'ac', label: 'AC', icon: amenityIcons.airVent, tint: colors.primary, tile: colors.infoLight },
  {
    id: 'balcony',
    label: 'Balcony',
    icon: amenityIcons.balcony,
    tint: colors.successDark,
    tile: colors.successLight,
  },
  {
    id: 'furnished',
    label: 'Furnished',
    icon: amenityIcons.sofa,
    tint: colors.successDark,
    tile: colors.successLight,
  },
];

const SERVICES: readonly UnitChip[] = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: renterIcons.lineWrench,
    tint: colors.primary,
    tile: colors.infoLight,
  },
  {
    id: 'lease',
    label: 'Lease Mgmt.',
    icon: landlordIcons.fileText,
    tint: colors.successDark,
    tile: colors.successLight,
  },
  {
    id: 'financials',
    label: 'Financials',
    icon: landlordIcons.chart,
    tint: colors.warningDark,
    tile: colors.warningLight,
  },
];

const QUICK_ACTIONS: readonly UnitRow[] = [
  {
    id: 'message',
    title: 'Message tenant',
    short: 'Message',
    icon: landlordIcons.message,
    tint: colors.primary,
    tile: colors.infoLight,
  },
  {
    id: 'renewal',
    title: 'Initiate lease renewal',
    short: 'Renew Lease',
    icon: applicationIcons.refresh,
    tint: colors.successDark,
    tile: colors.successLight,
  },
  {
    id: 'ticket',
    title: 'Add maintenance ticket',
    short: 'New Ticket',
    icon: landlordIcons.tag,
    tint: colors.warningDark,
    tile: colors.warningLight,
  },
  {
    id: 'document',
    title: 'Request document',
    short: 'Request Doc',
    icon: landlordIcons.fileText,
    tint: colors.successDark,
    tile: colors.successLight,
  },
];

const DOCUMENTS: readonly UnitRow[] = [
  {
    id: 'lease',
    title: 'Lease agreement',
    subtitle: 'PDF · 2.4 MB',
    icon: landlordIcons.fileText,
    tint: colors.primary,
    tile: colors.infoLight,
  },
  {
    id: 'inspection',
    title: 'Move-in inspection',
    subtitle: 'PDF · 15.8 MB',
    icon: landlordIcons.clipboard,
    tint: colors.successDark,
    tile: colors.successLight,
  },
  {
    id: 'insurance',
    title: 'Tenant insurance',
    subtitle: 'PDF · 0.8 MB',
    icon: landlordIcons.shieldCheck,
    tint: colors.warningDark,
    tile: colors.warningLight,
  },
];

export function useUnitDetails(
  params: { propertyId?: string; unitId?: string } | undefined,
  navigation?: { goBack: () => void },
) {
  const dialog = useAppDialog();
  const { show } = dialog;
  const [tenantTab, setTenantTab] = useState<PeopleTab>('current');
  const [ownerTab, setOwnerTab] = useState<PeopleTab>('current');
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  const propertyName = SAMPLE_ASSETS.find(a => a.id === params?.propertyId)?.name ?? 'LL01';

  const unit = useMemo(
    () => ({
      name: 'Unit 101',
      number: '101',
      status: 'Vacant',
      floor: '1st Floor',
      type: 'Apartment',
      photoCount: 4,
      // Main photo, then the side thumbs (the last shows "+N")
      photos: [
        landlordAssets.unitBedroom,
        landlordAssets.detailsLiving,
        landlordAssets.detailsKitchen,
        landlordAssets.detailsBedroom,
      ] as readonly ImageSourcePropType[],
      monthCollected: 1200,
      collected: true,
      openTickets: 0,
    }),
    [],
  );

  const facts = useMemo<readonly UnitFact[]>(
    () => [
      { id: 'unit', label: 'Property / Unit', value: `${propertyName} / ${unit.number}` },
      { id: 'contract', label: 'Contract Model', value: 'Fixed' },
      { id: 'floor', label: 'Floor Placement', value: unit.floor },
      { id: 'ancillary', label: 'Ancillary Services', value: 'Active', kind: 'pill' },
      { id: 'area', label: 'Total Area', value: '1200 sq ft' },
      { id: 'lease', label: 'Lease Status', value: 'Ready for Intake', kind: 'dot' },
    ],
    [propertyName, unit.floor, unit.number],
  );

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

  /** Breadcrumb "Properties": back to the Portfolio Overview */
  const goProperties = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('LandlordProperties');
    }
  }, []);

  return {
    propertyName,
    unit,
    stats: STATS,
    facts,
    features: FEATURES,
    services: SERVICES,
    quickActions: QUICK_ACTIONS,
    documents: DOCUMENTS,
    tenantTab,
    setTenantTab,
    ownerTab,
    setOwnerTab,
    goBack,
    goProperties,
    edit: () => comingSoon('Edit Unit'),
    more: () => comingSoon('Unit options'),
    notifications: () => comingSoon('Notifications'),
    openPhotos: () => comingSoon('Photo Gallery'),
    virtualTour: () => comingSoon('Virtual Tour'),
    openOverview: () => comingSoon('Unit & Lease Overview'),
    floorPlanOpen,
    openFloorPlan: () => setFloorPlanOpen(true),
    closeFloorPlan: () => setFloorPlanOpen(false),
    openFeatures: () => comingSoon('Special Features'),
    openServices: () => comingSoon('Unit Services'),
    openService: (c: UnitChip) => comingSoon(c.label),
    openMaintenance: () => comingSoon('Maintenance Queue'),
    createTicket: () => comingSoon('Create Ticket'),
    openFinancial: () => comingSoon('Financial Command'),
    openAction: (r: UnitRow) => comingSoon(r.title),
    downloadDocument: (r: UnitRow) => comingSoon(`Download ${r.title}`),
    openArchive: () => comingSoon('Document Archive'),
    tenants: TENANTS[tenantTab],
    owners: OWNERS[ownerTab],
    openPerson: (p: UnitPerson) => comingSoon(p.name),
    dialog,
  };
}

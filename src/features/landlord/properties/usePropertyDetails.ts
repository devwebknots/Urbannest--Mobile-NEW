/**
 * usePropertyDetails: ViewModel for the landlord "Property Details" page,
 * opened by "View Property" on a Managed Assets card (Portfolio Overview).
 * Sample data follows the "Property Details" design (LL01, Apartment
 * Complex); the opened asset's name / type / address / photo are used on
 * top of it. Every action opens a "coming soon" AppDialog for now; replace
 * with the backend API later.
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

export interface DetailAmenity {
  readonly id: string;
  readonly label: string;
  readonly icon: ImageSourcePropType;
}

export interface HealthMetric {
  readonly id: string;
  readonly label: string;
  /** Shorter label for the half-width Health card */
  readonly short: string;
  readonly value: string;
  /** 0..1 bar fill */
  readonly progress: number;
  readonly color: string;
}

export interface InventoryUnit {
  readonly id: string;
  readonly name: string;
  readonly status: 'vacant' | 'occupied';
  readonly leaseEnds: string;
  readonly maintenance: string;
  readonly photo: ImageSourcePropType;
}

export interface QuickAction {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: ImageSourcePropType;
  readonly tint: string;
  readonly tile: string;
}

export interface VaultFolder {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly icon: ImageSourcePropType;
  readonly tint: string;
  readonly tile: string;
}

export interface RentMonth {
  readonly month: string;
  readonly amount: number;
}

export interface CommsMessage {
  readonly id: string;
  readonly initials: string;
  readonly from: string;
  readonly preview: string;
  readonly time: string;
}

export type CommsTab = 'chats' | 'notifications';

/** Design sample: LL01 */
const DETAILS = {
  name: 'LL01',
  type: 'Apartment Complex',
  address: '1391 Overcup Oak Ln, Centerton, US',
  description: 'Beautiful Property',
  photoCount: 4,
  owner: { initials: 'NW', name: 'Nan webknots', share: 100 },
  coOwners: [] as string[],
  manager: null as string | null,
  healthScore: 60,
  healthLabel: 'Fair',
  vendorScore: 4.8,
  openTickets: 0,
  rentTrend: 5.2,
  funding: 4250,
  expenses: 12800,
  vendorBills: 2100,
};

const AMENITIES: readonly DetailAmenity[] = [
  { id: 'balcony', label: 'Balcony', icon: amenityIcons.balcony },
  { id: 'cctv', label: 'CCTV', icon: amenityIcons.cctv },
];

const HEALTH: readonly HealthMetric[] = [
  { id: 'occupancy', label: 'Occupancy', short: 'Occupancy', value: '0%', progress: 0, color: colors.warning },
  { id: 'rent', label: 'Rent collection', short: 'Rent', value: '0%', progress: 0, color: colors.warning },
  { id: 'maintenance', label: 'Maintenance', short: 'Maintenance', value: 'Clear', progress: 1, color: colors.successDark },
  { id: 'renewals', label: 'Lease renewals', short: 'Renewals', value: '0 due', progress: 0, color: colors.navy },
];

const UNITS: readonly InventoryUnit[] = [
  {
    id: 'u101',
    name: 'Unit 101',
    status: 'vacant',
    leaseEnds: '—',
    maintenance: 'Clear',
    photo: landlordAssets.detailsUnit101,
  },
];

const QUICK_ACTIONS: readonly QuickAction[] = [
  {
    id: 'renewal',
    title: 'Lease renewal due',
    subtitle: 'Unit A1 · expires in 14 days',
    icon: applicationIcons.clock,
    tint: colors.warningDark,
    tile: colors.warningLight,
  },
  {
    id: 'approval',
    title: 'PM approval needed',
    subtitle: 'Water pressure repair quote',
    icon: landlordIcons.alert,
    tint: colors.error,
    tile: colors.errorLight,
  },
  {
    id: 'message',
    title: 'Tenant message',
    subtitle: 'Unit A2 · heating issue',
    icon: landlordIcons.message,
    tint: colors.primary,
    tile: colors.infoLight,
  },
];

const VAULT: readonly VaultFolder[] = [
  {
    id: 'lease',
    title: 'Lease agreements',
    subtitle: '16 active files',
    icon: landlordIcons.fileText,
    tint: colors.primary,
    tile: colors.infoLight,
  },
  {
    id: 'certs',
    title: 'Certificates and permits',
    subtitle: 'Fire & safety 2026',
    icon: landlordIcons.shieldCheck,
    tint: colors.successDark,
    tile: colors.successLight,
  },
  {
    id: 'vendor',
    title: 'Vendor contracts',
    subtitle: '6 agreements',
    icon: landlordIcons.clipboard,
    tint: colors.warningDark,
    tile: colors.warningLight,
  },
  {
    id: 'tax',
    title: 'Tax documents',
    subtitle: '171 invoices',
    icon: unitIcons.receipt,
    tint: colors.textSecondary,
    tile: colors.surfaceMuted,
  },
];

const RENT_MONTHS: readonly RentMonth[] = [
  { month: 'JUN', amount: 260 },
  { month: 'JUL', amount: 290 },
  { month: 'AUG', amount: 230 },
  { month: 'SEP', amount: 380 },
  { month: 'OCT', amount: 300 },
];

const CHATS: readonly CommsMessage[] = [
  {
    id: 'em',
    initials: 'EM',
    from: 'Estate Manager',
    preview: 'HVAC check confirmed for tomorrow.',
    time: '10:12',
  },
  {
    id: 'a2',
    initials: 'A2',
    from: 'Unit A2 · Tenant',
    preview: 'Heating not working, need help.',
    time: '10:45',
  },
];

const NOTIFICATIONS: readonly CommsMessage[] = [
  {
    id: 'n1',
    initials: 'UN',
    from: 'UrbanNest',
    preview: 'Fire & safety certificate renews in 30 days.',
    time: '09:30',
  },
];

/** Section icons (header row of each block) */
export const DETAIL_ICONS = {
  overview: landlordIcons.building,
  health: landlordIcons.chart,
  maintenance: renterIcons.lineWrench,
  quickActions: renterIcons.bolt,
  vault: landlordIcons.folder,
  rent: applicationIcons.coins,
  residents: landlordIcons.users,
  comms: landlordIcons.message,
  photos: unitIcons.image,
  coOwners: applicationIcons.users,
  manager: applicationIcons.user,
  chevron: landlordIcons.chevronRight,
  arrow: landlordIcons.arrowRight,
  pencil: applicationIcons.pencil,
  filter: applicationIcons.funnel,
};

export function usePropertyDetails(
  propertyId: string | undefined,
  navigation?: { goBack: () => void },
) {
  const dialog = useAppDialog();
  const { show } = dialog;
  const [commsTab, setCommsTab] = useState<CommsTab>('chats');

  const asset = SAMPLE_ASSETS.find(a => a.id === propertyId);

  const property = useMemo(
    () => ({
      ...DETAILS,
      name: asset?.name ?? DETAILS.name,
      address: asset?.address ?? DETAILS.address,
      // Main photo first, then room photos (design: 1 large + 3 thumbs)
      photos: [
        landlordAssets.detailsBuilding,
        landlordAssets.detailsLiving,
        landlordAssets.detailsBedroom,
        landlordAssets.detailsKitchen,
      ] as readonly ImageSourcePropType[],
    }),
    [asset],
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

  return {
    property,
    amenities: AMENITIES,
    health: HEALTH,
    units: UNITS,
    quickActions: QUICK_ACTIONS,
    vault: VAULT,
    rentMonths: RENT_MONTHS,
    commsTab,
    setCommsTab,
    messages: commsTab === 'chats' ? CHATS : NOTIFICATIONS,
    goBack,
    edit: () => comingSoon('Edit Property'),
    addPhotos: () => comingSoon('Add Photos'),
    openPhotos: () => comingSoon('Photo Gallery'),
    filterUnits: () => comingSoon('Filter Units'),
    addUnit: () => comingSoon('Add Unit'),
    viewUnit: (u: InventoryUnit) => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('LandlordUnitDetails', {
          propertyId: propertyId ?? 'test',
          unitId: u.id,
        });
      }
    },
    messageUnit: (u: InventoryUnit) => comingSoon(`Message ${u.name}`),
    openAction: (a: QuickAction) => comingSoon(a.title),
    openFolder: (f: VaultFolder) => comingSoon(f.title),
    openArchive: () => comingSoon('Document Archive'),
    openMessage: (m: CommsMessage) => comingSoon(m.from),
    notifications: () => comingSoon('Notifications'),
    dialog,
  };
}

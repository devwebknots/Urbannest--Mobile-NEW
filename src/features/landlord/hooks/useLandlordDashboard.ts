/**
 * useLandlordDashboard: ViewModel for the landlord home (dashboard).
 * Derives the KPI figures from the sample data, owns the rent chart range
 * and selected month, the bottom-bar tab and the shared AppDialog used for
 * actions that have no page yet ("coming soon").
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { navigationRef } from '@/navigation/navigationRef';
import {
  HUB_MESSAGES,
  INSIGHTS,
  LANDLORD_PROFILE,
  MONTHLY_RENT,
  OCCUPANCY,
  OPEN_OPERATIONS,
  PORTFOLIO_STATS,
  PRIME_ASSETS,
  QUICK_STATS,
  RECENT_DOCUMENTS,
  RENT_COLLECTION,
  RENT_RANGE_LABELS,
  VENDOR_PERFORMANCE,
} from '../constants';
import type { LandlordMenuKey } from '../components/LandlordSideMenu';
import type { LandlordTab, RecentDocument, RentRange } from '../types';
import { greetingFor, percent } from '../utils';

const TAB_TITLES: Record<LandlordTab, string> = {
  dashboard: 'Home',
  properties: 'Properties',
  leases: 'Leases',
  more: 'More',
};

export function useLandlordDashboard() {
  const dialog = useAppDialog();
  const { show } = dialog;

  // ---- Rent chart ----
  const [range, setRange] = useState<RentRange>(6);
  const months = useMemo(() => MONTHLY_RENT.slice(-range), [range]);
  const [selectedIndex, setSelectedIndex] = useState(months.length - 1);

  const rentTrend = useMemo(() => {
    const fullIndex = MONTHLY_RENT.length - months.length + selectedIndex;
    const current = MONTHLY_RENT[fullIndex];
    const previous = MONTHLY_RENT[fullIndex - 1];
    if (!current || !previous || previous.amount === 0) {
      return null;
    }
    return ((current.amount - previous.amount) / previous.amount) * 100;
  }, [months.length, selectedIndex]);

  const comingSoon = useCallback(
    (title: string, message = 'This section is coming soon.') =>
      show({ tone: 'info', title, message, actions: [{ label: 'OK', variant: 'brand' }] }),
    [show],
  );

  const openRangePicker = useCallback(() => {
    const pick = (next: RentRange) => ({
      label: RENT_RANGE_LABELS[next],
      variant: next === range ? ('brand' as const) : ('soft' as const),
      // The current month (last bar) is selected again
      onPress: () => {
        setRange(next);
        setSelectedIndex(next - 1);
      },
    });
    show({
      tone: 'info',
      title: 'Rent Collection Range',
      message: 'Choose how many months to show in the chart.',
      actions: [pick(3), pick(6), pick(12), { label: 'Cancel', variant: 'link' }],
    });
  }, [range, show]);

  // ---- Bottom bar: tabs without a page slide there, then glide back ----
  const [tab, setTab] = useState<LandlordTab>('dashboard');
  const tabDialogOpen = useRef(false);

  /** Side menu "Properties" and the Properties tab: Portfolio Overview */
  const openProperties = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('LandlordProperties');
    }
  }, []);

  // Burger menu (top right) opens the side menu
  const [menuOpen, setMenuOpen] = useState(false);
  const onMenuSelect = useCallback(
    (key: LandlordMenuKey) => {
      if (key === 'properties') {
        openProperties();
      }
    },
    [openProperties],
  );

  const onTabChange = useCallback(
    (next: LandlordTab) => {
      if (next === 'properties') {
        // Properties is its own page (Portfolio Overview); Home stays selected here
        openProperties();
        return;
      }
      setTab(next);
      if (next === 'dashboard') {
        return;
      }
      setTimeout(() => {
        tabDialogOpen.current = true;
        comingSoon(TAB_TITLES[next]);
      }, 280);
    },
    [comingSoon, openProperties],
  );

  useEffect(() => {
    if (dialog.props.config === null && tabDialogOpen.current) {
      tabDialogOpen.current = false;
      setTab('dashboard');
    }
  }, [dialog.props.config]);

  const downloadDocument = useCallback(
    (doc: RecentDocument) =>
      show({
        tone: 'info',
        title: 'Download',
        message: `${doc.title} will be available to download soon.`,
        actions: [{ label: 'OK', variant: 'brand' }],
      }),
    [show],
  );

  const greeting = useMemo(() => greetingFor(new Date()), []);

  return {
    dialog,
    openProperties,
    menuOpen,
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),
    onMenuSelect,
    profile: LANDLORD_PROFILE,
    greeting,
    portfolioStats: PORTFOLIO_STATS,
    rent: {
      ...RENT_COLLECTION,
      rate: percent(RENT_COLLECTION.collected, RENT_COLLECTION.expected),
    },
    occupancy: { ...OCCUPANCY, rate: percent(OCCUPANCY.occupied, OCCUPANCY.total) },
    quickStats: QUICK_STATS,
    chart: {
      months,
      selectedIndex,
      trend: rentTrend,
      rangeLabel: RENT_RANGE_LABELS[range],
      select: setSelectedIndex,
      openRangePicker,
    },
    assets: PRIME_ASSETS,
    assetsSummary: `${PRIME_ASSETS.length} properties • ${PRIME_ASSETS.reduce(
      (sum, a) => sum + a.units,
      0,
    )} units`,
    operations: OPEN_OPERATIONS,
    operationsTotal: OPEN_OPERATIONS.reduce((sum, o) => sum + o.count, 0),
    vendor: VENDOR_PERFORMANCE,
    documents: RECENT_DOCUMENTS,
    messages: HUB_MESSAGES,
    insights: INSIGHTS,
    tab,
    onTabChange,
    comingSoon,
    downloadDocument,
  };
}

export type LandlordDashboardVM = ReturnType<typeof useLandlordDashboard>;

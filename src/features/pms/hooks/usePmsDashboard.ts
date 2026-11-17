/**
 * usePmsDashboard: ViewModel for the PMS (property manager) home.
 * Owns the period filter, the bottom-bar tab and the shared AppDialog used
 * for actions that have no page yet ("coming soon"), and derives the
 * figures shown on the cards from the sample data.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDialog } from '@/components/AppDialog';
import { greetingFor } from '@/features/landlord/utils';
import {
  COLLECTION_RATE,
  FINANCIAL_FIGURES,
  LEASE_CYCLE,
  LEASING_STATS,
  MAINTENANCE_SUMMARY,
  MANAGED_PROPERTIES,
  OCCUPANCY_SUMMARY,
  PERIODS,
  PMS_PROFILE,
  PMS_SCOPE,
  PROPERTY_TYPES,
  RECENT_ACTIVITY,
  RECENT_TRANSACTIONS,
  REVENUE_SUMMARY,
  UNITS_SUMMARY,
} from '../constants';
import type { PmsPeriod, PmsTab } from '../types';

const TAB_TITLES: Record<PmsTab, string> = {
  dashboard: 'Dashboard',
  properties: 'Properties',
  financials: 'Financials',
  approvals: 'Approvals',
  profile: 'Profile',
};

export function usePmsDashboard() {
  const dialog = useAppDialog();
  const { show } = dialog;

  const comingSoon = useCallback(
    (title: string, message = 'This section is coming soon.') =>
      show({ tone: 'info', title, message, actions: [{ label: 'OK', variant: 'brand' }] }),
    [show],
  );

  // ---- Period filter (Today / This week / This month / Custom) ----
  const [period, setPeriod] = useState<PmsPeriod>('month');
  const onPeriodChange = useCallback(
    (next: PmsPeriod) => {
      if (next === 'custom') {
        comingSoon('Custom Range', 'Picking your own date range is coming soon.');
        return;
      }
      setPeriod(next);
    },
    [comingSoon],
  );

  // ---- Bottom bar: tabs without a page slide there, then glide back ----
  const [tab, setTab] = useState<PmsTab>('dashboard');
  const tabDialogOpen = useRef(false);
  const onTabChange = useCallback(
    (next: PmsTab) => {
      setTab(next);
      if (next === 'dashboard') {
        return;
      }
      setTimeout(() => {
        tabDialogOpen.current = true;
        comingSoon(TAB_TITLES[next]);
      }, 280);
    },
    [comingSoon],
  );

  useEffect(() => {
    if (dialog.props.config === null && tabDialogOpen.current) {
      tabDialogOpen.current = false;
      setTab('dashboard');
    }
  }, [dialog.props.config]);

  const greeting = useMemo(() => greetingFor(new Date()), []);
  const totalByType = PROPERTY_TYPES.reduce((sum, t) => sum + t.count, 0);

  return {
    dialog,
    comingSoon,
    profile: PMS_PROFILE,
    greeting,
    periods: PERIODS,
    period,
    onPeriodChange,
    scopeLabel: `${PMS_SCOPE.city} • ${PMS_SCOPE.properties} • ${UNITS_SUMMARY.total} units`,
    units: UNITS_SUMMARY,
    occupancy: OCCUPANCY_SUMMARY,
    revenue: REVENUE_SUMMARY,
    maintenance: MAINTENANCE_SUMMARY,
    leasing: {
      stats: LEASING_STATS,
      cycleDays: LEASE_CYCLE.days,
      cycleProgress: LEASE_CYCLE.days / LEASE_CYCLE.target,
    },
    propertyTypes: PROPERTY_TYPES,
    propertyTotal: totalByType,
    financial: { figures: FINANCIAL_FIGURES, collectionRate: COLLECTION_RATE },
    properties: MANAGED_PROPERTIES,
    activity: RECENT_ACTIVITY,
    transactions: RECENT_TRANSACTIONS,
    tab,
    onTabChange,
  };
}

export type PmsDashboardVM = ReturnType<typeof usePmsDashboard>;

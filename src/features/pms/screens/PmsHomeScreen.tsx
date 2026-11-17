/**
 * PmsHomeScreen: the property manager's dashboard, opened by "Continue as
 * PMS" on the persona page. Layout follows the "UrbanNest Real Estate
 * Dashboard" design: top section like the guest home (PmsTopSection: photo
 * carousel hero; the navy PmsHero is unwired), header, greeting, units
 * pill), period switch + scope row, 2 × 2 pastel KPI tiles, Leasing
 * Activity, Property Snapshot donut, dark Financial Pulse panel, My
 * Property(s) carousel, Recent Activity, Recent Transactions and the bottom
 * tab bar (Dashboard, Properties, Financials, Approvals, Profile).
 * Actions without a page yet open a "coming soon" AppDialog.
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { colors, spacing } from '@/config/theme';
import {
  LANDLORD_TAB_BAR_HEIGHT,
  LandlordTabBar,
  TabBarItem,
  landlordTabBarBottomGap,
} from '@/features/landlord/components/LandlordTabBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { moderateScale as ms } from '@/utils/responsive';
import { pmsIcons } from '../assets/pmsAssets';
import { DashboardFilters } from '../components/DashboardFilters';
import { FinancialPulseCard } from '../components/FinancialPulseCard';
import { KpiTiles } from '../components/KpiTiles';
import { LeasingActivityCard } from '../components/LeasingActivityCard';
import { MyPropertiesCard } from '../components/MyPropertiesCard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for the unwired navy hero
import { PmsHero } from '../components/PmsHero';
import { PmsTopSection } from '../components/PmsTopSection';
import { PropertySnapshotCard } from '../components/PropertySnapshotCard';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { RecentTransactionsCard } from '../components/RecentTransactionsCard';
import { usePmsDashboard } from '../hooks/usePmsDashboard';
import type { PmsTab } from '../types';

const PMS_TABS: readonly TabBarItem<PmsTab>[] = [
  { key: 'dashboard', label: 'Dashboard', icon: pmsIcons.house },
  { key: 'properties', label: 'Properties', icon: pmsIcons.building },
  { key: 'financials', label: 'Financials', icon: pmsIcons.circleDollar },
  { key: 'approvals', label: 'Approvals', icon: pmsIcons.circleCheck },
  { key: 'profile', label: 'Profile', icon: pmsIcons.user },
];

export const PmsHomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const vm = usePmsDashboard();
  const tabBarClearance =
    LANDLORD_TAB_BAR_HEIGHT + landlordTabBarBottomGap(insets.bottom) + spacing.xxl;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarClearance }}
      >
        {/* Top section: same as the guest home top (photo carousel hero) */}
        <PmsTopSection
          topInset={insets.top}
          profile={vm.profile}
          greeting={vm.greeting}
          totalUnits={vm.units.total}
          onMenu={() => vm.comingSoon('Menu')}
          onNotifications={() => vm.comingSoon('Notifications')}
          onProfile={() => vm.comingSoon('Profile')}
          onViewPortfolio={() => vm.comingSoon('Portfolio')}
        />
        {/* Unwired: previous navy hero from the design (kept in components/PmsHero.tsx)
        <PmsHero
          topInset={insets.top}
          profile={vm.profile}
          greeting={vm.greeting}
          totalUnits={vm.units.total}
          onMenu={() => vm.comingSoon('Menu')}
          onSearch={() => vm.comingSoon('Search')}
          onNotifications={() => vm.comingSoon('Notifications')}
          onProfile={() => vm.comingSoon('Profile')}
        />
        */}

        <View style={styles.content}>
          <Reveal delay={40}>
            <DashboardFilters
              periods={vm.periods}
              period={vm.period}
              onPeriodChange={vm.onPeriodChange}
              scopeLabel={vm.scopeLabel}
              onScopePress={() => vm.comingSoon('Cities & Properties')}
            />
          </Reveal>

          <Reveal delay={100}>
            <KpiTiles
              units={vm.units}
              occupancy={vm.occupancy}
              revenue={vm.revenue}
              maintenance={vm.maintenance}
              onPress={vm.comingSoon}
            />
          </Reveal>

          <Reveal delay={160}>
            <LeasingActivityCard
              stats={vm.leasing.stats}
              cycleDays={vm.leasing.cycleDays}
              cycleProgress={vm.leasing.cycleProgress}
              onStatPress={stat => vm.comingSoon(stat.label)}
            />
          </Reveal>

          <PropertySnapshotCard types={vm.propertyTypes} total={vm.propertyTotal} />

          <FinancialPulseCard
            figures={vm.financial.figures}
            collectionRate={vm.financial.collectionRate}
            trend={vm.financial.trend}
            onFigurePress={f => vm.comingSoon(f.label)}
            onViewPnl={() => vm.comingSoon('Profit & Loss')}
            onExport={() => vm.comingSoon('Export')}
          />

          <MyPropertiesCard
            properties={vm.properties}
            onOpen={p => vm.comingSoon(p.name)}
            onViewAll={() => vm.comingSoon('All Properties')}
          />

          <RecentActivityCard
            items={vm.activity}
            onOpen={item => vm.comingSoon(item.title)}
            onViewAll={() => vm.comingSoon('All Activity')}
          />

          <RecentTransactionsCard
            transactions={vm.transactions}
            onOpen={t => vm.comingSoon(t.type)}
            onViewAll={() => vm.comingSoon('All Transactions')}
          />
        </View>
      </ScrollView>

      <LandlordTabBar
        tabs={PMS_TABS}
        active={vm.tab}
        bottomInset={insets.bottom}
        onChange={vm.onTabChange}
      />
      <AppDialog {...vm.dialog.props} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  // Same gap between every block; the first one rides over the hero's
  // fade like the guest search card (HeroSection SEARCH_OVERLAP)
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: -ms(28),
    gap: spacing.lg,
  },
});

export default PmsHomeScreen;

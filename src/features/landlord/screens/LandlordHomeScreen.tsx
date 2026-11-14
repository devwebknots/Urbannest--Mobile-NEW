/**
 * LandlordHomeScreen: the landlord's dashboard, opened by "Continue as
 * Landlord" on the persona page. Layout follows the "UrbanNest Landlord
 * Dashboard Overview" design: navy hero (greeting, portfolio strip, actions),
 * KPI cards, monthly rent chart, Prime Assets, operations + vendor score,
 * recent documents, communication hub, intelligence tips and a floating tab
 * bar. Actions without a page yet open a "coming soon" AppDialog.
 */

import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { SectionHeader } from '@/features/guest/components/SectionHeader';
import { Reveal } from '@/features/renter/components/Reveal';
import { moderateScale as ms } from '@/utils/responsive';
import { CommunicationHub } from '../components/CommunicationHub';
import { InsightCards } from '../components/InsightCards';
import { OccupancyCard, QuickStatGrid, RentCollectionCard } from '../components/KpiCards';
import { LandlordHero } from '../components/LandlordHero';
import {
  LANDLORD_TAB_BAR_HEIGHT,
  LandlordTabBar,
  landlordTabBarBottomGap,
} from '../components/LandlordTabBar';
import { OpenOperationsCard, VendorPerformanceCard } from '../components/OperationsCards';
import { PrimeAssetCard } from '../components/PrimeAssetCard';
import { RecentDocumentsCard } from '../components/RecentDocuments';
import { RentChartCard } from '../components/RentChartCard';
import { useLandlordDashboard } from '../hooks/useLandlordDashboard';

const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Global Compliance'];

export const LandlordHomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const vm = useLandlordDashboard();
  const tabBarClearance =
    LANDLORD_TAB_BAR_HEIGHT + landlordTabBarBottomGap(insets.bottom) + spacing.xxl;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarClearance }}
      >
        <LandlordHero
          topInset={insets.top}
          profile={vm.profile}
          greeting={vm.greeting}
          stats={vm.portfolioStats}
          onNotifications={() => vm.comingSoon('Notifications')}
          onHelp={() => vm.comingSoon('Help Center')}
          onProfile={() => vm.comingSoon('Profile')}
          onMenu={vm.openProperties}
          onAddRequest={() => vm.comingSoon('Add Request')}
          onMessagePm={() => vm.comingSoon('Message PM')}
        />
        {/* Navy melts into the page; the KPI cards ride over the fade */}
        <View style={styles.heroFade} />

        <View style={[styles.padded, styles.kpis]}>
          <Reveal delay={60}>
            <View style={styles.kpiRow}>
              <RentCollectionCard
                rate={vm.rent.rate}
                trend={vm.rent.trend}
                trendCaption={vm.rent.trendCaption}
                collected={vm.rent.collected}
                expected={vm.rent.expected}
                onPress={() => vm.comingSoon('Rent Collection')}
              />
              <OccupancyCard
                rate={vm.occupancy.rate}
                occupied={vm.occupancy.occupied}
                total={vm.occupancy.total}
                onPress={() => vm.comingSoon('Occupancy')}
              />
            </View>
          </Reveal>

          <Reveal delay={140}>
            <View style={styles.gapMd}>
              <QuickStatGrid
                stats={vm.quickStats}
                onPress={stat => vm.comingSoon(stat.caption)}
              />
            </View>
          </Reveal>

          <Reveal delay={220}>
            <View style={styles.gapCard}>
              <RentChartCard
                months={vm.chart.months}
                selectedIndex={vm.chart.selectedIndex}
                trend={vm.chart.trend}
                rangeLabel={vm.chart.rangeLabel}
                onSelect={vm.chart.select}
                onRangePress={vm.chart.openRangePicker}
              />
            </View>
          </Reveal>
        </View>

        {/* Prime Assets */}
        <View style={[styles.padded, styles.section]}>
          <SectionHeader
            title="Prime Assets"
            subtitle={vm.assetsSummary}
            action={{
              label: 'View Analytics',
              variant: 'link',
              onPress: () => vm.comingSoon('Portfolio Analytics'),
            }}
          />
          <View style={styles.list}>
            {vm.assets.map(asset => (
              <PrimeAssetCard
                key={asset.id}
                asset={asset}
                onPress={() => vm.comingSoon(asset.name)}
              />
            ))}
          </View>
        </View>

        {/* Operations + vendors */}
        <View style={[styles.padded, styles.section, styles.stack]}>
          <OpenOperationsCard
            items={vm.operations}
            total={vm.operationsTotal}
            onPress={item => vm.comingSoon(item.label)}
          />
          <VendorPerformanceCard
            vendor={vm.vendor}
            onPress={() => vm.comingSoon('Vendor Performance')}
          />
        </View>

        {/* Recent documents */}
        <View style={[styles.padded, styles.section]}>
          <SectionHeader
            title="Recent Documents"
            subtitle={`${vm.documents.length} files`}
          />
          <View style={styles.list}>
            <RecentDocumentsCard
              documents={vm.documents}
              onOpen={doc => vm.comingSoon(doc.title)}
              onDownload={vm.downloadDocument}
              onOpenHub={() => vm.comingSoon('Document Hub')}
            />
          </View>
        </View>

        {/* Communication hub */}
        <View style={[styles.padded, styles.section]}>
          <CommunicationHub
            messages={vm.messages}
            onOpenMessage={m => vm.comingSoon(m.sender)}
            onOpenMessenger={() => vm.comingSoon('Messenger')}
          />
        </View>

        {/* UrbanNest Intelligence */}
        <View style={styles.section}>
          <View style={styles.padded}>
            <SectionHeader title="UrbanNest Intelligence" />
          </View>
          <View style={styles.list}>
            <InsightCards insights={vm.insights} onPress={i => vm.comingSoon(i.title)} />
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.padded, styles.footer]}>
          <Text style={[typographyPresets.caption, styles.footerText]}>
            © {new Date().getFullYear()} UrbanNest Property Management. All Rights Reserved.
          </Text>
          <View style={styles.footerLinks}>
            {FOOTER_LINKS.map((link, i) => (
              <React.Fragment key={link}>
                {i > 0 ? <Text style={typographyPresets.caption}>•</Text> : null}
                <Pressable onPress={() => vm.comingSoon(link)} hitSlop={6}>
                  <Text style={[typographyPresets.caption, styles.footerLink]}>{link}</Text>
                </Pressable>
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>

      <LandlordTabBar
        active={vm.tab}
        bottomInset={insets.bottom}
        onChange={vm.onTabChange}
        onAdd={() => vm.comingSoon('Quick Add')}
      />
      <AppDialog {...vm.dialog.props} />
    </View>
  );
};

const KPI_OVERLAP = ms(44);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  heroFade: {
    height: ms(84),
    // Indigo eases out over the page tint (design: indigo -> lavender -> page)
    backgroundImage: `linear-gradient(180deg, rgba(21,32,79,1) 0%, rgba(21,32,79,0.72) 25%, rgba(21,32,79,0.38) 55%, rgba(21,32,79,0.1) 82%, rgba(21,32,79,0) 100%)`,
  },
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  kpis: {
    marginTop: -KPI_OVERLAP,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gapMd: {
    marginTop: spacing.md,
  },
  gapCard: {
    marginTop: spacing.section,
  },
  section: {
    marginTop: spacing.sectionGap,
  },
  stack: {
    gap: spacing.section,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.sectionGap,
  },
  footerText: {
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  footerLink: {
    color: colors.textSecondary,
  },
});

export default LandlordHomeScreen;

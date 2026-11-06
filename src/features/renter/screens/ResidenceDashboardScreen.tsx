/**
 * ResidenceDashboardScreen: detail page of the residence picked on
 * My Residences. Full-bleed parallax photo with name/address, a rounded
 * content sheet rising over it (lease summary, concierge, finances,
 * requests, community) and a floating glass top bar that turns solid
 * once the photo scrolls away.
 */

import React, { useRef } from 'react';
import { Animated, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RENTER_TAB_BAR_HEIGHT, RenterTabBar } from '../components/RenterTabBar';
import { Reveal } from '../components/Reveal';
import { ConciergeGrid } from '../components/dashboard/ConciergeGrid';
import { DashboardSection } from '../components/dashboard/DashboardSection';
import { DetailTopBar } from '../components/dashboard/DetailTopBar';
import { EventCard } from '../components/dashboard/EventCard';
import { FinancialCard } from '../components/dashboard/FinancialCard';
import { LeaseSummaryCard } from '../components/dashboard/LeaseSummaryCard';
import { RequestCard } from '../components/dashboard/RequestCard';
import { ResidenceHero } from '../components/dashboard/ResidenceHero';
import { STATUS_LABEL } from '../constants';
import { DashboardNavigation, useResidenceDashboard } from '../hooks/useResidenceDashboard';
import { useRenterTabs } from '../hooks/useRenterTabs';

interface Props {
  navigation?: DashboardNavigation;
  route?: { params?: { residenceId?: string } };
}

const SHEET_OVERLAP = ms(30);

export const ResidenceDashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useResidenceDashboard(route?.params?.residenceId, navigation);
  const tabs = useRenterTabs();
  const scrollY = useRef(new Animated.Value(0)).current;

  const cardWidth = width - spacing.screenHorizontal * 2;
  const heroHeight = Math.round(width * 1.08);
  const renewal = vm.residence.meta[0];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{
          paddingBottom:
            RENTER_TAB_BAR_HEIGHT + Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        <ResidenceHero
          image={vm.residence.image}
          name={vm.residence.name}
          street={vm.residence.street}
          city={vm.residence.city}
          statusLabel={STATUS_LABEL[vm.residence.status]}
          firstName={vm.profile.firstName}
          width={width}
          height={heroHeight}
          sheetOverlap={SHEET_OVERLAP}
          scrollY={scrollY}
        />

        <View style={styles.sheet}>
          <Reveal delay={80}>
            <LeaseSummaryCard
              rent={vm.residence.rent}
              renewalLabel={renewal?.label.replace(' Date', '') ?? 'Renewal'}
              renewal={renewal?.value ?? '—'}
              unit={vm.residence.unit}
            />
          </Reveal>

          <Reveal delay={160}>
            <DashboardSection
              title="Concierge Services"
              subtitle="Everything you need for a comfortable stay."
              onExplore={() => vm.exploreAll('Concierge Services')}
            >
              <ConciergeGrid services={vm.services} onPress={vm.openService} />
            </DashboardSection>
          </Reveal>

          <Reveal delay={240}>
            <DashboardSection
              title="Financial Overview"
              subtitle="Your rental and building related payments."
              onExplore={() => vm.exploreAll('Financial Overview')}
            >
              <FinancialCard summary={vm.finance} onPayNow={vm.payNow} onViewHoa={vm.viewHoa} />
            </DashboardSection>
          </Reveal>

          <DashboardSection
            title="Recent Requests"
            subtitle="Track and manage your service requests."
            onExplore={() => vm.exploreAll('Recent Requests')}
          >
            <View style={styles.list}>
              {vm.requests.map(r => (
                <RequestCard key={r.id} request={r} onPress={vm.openRequest} />
              ))}
            </View>
          </DashboardSection>

          <DashboardSection
            title="Community Buzz"
            subtitle="Updates, events, and what's happening at your residence."
            onExplore={() => vm.exploreAll('Community Buzz')}
          >
            <EventCard event={vm.event} width={cardWidth} onPress={vm.openEvent} />
          </DashboardSection>
        </View>
      </Animated.ScrollView>

      <DetailTopBar
        topInset={insets.top}
        title={vm.residence.name}
        initials={vm.profile.initials}
        scrollY={scrollY}
        solidAt={heroHeight - SHEET_OVERLAP - insets.top - ms(60)}
        onBack={vm.back}
        onProfilePress={vm.openProfile}
      />

      <RenterTabBar
        active={tabs.tab}
        bottomInset={insets.bottom}
        hasAlerts={vm.profile.unreadAlerts > 0}
        onChange={tabs.onTabChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    paddingTop: spacing.xl,
    borderTopLeftRadius: ms(30),
    borderTopRightRadius: ms(30),
    backgroundColor: colors.pageTint,
  },
  list: {
    gap: spacing.md,
  },
});

export default ResidenceDashboardScreen;

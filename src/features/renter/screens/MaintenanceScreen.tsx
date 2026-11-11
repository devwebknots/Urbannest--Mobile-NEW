/**
 * MaintenanceScreen: maintenance hub for an active lease, opened from the
 * Maintenance shortcut on the Manage page. Top to bottom:
 *  - light top bar: back, "Maintenance", avatar
 *  - sliding banners (16:9 artwork, auto-slides, dots underneath)
 *  - "Need a Fix?" banner with "+ Request"
 *  - Active Tickets: one white card per open request
 *  - Recently Resolved: list card with "View All"
 *  - News & Alerts: photo cards, two at a time, paged with the arrows
 * No bottom tab bar: a pushed page, the back button is the way out.
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { AccentSectionHeader } from '../components/AccentSectionHeader';
import { CircleIconButton } from '../components/CircleIconButton';
import { Reveal } from '../components/Reveal';
import { LightTopBar } from '../components/LightTopBar';
import { BannerCarousel } from '../components/maintenance/BannerCarousel';
import { NewsCard } from '../components/maintenance/NewsCard';
import { RequestBanner } from '../components/maintenance/RequestBanner';
import { ResolvedList } from '../components/maintenance/ResolvedList';
import { TicketCard } from '../components/maintenance/TicketCard';
import { MaintenanceNavigation, useMaintenance } from '../hooks/useMaintenance';

interface Props {
  navigation?: MaintenanceNavigation;
  route?: { params?: { residenceId?: string } };
}

export const MaintenanceScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useMaintenance(route?.params?.residenceId, navigation);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        {/* Soft blue + lavender glow behind the top of the page */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar
          title="Maintenance"
          initials={vm.profile.initials}
          onBack={vm.back}
          onProfilePress={vm.openProfile}
          backLabel="Back to my home"
        />

        <Reveal delay={60}>
          <View style={styles.carousel}>
            <BannerCarousel
              banners={vm.banners}
              aspect={vm.bannerAspect}
              width={width}
              onPress={vm.openBanner}
            />
          </View>
        </Reveal>

        <Reveal delay={120}>
          <View style={styles.banner}>
            <RequestBanner onNewRequest={vm.newRequest} />
          </View>
        </Reveal>

        <View style={styles.section}>
          <AccentSectionHeader
            title="Active Tickets"
            right={
              <Text style={styles.pending}>
                <Text style={styles.pendingCount}>{vm.tickets.length}</Text> items pending
              </Text>
            }
          />
          <View style={styles.list}>
            {vm.tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onPress={vm.openTicket} />
            ))}
          </View>
        </View>

        <View style={styles.resolved}>
          <ResolvedList items={vm.resolved} onViewAll={vm.seeAllResolved} onOpen={vm.openTicket} />
        </View>

        <View style={styles.section}>
          <AccentSectionHeader
            title="News & Alerts"
            right={
              <View style={styles.arrows}>
                <CircleIconButton
                  onPress={vm.prevNews}
                  disabled={!vm.canPrevNews}
                  accessibilityLabel="Previous news"
                  icon={<ChevronLeftIcon size={ms(14)} color={colors.navy} />}
                />
                <CircleIconButton
                  onPress={vm.nextNews}
                  disabled={!vm.canNextNews}
                  accessibilityLabel="Next news"
                  icon={<ChevronRightIcon size={ms(12)} color={colors.navy} />}
                />
              </View>
            }
          />
          <View style={styles.list}>
            {vm.visibleNews.map(item => (
              <NewsCard key={item.id} item={item} width={width} onPress={vm.openNews} />
            ))}
          </View>
        </View>
      </ScrollView>

      <AppDialog {...vm.dialog} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
// Soft lavender (#DDD6FE) as rgb, same wash as the Manage page
const LAVENDER = '221,214,254';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ms(420),
    backgroundImage: `radial-gradient(circle at 15% 15%, rgba(${BLUE},0.14) 0%, rgba(${BLUE},0) 60%), radial-gradient(circle at 85% 0%, rgba(${LAVENDER},0.5) 0%, rgba(${LAVENDER},0) 55%)`,
  },
  // The carousel track adds its own vertical padding for the card shadow
  carousel: {
    marginTop: spacing.md,
  },
  banner: {
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.sectionGap,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  resolved: {
    marginTop: spacing.xxl,
  },
  pending: {
    ...typographyPresets.eyebrow,
    color: colors.navy,
  },
  pendingCount: {
    color: colors.primary,
  },
  arrows: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});

export default MaintenanceScreen;

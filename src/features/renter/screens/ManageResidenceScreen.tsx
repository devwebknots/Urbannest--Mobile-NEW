/**
 * ManageResidenceScreen: "My Home" page for an active lease, opened from
 * "Manage" on My Residences. Light premium dashboard layout:
 *  - header on the page tint: back, logo, bell, avatar, time-of-day
 *    greeting; the residence photo fades in behind the top right
 *  - residence hero card with the four shortcuts along its bottom
 *  - Quick Actions: 2 x 2 grid of wide pastel tiles
 *  - navy Rent Due card with the days-left ring
 *  - This Week: timeline of upcoming items (commented out for now)
 *  - Community Buzz: snapping carousel of wide event cards
 *  - Help Desk: service requests in one card + "Raise a Request"
 * No bottom tab bar: a pushed page, the back button is the way out.
 */

import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
// CalendarIcon: used by the hidden This Week section
import { /* CalendarIcon, */ PlusIcon, UsersIcon } from '@/components/icons';
import { colors, spacing } from '@/config/theme';
import { HeadsetIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { Reveal } from '../components/Reveal';
import { BuzzCarousel } from '../components/manage/BuzzCarousel';
import { HelpDeskList } from '../components/manage/HelpDeskList';
import { ManageHeader } from '../components/manage/ManageHeader';
import { ManageSectionHeader, SECTION_ICON } from '../components/manage/ManageSectionHeader';
import { GridIcon } from '../components/manage/QuickActionTiles';
import { QuickAlertCard } from '../components/manage/QuickAlertCard';
import { RentDueCard } from '../components/manage/RentDueCard';
import { ResidenceHeroCard } from '../components/manage/ResidenceHeroCard';
// import { WeekTimeline } from '../components/manage/WeekTimeline'; // hidden This Week section
import { ManageNavigation, useManageResidence } from '../hooks/useManageResidence';

interface Props {
  navigation?: ManageNavigation;
  route?: { params?: { residenceId?: string } };
}

export const ManageResidenceScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useManageResidence(route?.params?.residenceId, navigation);
  // Building photo on the right, from the top of the page down to the
  // middle of the residence card (measured), so the card sits over it
  const [heroLayout, setHeroLayout] = useState<{ y: number; height: number } | null>(null);
  const onHeroLayout = (e: LayoutChangeEvent) => {
    const { y, height } = e.nativeEvent.layout;
    setHeroLayout(prev => (prev && prev.y === y && prev.height === height ? prev : { y, height }));
  };
  const artWidth = Math.round(width * 0.62);
  const artHeight = heroLayout ? Math.round(heroLayout.y + heroLayout.height * 0.6) : ms(340);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        {/* Residence photo, clear on the right, melting into the page along
            a curved (oval) edge; the residence card covers its lower part */}
        <View pointerEvents="none" style={[styles.art, { width: artWidth, height: artHeight }]}>
          <Image source={vm.residence.image} style={styles.fill} resizeMode="cover" />
          <View style={[StyleSheet.absoluteFill, styles.fadeCurve]} />
        </View>

        {/* Soft blue + lavender glow, drawn over the photo so its edge never
            shows as a straight line */}
        <View pointerEvents="none" style={[styles.glow, { width, height: artHeight }]} />

        <ManageHeader
          topInset={insets.top}
          greeting={vm.greeting}
          firstName={vm.profile.fullName}
          initials={vm.profile.initials}
          unreadAlerts={vm.profile.unreadAlerts}
          onBack={vm.back}
          onNotifications={vm.openNotifications}
          onProfilePress={vm.openProfile}
        />

        <View style={styles.hero} onLayout={onHeroLayout}>
          <Reveal delay={60}>
            <ResidenceHeroCard
              residence={vm.residence}
              actions={vm.actions}
              onOpen={vm.openResidence}
              onAction={vm.openAction}
            />
          </Reveal>
        </View>

        <Reveal delay={120}>
          {/* "Quick Actions" section heading, then the Rent Due card on the
              left and the Quick Alert card on the right, same height */}
          <View style={styles.section}>
            <ManageSectionHeader
              title="Quick Actions"
              subtitle="Your rent, requests and updates."
              icon={<GridIcon size={SECTION_ICON} color={colors.primary} />}
              action={{ label: 'View All', onPress: vm.seeAllQuickActions }}
            />
            <View style={[styles.sectionBody, styles.split]}>
              <View style={styles.splitRent}>
                <RentDueCard
                  compact
                  rentAmount={vm.rentAmount}
                  dueDate={vm.rentDue.dueDate}
                  daysLeft={vm.rentDue.daysLeft}
                  cycleDays={vm.rentDue.cycleDays}
                  onPayNow={vm.payNow}
                />
              </View>
              <View style={styles.splitQuick}>
                <QuickAlertCard
                  alerts={vm.alerts}
                  onPress={vm.openAlert}
                />
              </View>
            </View>
          </View>
        </Reveal>

        {/* Hidden for now: This Week timeline
        <View style={styles.section}>
          <ManageSectionHeader
            title="This Week"
            subtitle="Your upcoming schedule and important tasks."
            icon={<CalendarIcon size={SECTION_ICON} color={colors.primary} />}
          />
          <View style={styles.sectionBody}>
            <WeekTimeline alerts={vm.alerts} onPress={vm.openAlert} />
          </View>
        </View> */}

        <View style={styles.section}>
          <ManageSectionHeader
            title="Community Buzz"
            subtitle="Events and activities at your residence."
            icon={<UsersIcon size={SECTION_ICON} color={colors.primary} />}
            action={{ label: 'See All', onPress: vm.seeAllEvents }}
          />
          <View style={styles.sectionBody}>
            <BuzzCarousel events={vm.events} width={width} onPress={vm.openEvent} />
          </View>
        </View>

        <View style={styles.section}>
          <ManageSectionHeader
            title="Help Desk"
            subtitle="Your service requests and their progress."
            icon={<HeadsetIcon size={SECTION_ICON} color={colors.primary} />}
            action={{ label: 'See All', onPress: vm.seeAllTickets }}
          />
          <View style={styles.sectionBody}>
            <HelpDeskList tickets={vm.tickets} onPress={vm.openTicket} />
          </View>
          <View style={styles.request}>
            <Button
              title="Raise a Request"
              variant="soft"
              onPress={vm.newRequest}
              leftIcon={<PlusIcon size={ms(16)} color={colors.navy} />}
            />
          </View>
        </View>
      </ScrollView>

      <AppDialog {...vm.dialog} />
    </View>
  );
};

// colors.pageTint (#EEF3F9) as rgb, for the photo fades
const TINT = '238,243,249';
// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
// Soft lavender (#DDD6FE) as rgb, for the wash at the top right
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
    backgroundImage: `radial-gradient(circle at 15% 20%, rgba(${BLUE},0.16) 0%, rgba(${BLUE},0) 60%), radial-gradient(circle at 70% 0%, rgba(${LAVENDER},0.55) 0%, rgba(${LAVENDER},0) 55%)`,
  },
  art: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  // Oval fade centred on the right edge: photo clear inside, page tint
  // outside, so the photo's left side ends in a curve, not a straight line
  fadeCurve: {
    backgroundImage: `radial-gradient(ellipse farthest-side at 100% 50%, rgba(${TINT},0) 0%, rgba(${TINT},0) 62%, rgba(${TINT},0.6) 78%, rgba(${TINT},1) 90%)`,
  },
  // Space between the greeting and the residence card
  hero: {
    marginTop: spacing.xxxl,
  },
  // Same section rhythm as the guest home page
  section: {
    marginTop: spacing.sectionGap,
  },
  sectionBody: {
    marginTop: spacing.lg,
  },
  // Rent Due card + Quick Alert card side by side, same height; the alert
  // card gets a little more width for its text rows
  split: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm + 2,
    paddingHorizontal: spacing.screenHorizontal,
  },
  splitRent: {
    flex: 0.85,
  },
  splitQuick: {
    flex: 1.15,
  },
  request: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
});

export default ManageResidenceScreen;

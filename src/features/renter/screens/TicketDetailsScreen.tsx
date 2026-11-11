/**
 * TicketDetailsScreen: one maintenance ticket, opened by tapping an
 * Active Ticket on the Maintenance page. Follows the "Urban Nest Faucet
 * Repair Timeline" design, top to bottom:
 *  - navy header band (back arrow, "Ticket Details" + "Maintenance
 *    Request", building line art); the content sheet overlaps its bottom
 *  - summary card: status, title, ticket ID + unit, description,
 *    reported time, "Assigned to" strip with a message button
 *  - Activity Timeline: steps on the page, work photo opens full screen
 *  - Notification & Chats: tabbed card
 * No bottom tab bar: a pushed page, the back button is the way out.
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { NavyPageHeader } from '../components/NavyPageHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { ChevronRightIcon } from '@/components/icons';
import { colors, spacing } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { AccentSectionHeader } from '../components/AccentSectionHeader';
import { CircleIconButton } from '../components/CircleIconButton';
import { Reveal } from '../components/Reveal';
import { PhotoViewer } from '../components/maintenance/details/PhotoViewer';
import { TicketMessages } from '../components/maintenance/details/TicketMessages';
import { TicketSummaryCard } from '../components/maintenance/details/TicketSummaryCard';
import { TicketTimeline } from '../components/maintenance/details/TicketTimeline';
import { TicketDetailsNavigation, useTicketDetails } from '../hooks/useTicketDetails';

interface Props {
  navigation?: TicketDetailsNavigation;
  route?: { params?: { residenceId?: string; ticketId?: string } };
}

export const TicketDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useTicketDetails(route?.params?.residenceId, route?.params?.ticketId, navigation);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
      >
        <NavyPageHeader
          title="Ticket Details"
          subtitle="Maintenance Request"
          topInset={insets.top}
          onBack={vm.back}
          backLabel="Back to maintenance"
        >
          <Reveal delay={60}>
            <View style={styles.summary}>
              <TicketSummaryCard
                ticket={vm.ticket}
                details={vm.details}
                unit={vm.unit}
                onMessage={vm.messageAssignee}
              />
            </View>
          </Reveal>

          <Reveal delay={120}>
            <View style={styles.section}>
              <AccentSectionHeader title="Activity Timeline" />
              <View style={styles.content}>
                <TicketTimeline
                  steps={vm.details.timeline}
                  width={width}
                  onPhotoPress={vm.openPhoto}
                />
              </View>
            </View>
          </Reveal>

          <View style={styles.section}>
            <AccentSectionHeader
              title="Notification & Chats"
              right={
                <CircleIconButton
                  onPress={vm.openMessages}
                  accessibilityLabel="Open all notifications and chats"
                  icon={<ChevronRightIcon size={ms(12)} color={colors.navy} />}
                />
              }
            />
            <View style={styles.content}>
              <TicketMessages
                ticketId={vm.ticket.id}
                tab={vm.tab}
                onTabChange={vm.setTab}
                notifications={vm.details.notifications}
                chats={vm.details.chats}
              />
            </View>
          </View>
        </NavyPageHeader>
      </ScrollView>

      <PhotoViewer image={vm.photo} onClose={vm.closePhoto} />
      <AppDialog {...vm.dialog} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  summary: {
    marginTop: spacing.xs,
  },
  section: {
    marginTop: spacing.sectionGap,
  },
  content: {
    marginTop: spacing.lg,
  },
});

export default TicketDetailsScreen;

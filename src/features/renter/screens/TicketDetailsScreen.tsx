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
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { NavyPageHeader } from '../components/NavyPageHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { CollapsibleSection } from '../components/CollapsibleSection';
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
            {/* Open at first */}
            <View style={styles.section}>
              <CollapsibleSection
                title="Activity Timeline"
                open={vm.timelineOpen}
                onToggle={vm.toggleTimeline}
                badge={
                  vm.completed ? (
                    <View style={styles.donePill}>
                      <Text style={styles.donePillText}>Completed</Text>
                    </View>
                  ) : null
                }
              >
                <TicketTimeline
                  steps={vm.details.timeline}
                  width={width}
                  onPhotoPress={vm.openPhoto}
                  completed={vm.completed}
                />
              </CollapsibleSection>
            </View>
          </Reveal>

          {/* Closed at first */}
          <View style={styles.section}>
            <CollapsibleSection
              title="Notification & Chats"
              open={vm.messagesOpen}
              onToggle={vm.toggleMessages}
            >
              <TicketMessages
                ticketId={vm.ticket.id}
                tab={vm.tab}
                onTabChange={vm.setTab}
                notifications={vm.details.notifications}
                chats={vm.details.chats}
                previewCount={vm.messagesPreview}
                onViewAll={vm.viewAllMessages}
                onOpenChat={vm.openChat}
                onNewMessage={vm.completed ? vm.openChat : undefined}
              />
            </CollapsibleSection>
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
  // "Completed" chip on the timeline header (completed tickets)
  donePill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successLight,
  },
  donePillText: {
    ...typographyPresets.badge,
    color: colors.successDark,
  },
});

export default TicketDetailsScreen;

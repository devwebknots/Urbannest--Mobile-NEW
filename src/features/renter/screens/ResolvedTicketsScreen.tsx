/**
 * ResolvedTicketsScreen: every finished maintenance request, opened by
 * "View All" on Recently Resolved (Maintenance page). Same navy header as
 * the ticket pages; one TicketCard per request (same card as Active
 * Tickets, in green as they are done). Tap a card → Ticket Details in the
 * completed look.
 */

import React, { useCallback } from 'react';
import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/config/theme';
import { NavyPageHeader } from '../components/NavyPageHeader';
import { TicketCard } from '../components/maintenance/TicketCard';
import { ResolvedTicketsNavigation, useResolvedTickets } from '../hooks/useResolvedTickets';
import type { ResolvedMaintenanceTicket } from '../types';

interface Props {
  navigation?: ResolvedTicketsNavigation;
  route?: { params?: { residenceId?: string } };
}

const Separator: React.FC = () => <View style={styles.separator} />;

export const ResolvedTicketsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const vm = useResolvedTickets(route?.params?.residenceId, navigation);
  const { openTicket } = vm;

  const renderItem = useCallback(
    ({ item }: { item: ResolvedMaintenanceTicket }) => (
      <TicketCard ticket={item} onPress={openTicket} />
    ),
    [openTicket],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={vm.tickets}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        initialNumToRender={8}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.xxl,
        }}
        ListHeaderComponent={
          <NavyPageHeader
            title="Resolved Tickets"
            subtitle={`${vm.tickets.length} completed requests`}
            topInset={insets.top}
            onBack={vm.back}
            backLabel="Back to maintenance"
          >
            <View style={styles.headerGap} />
          </NavyPageHeader>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  headerGap: {
    height: spacing.xs,
  },
  separator: {
    height: spacing.lg,
  },
});

export default ResolvedTicketsScreen;

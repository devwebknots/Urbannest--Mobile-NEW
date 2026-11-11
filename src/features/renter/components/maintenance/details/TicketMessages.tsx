/**
 * TicketMessages: white card under "Notification & Chats" on the Ticket
 * Details page. Two underline tabs (Notification / Chat History), then the
 * rows for the chosen tab on a pale tint:
 *  - notification: bell circle, title + time, "Maintenance Id: #…", message
 *  - chat: initials circle, name + time, last message
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BellIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { TicketChat, TicketNotification } from '../../../types';
import type { TicketMessagesTab } from '../../../hooks/useTicketDetails';
import { CARD_RADIUS } from '../cardStyle';

interface Props {
  ticketId: string;
  tab: TicketMessagesTab;
  onTabChange: (tab: TicketMessagesTab) => void;
  notifications: readonly TicketNotification[];
  chats: readonly TicketChat[];
}

const TABS: readonly { id: TicketMessagesTab; label: string }[] = [
  { id: 'notifications', label: 'Notification' },
  { id: 'chats', label: 'Chat History' },
];

export const TicketMessages: React.FC<Props> = ({
  ticketId,
  tab,
  onTabChange,
  notifications,
  chats,
}) => {
  const empty = tab === 'notifications' ? notifications.length === 0 : chats.length === 0;
  return (
    <View style={styles.card}>
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map(t => {
          const on = t.id === tab;
          return (
            <Pressable
              key={t.id}
              onPress={() => onTabChange(t.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={styles.tab}
            >
              <Text style={[styles.tabText, on && styles.tabTextOn]}>{t.label}</Text>
              <View style={[styles.underline, on && styles.underlineOn]} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.list}>
        {empty ? (
          <Text style={styles.empty}>
            {tab === 'notifications' ? 'No notifications yet.' : 'No chats yet.'}
          </Text>
        ) : null}

        {tab === 'notifications'
          ? notifications.map(n => (
              <View key={n.id} style={styles.row}>
                <View style={styles.bell}>
                  <BellIcon size={ms(18)} color={colors.primary} />
                </View>
                <View style={styles.rowBody}>
                  <View style={styles.rowHead}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {n.title}
                    </Text>
                    <Text style={styles.time} numberOfLines={1}>
                      {n.time}
                    </Text>
                  </View>
                  <Text style={styles.text}>
                    Maintenance Id: <Text style={styles.id}>#{ticketId}</Text>
                  </Text>
                  <Text style={styles.text}>{n.message}</Text>
                </View>
              </View>
            ))
          : chats.map(c => (
              <View key={c.id} style={styles.row}>
                <View style={styles.avatar}>
                  {c.photo ? (
                    <Image
                      source={c.photo}
                      style={styles.photo}
                      resizeMode="cover"
                      accessibilityIgnoresInvertColors
                    />
                  ) : (
                    <Text style={styles.initials}>{c.initials}</Text>
                  )}
                </View>
                <View style={styles.rowBody}>
                  <View style={styles.rowHead}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <Text style={styles.time} numberOfLines={1}>
                      {c.time}
                    </Text>
                  </View>
                  <Text style={styles.text} numberOfLines={2}>
                    {c.message}
                  </Text>
                </View>
              </View>
            ))}
      </View>
    </View>
  );
};

const CIRCLE = ms(44);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 8px 20px rgba(11,29,58,0.06)',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    paddingTop: spacing.lg,
  },
  tabText: {
    ...typographyPresets.segmentLabel,
    paddingHorizontal: spacing.xs,
    color: colors.textSecondary,
  },
  tabTextOn: {
    color: colors.primary,
  },
  underline: {
    height: 2,
    marginTop: spacing.md,
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  underlineOn: {
    backgroundColor: colors.primary,
  },
  list: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  empty: {
    ...typographyPresets.cardSubtitle,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.pageTint,
  },
  bell: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoLight,
  },
  avatar: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  // Fills the circle inside the white rim
  photo: {
    width: CIRCLE - 4,
    height: CIRCLE - 4,
  },
  initials: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  rowBody: {
    flex: 1,
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  rowTitle: {
    ...typographyPresets.bodyBold,
    flex: 1,
    color: colors.navy,
  },
  time: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  text: {
    ...typographyPresets.body,
  },
  id: {
    color: colors.primary,
  },
});

export default TicketMessages;

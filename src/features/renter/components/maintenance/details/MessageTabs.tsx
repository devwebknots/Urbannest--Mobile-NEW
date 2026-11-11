/**
 * MessageTabs: underline tabs "Notification" / "Chat History" with a small
 * count pill on each, so the user sees how many there are before opening a
 * tab. Shared by the Ticket Details card and the full Notification & Chats
 * page.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { TicketMessagesTab } from '../../../types';

interface Props {
  tab: TicketMessagesTab;
  onChange: (tab: TicketMessagesTab) => void;
  counts: Readonly<Record<TicketMessagesTab, number>>;
}

const TABS: readonly { id: TicketMessagesTab; label: string }[] = [
  { id: 'notifications', label: 'Notification' },
  { id: 'chats', label: 'Chat History' },
];

export const MessageTabs: React.FC<Props> = ({ tab, onChange, counts }) => (
  <View style={styles.tabs} accessibilityRole="tablist">
    {TABS.map(t => {
      const on = t.id === tab;
      return (
        <Pressable
          key={t.id}
          onPress={() => onChange(t.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: on }}
          accessibilityLabel={`${t.label}, ${counts[t.id]}`}
          style={styles.tab}
        >
          <View style={styles.labelRow}>
            <Text style={[styles.tabText, on && styles.tabTextOn]}>{t.label}</Text>
            {counts[t.id] > 0 ? (
              <View style={[styles.count, on && styles.countOn]}>
                <Text style={[styles.countText, on && styles.countTextOn]}>
                  {counts[t.id] > 99 ? '99+' : counts[t.id]}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={[styles.underline, on && styles.underlineOn]} />
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    paddingTop: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    paddingHorizontal: spacing.xs,
  },
  tabText: {
    ...typographyPresets.segmentLabel,
    color: colors.textSecondary,
  },
  tabTextOn: {
    color: colors.primary,
  },
  count: {
    minWidth: ms(20),
    paddingHorizontal: ms(6),
    paddingVertical: ms(1),
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  countOn: {
    backgroundColor: colors.infoLight,
  },
  countText: {
    ...typographyPresets.badge,
    color: colors.textSecondary,
  },
  countTextOn: {
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
});

export default MessageTabs;

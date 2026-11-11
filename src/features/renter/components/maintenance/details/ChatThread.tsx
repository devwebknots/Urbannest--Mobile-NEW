/**
 * ChatThread: a ticket's chat as a conversation (full Notification &
 * Chats page). Messages from the technician / front desk sit on the left
 * in white bubbles (photo or initials next to the last bubble of a run,
 * name over the first); the renter's own messages sit on the right in navy
 * bubbles. A day chip ("Today", "Oct 23") opens each day, and the time
 * shows under the last bubble of a run. Inverted list: opens at the newest
 * message, older ones load as you scroll up.
 */

import React, { useCallback } from 'react';
import { FlatList, Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { TicketChat } from '../../../types';

interface Props {
  /** Newest first */
  messages: readonly TicketChat[];
  contentStyle?: StyleProp<ViewStyle>;
}

/** Same sender on the same day: one run of bubbles */
const sameRun = (a?: TicketChat, b?: TicketChat) =>
  !!a && !!b && a.day === b.day && a.name === b.name && !!a.fromMe === !!b.fromMe;

const Avatar: React.FC<{ item: TicketChat }> = ({ item }) => (
  <View style={styles.avatar}>
    {item.photo ? (
      <Image
        source={item.photo}
        style={styles.avatarPhoto}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    ) : (
      <Text style={styles.avatarText}>{item.initials}</Text>
    )}
  </View>
);

export const ChatThread: React.FC<Props> = ({ messages, contentStyle }) => {
  const renderItem = useCallback(
    ({ item, index }: { item: TicketChat; index: number }) => {
      const older = messages[index + 1];
      const newer = messages[index - 1];
      const showDay = !older || older.day !== item.day;
      const first = !sameRun(item, older);
      const last = !sameRun(item, newer);
      const mine = !!item.fromMe;

      return (
        <View style={last ? styles.itemLast : styles.item}>
          {showDay ? (
            <View style={styles.dayChip}>
              <Text style={styles.dayText}>{item.day}</Text>
            </View>
          ) : null}

          <View style={[styles.row, mine && styles.rowMine]}>
            {mine ? null : (
              <View style={styles.avatarSlot}>{last ? <Avatar item={item} /> : null}</View>
            )}
            <View style={[styles.column, mine && styles.columnMine]}>
              {!mine && first ? <Text style={styles.name}>{item.name}</Text> : null}
              <View
                style={[
                  styles.bubble,
                  mine ? styles.bubbleMine : styles.bubbleTheirs,
                  last && (mine ? styles.tailMine : styles.tailTheirs),
                ]}
                accessible
                accessibilityLabel={`${mine ? 'You' : item.name}, ${item.time}: ${item.message}`}
              >
                <Text style={[styles.text, mine && styles.textMine]}>{item.message}</Text>
              </View>
              {last ? <Text style={styles.time}>{item.time}</Text> : null}
            </View>
          </View>
        </View>
      );
    },
    [messages],
  );

  // Plain view when empty (an inverted list can draw its empty text upside down)
  if (messages.length === 0) {
    return (
      <View style={styles.list}>
        <Text style={styles.empty}>No messages yet. Say hello to your technician.</Text>
      </View>
    );
  }

  return (
    <FlatList
      inverted
      data={messages}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      initialNumToRender={15}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      style={styles.list}
      contentContainerStyle={[styles.content, contentStyle]}
    />
  );
};

const AVATAR = ms(30);
const RADIUS = ms(18);
const TAIL = ms(6);

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
  },
  item: {
    marginTop: ms(3),
  },
  // Gap between runs of bubbles
  itemLast: {
    marginTop: ms(3),
    marginBottom: spacing.md,
  },
  dayChip: {
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dayText: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  avatarSlot: {
    width: AVATAR,
    // Lines the avatar up with the bubble, above the time
    marginBottom: ms(18),
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  avatarPhoto: {
    width: AVATAR - 3,
    height: AVATAR - 3,
  },
  avatarText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  column: {
    maxWidth: '78%',
    alignItems: 'flex-start',
  },
  columnMine: {
    alignItems: 'flex-end',
  },
  name: {
    ...typographyPresets.caption,
    marginBottom: ms(3),
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  bubble: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: RADIUS,
  },
  // Others: white card bubble, same edge + shadow as the page cards
  bubbleTheirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 4px 12px rgba(11,29,58,0.05)',
  },
  // Renter: navy gradient, same as the app's brand buttons
  bubbleMine: {
    backgroundImage: `linear-gradient(135deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  tailTheirs: {
    borderBottomLeftRadius: TAIL,
  },
  tailMine: {
    borderBottomRightRadius: TAIL,
  },
  text: {
    ...typographyPresets.body,
    color: colors.textPrimary,
  },
  textMine: {
    color: colors.white,
  },
  time: {
    ...typographyPresets.caption,
    marginTop: ms(4),
    marginHorizontal: spacing.xs,
    color: colors.textMuted,
  },
  empty: {
    ...typographyPresets.cardSubtitle,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
    textAlign: 'center',
  },
});

export default ChatThread;

/**
 * EventCard: featured community event — photo with badge, title and date
 * box, description, attendees and an outlined View Details button.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { ArrowRightIcon, StarGlyph } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { CommunityEvent } from '../../types';

interface Props {
  event: CommunityEvent;
  width: number;
  onPress: () => void;
}

const AVATAR_TINTS = [
  { bg: colors.chipBlue, fg: colors.navy },
  { bg: colors.sandTile, fg: colors.goldIcon },
  { bg: colors.avatarPurple.bg, fg: colors.avatarPurple.text },
];

export const EventCard: React.FC<Props> = ({ event, width, onPress }) => {
  const imageHeight = Math.round(width * 0.46);
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.media, { height: imageHeight }]}>
        <Image source={event.image} style={{ width, height: imageHeight }} resizeMode="cover" />
        <View style={styles.badge}>
          <StarGlyph size={scaleFont(11)} color={colors.gold} />
          <Text style={styles.badgeText}>Featured Event</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.date}>
            <Text style={styles.month}>{event.month}</Text>
            <Text style={styles.day}>{event.day}</Text>
          </View>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.attendees}>
          <View style={styles.avatars}>
            {event.attendees.map((initials, i) => {
              const tint = AVATAR_TINTS[i % AVATAR_TINTS.length];
              return (
                <View
                  key={initials}
                  style={[
                    styles.avatar,
                    { backgroundColor: tint.bg },
                    i > 0 && styles.avatarOverlap,
                  ]}
                >
                  <Text style={[styles.avatarText, { color: tint.fg }]}>{initials}</Text>
                </View>
              );
            })}
            <View style={[styles.avatar, styles.avatarOverlap, styles.more]}>
              <Text style={styles.moreText}>+{event.moreCount}</Text>
            </View>
          </View>
          <Text style={styles.attending} numberOfLines={1}>
            {event.attendingLabel}
          </Text>
        </View>

        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${event.title}`}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>View Details</Text>
          <ArrowRightIcon size={ms(15)} color={colors.navy} />
        </Pressable>
      </View>
    </View>
  );
};

const RADIUS = borderRadius.xxl + 2;
const AVATAR = ms(34);

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: RADIUS,
    backgroundColor: colors.surface,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  media: {
    overflow: 'hidden',
    borderRadius: RADIUS,
    backgroundColor: colors.headerDarkBlue,
  },
  badge: {
    position: 'absolute',
    top: spacing.md + 2,
    left: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    height: ms(30),
    paddingHorizontal: spacing.md + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  badgeText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(12),
    color: colors.navy,
  },
  body: {
    padding: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.heading.bold,
    fontSize: scaleFont(21),
    lineHeight: scaleFont(28),
    color: colors.navy,
  },
  date: {
    width: ms(58),
    paddingVertical: ms(6),
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.blueTile,
  },
  month: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11.5),
    letterSpacing: 1,
    color: colors.navy,
  },
  day: {
    fontFamily: typography.fontFamily.heading.bold,
    fontSize: scaleFont(24),
    lineHeight: scaleFont(28),
    color: colors.navy,
  },
  description: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(13.5),
    lineHeight: scaleFont(21),
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarOverlap: {
    marginLeft: -ms(10),
  },
  avatarText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11),
  },
  more: {
    backgroundColor: colors.surfaceMuted,
  },
  moreText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11),
    color: colors.textSecondary,
  },
  attending: {
    flex: 1,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12.5),
    color: colors.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: ms(48),
    marginTop: spacing.xl,
    borderRadius: borderRadius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(11,42,91,0.35)',
  },
  pressed: {
    backgroundColor: colors.pageTint,
  },
  buttonText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(14),
    color: colors.navy,
  },
});

export default EventCard;

/**
 * BuzzCarousel: Community Buzz events as a snapping horizontal carousel.
 * Each card is a wide photo with a navy fade at the bottom: registration
 * pill + audience tag on top; Playfair title, date and time below.
 * Dots under the carousel show the current card.
 */

import React, { useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CalendarIcon, ClockIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
import type { BuzzEvent } from '../../types';

interface Props {
  events: readonly BuzzEvent[];
  /** Screen width */
  width: number;
  onPress: (event: BuzzEvent) => void;
}

const GAP = spacing.md;

export const BuzzCarousel: React.FC<Props> = ({ events, width, onPress }) => {
  const [index, setIndex] = useState(0);
  const cardWidth = Math.round(width * 0.8);
  const cardHeight = Math.round(cardWidth * 0.62);
  const interval = cardWidth + GAP;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / interval);
    if (next !== index) {
      setIndex(Math.max(0, Math.min(events.length - 1, next)));
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={interval}
        snapToAlignment="start"
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={styles.track}
      >
        {events.map(event => (
          <Pressable
            key={event.id}
            onPress={() => onPress(event)}
            accessibilityRole="button"
            accessibilityLabel={`${event.title}, ${event.date}`}
            style={({ pressed }) => [
              styles.card,
              { width: cardWidth, height: cardHeight },
              pressed && styles.pressed,
            ]}
          >
            <Image source={event.image} style={styles.photo} resizeMode="cover" />
            <Scrim edge="bottom" extent={0.66} maxOpacity={0.95} />

            <View style={styles.top}>
              <View style={[styles.pill, !event.registrationOpen && styles.pillClosed]}>
                <View
                  style={[styles.dot, { backgroundColor: event.registrationOpen ? colors.success : colors.gold }]}
                />
                <Text style={[styles.pillText, !event.registrationOpen && styles.pillTextClosed]}>
                  {event.registrationOpen ? 'Registration Open' : 'Opens Soon'}
                </Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{event.audience}</Text>
              </View>
            </View>

            <View style={styles.bottom}>
              <Text style={styles.title} numberOfLines={1}>
                {event.title}
              </Text>
              <View style={styles.meta}>
                <View style={styles.metaItem}>
                  <CalendarIcon size={ms(12)} color={colors.textInverseMuted} />
                  <Text style={styles.metaText}>{event.date}</Text>
                </View>
                <View style={styles.metaItem}>
                  <ClockIcon size={ms(12)} color={colors.textInverseMuted} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {event.time}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {events.map((event, i) => (
          <View key={event.id} style={[styles.dotNav, i === index && styles.dotNavActive]} />
        ))}
      </View>
    </View>
  );
};

const RADIUS = borderRadius.xxl + 2;

const styles = StyleSheet.create({
  track: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: GAP,
  },
  card: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.navy,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  photo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    paddingHorizontal: spacing.md,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  pillClosed: {
    backgroundColor: 'rgba(11,29,58,0.55)',
  },
  dot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  pillText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  pillTextClosed: {
    color: colors.white,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11,29,58,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tagText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
  },
  metaText: {
    ...typographyPresets.heroSubtitle,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: ms(6),
    marginTop: spacing.lg,
  },
  dotNav: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.textSubtle,
  },
  dotNavActive: {
    width: ms(20),
    backgroundColor: colors.navy,
  },
});

export default BuzzCarousel;

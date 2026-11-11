/**
 * AnnouncementCarousel: snapping carousel of white announcement cards at
 * the top of the Maintenance page. Each card: gold tag pill, navy Playfair
 * headline with a blue second line, short paragraph and a "Learn More"
 * button on the left; a building photo on the right that melts into the
 * card. Dots at the bottom right show the current card.
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
import { Button } from '@/components/Button';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { MaintenanceAnnouncement } from '../../types';
import { CARD_RADIUS } from './cardStyle';

interface Props {
  items: readonly MaintenanceAnnouncement[];
  /** Screen width */
  width: number;
  onPress: (item: MaintenanceAnnouncement) => void;
}

const GAP = spacing.md;

export const AnnouncementCarousel: React.FC<Props> = ({ items, width, onPress }) => {
  const [index, setIndex] = useState(0);
  const cardWidth = width - spacing.screenHorizontal * 2;
  const cardHeight = Math.round(ms(350));
  const photoWidth = Math.round(cardWidth * 0.58);
  const interval = cardWidth + GAP;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / interval);
    if (next !== index) {
      setIndex(Math.max(0, Math.min(items.length - 1, next)));
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
        {items.map(item => (
          <Pressable
            key={item.id}
            onPress={() => onPress(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.tag}: ${item.title}, ${item.highlight}`}
            style={[styles.card, { width: cardWidth, height: cardHeight }]}
          >
            {/* Photo on the right, fading into the card to the left and bottom */}
            <View pointerEvents="none" style={[styles.photoWrap, { width: photoWidth }]}>
              <Image
                source={item.image}
                style={{ width: photoWidth, height: cardHeight }}
                resizeMode="cover"
              />
              <View style={[StyleSheet.absoluteFill, styles.photoFade]} />
            </View>

            <View style={styles.copy}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
              <Text style={styles.title}>
                {item.title}
                {'\n'}
                <Text style={styles.highlight}>{item.highlight}</Text>
              </Text>
              <Text style={styles.body} numberOfLines={3}>
                {item.body}
              </Text>
              <Button
                title={item.cta}
                variant="brand"
                size="md"
                onPress={() => onPress(item)}
                rightIcon={<ArrowRightIcon size={ms(15)} color={colors.white} />}
                style={styles.cta}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {items.length > 1 ? (
        <View pointerEvents="none" style={styles.dots}>
          {items.map((item, i) => (
            <View key={item.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

// colors.white as rgb, for the photo fade
const WHITE = '255,255,255';

const styles = StyleSheet.create({
  track: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    gap: GAP,
  },
  card: {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    boxShadow: '0px 10px 24px rgba(11,29,58,0.08)',
  },
  photoWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  photoFade: {
    backgroundImage: `linear-gradient(to right, rgba(${WHITE},1) 0%, rgba(${WHITE},0.55) 35%, rgba(${WHITE},0) 70%), linear-gradient(to top, rgba(${WHITE},0.9) 0%, rgba(${WHITE},0) 35%)`,
  },
  copy: {
    flex: 1,
    width: '70%',
    padding: spacing.xl,
  },
  // Gold pill, same tint as the warning badges
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warningLight,
  },
  tagText: {
    ...typographyPresets.badge,
    color: colors.warningDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    marginTop: spacing.md,
    color: colors.navy,
  },
  highlight: {
    color: colors.primary,
  },
  body: {
    ...typographyPresets.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 'auto',
  },
  dots: {
    position: 'absolute',
    right: spacing.screenHorizontal + spacing.xl,
    bottom: spacing.md + spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  dot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.textSubtle,
  },
  dotActive: {
    width: ms(18),
    backgroundColor: colors.navy,
  },
});

export default AnnouncementCarousel;

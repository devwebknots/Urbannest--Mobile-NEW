/**
 * FeaturedCarousel: snapping property cards. The centered card is full
 * size; the neighbours peek in from the sides, smaller and faded.
 * The items repeat (LOOPS copies, starting mid-list) so the carousel feels
 * endless and the first card never leaves an empty gap on the left.
 * Card: photo with the Exclusive badge (top left) and a white heart button
 * (top right); below, a blue type label, price, address, a hairline and
 * bed / bath / area spread evenly.
 */

import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MapPinIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { FeaturedProperty } from '../types';
import { AreaIcon, BathIcon, BedIcon, HeartIcon, StarGlyph } from './GuestIcons';

interface Props {
  items: FeaturedProperty[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

const GAP = ms(14);
/** The list repeats this many times so there is always a card on both sides */
const LOOPS = 40;

export const FeaturedCarousel: React.FC<Props> = ({ items, favorites, onToggleFavorite }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.66, 300);
  const interval = cardWidth + GAP;
  const sidePad = (width - cardWidth) / 2;
  const scrollX = useRef(new Animated.Value(0)).current;
  // Endless feel: repeat the items and start in the middle copy, on its
  // second card, so a neighbour always peeks in on the left and the right
  const data = useMemo(
    () => Array.from({ length: LOOPS }, (_, copy) => items.map(item => ({ item, copy }))).flat(),
    [items],
  );
  const startIndex = items.length * Math.floor(LOOPS / 2) + Math.min(1, items.length - 1);

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={entry => `${entry.copy}-${entry.item.id}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={interval}
      decelerationRate="fast"
      initialScrollIndex={startIndex}
      getItemLayout={(_, index) => ({ length: interval, offset: interval * index, index })}
      contentContainerStyle={{ paddingHorizontal: sidePad - GAP / 2 }}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={16}
      initialNumToRender={5}
      windowSize={5}
      renderItem={({ item: { item }, index }) => {
        const input = [(index - 1) * interval, index * interval, (index + 1) * interval];
        const scale = scrollX.interpolate({ inputRange: input, outputRange: [0.86, 1, 0.86], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange: input, outputRange: [0.55, 1, 0.55], extrapolate: 'clamp' });
        return (
          <Animated.View style={{ width: interval, paddingHorizontal: GAP / 2, opacity, transform: [{ scale }] }}>
            <FeaturedCard
              item={item}
              imageWidth={cardWidth}
              imageHeight={cardWidth * 0.7}
              favorite={favorites.has(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          </Animated.View>
        );
      }}
    />
  );
};

const formatSqft = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const FeaturedCard: React.FC<{
  item: FeaturedProperty;
  imageWidth: number;
  imageHeight: number;
  favorite: boolean;
  onToggleFavorite: () => void;
}> = ({ item, imageWidth, imageHeight, favorite, onToggleFavorite }) => (
  <View style={styles.cardShadow}>
    <View style={styles.card}>
      <View>
        <Image
          source={item.image}
          style={[styles.image, { width: imageWidth, height: imageHeight }]}
          resizeMode="cover"
        />
        <View style={styles.badge}>
          <StarGlyph size={scaleFont(10)} color={colors.gold} />
          <Text style={styles.badgeText}>Exclusive</Text>
        </View>
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          style={({ pressed }) => [styles.heart, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon size={ms(17)} color={colors.favorite} filled={favorite} />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.type}>{item.type}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.period}>{item.period}</Text>
        </View>
        <View style={styles.addressRow}>
          <MapPinIcon size={ms(12)} color={colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.stats}>
          <Stat icon={<BedIcon size={ms(15)} color={colors.navy} />} label={`${item.beds} Bed`} />
          <View style={styles.statDivider} />
          <Stat icon={<BathIcon size={ms(15)} color={colors.navy} />} label={`${item.baths} Bath`} />
          <View style={styles.statDivider} />
          <Stat
            icon={<AreaIcon size={ms(15)} color={colors.navy} />}
            label={`${formatSqft(item.sqft)} Sq Ft`}
          />
        </View>
      </View>
    </View>
  </View>
);

const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <View style={styles.stat}>
    {icon}
    <Text style={styles.statText} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

const HEART = ms(34);

const styles = StyleSheet.create({
  // boxShadow, not elevation: Android's elevation shadow ignores the
  // carousel's fade and shows through the faded side cards as a grey band.
  // It sits on an outer view so the card's overflow clip doesn't cut it off.
  cardShadow: {
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
  },
  card: {
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  image: {
    backgroundColor: colors.surfaceMuted,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: ms(26),
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.goldBadgeBg,
  },
  badgeText: {
    ...typographyPresets.badge,
    color: colors.white,
    letterSpacing: 0.3,
  },
  heart: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: HEART,
    height: HEART,
    borderRadius: HEART / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
  },
  info: {
    padding: spacing.lg,
  },
  type: {
    ...typographyPresets.eyebrow,
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(10.5),
    color: colors.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  price: {
    ...typographyPresets.price,
    fontSize: scaleFont(18),
    lineHeight: scaleFont(24),
    color: colors.navy,
  },
  period: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  address: {
    flex: 1,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    color: colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(5),
  },
  statDivider: {
    width: 1,
    height: ms(14),
    backgroundColor: colors.border,
  },
  statText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11.5),
    color: colors.textPrimary,
  },
});

export default FeaturedCarousel;

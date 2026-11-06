/**
 * FeaturedCarousel: snapping property cards. The centered card is full
 * size; the neighbours peek in from the sides, smaller and faded.
 */

import React, { useRef } from 'react';
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
  shadows,
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

export const FeaturedCarousel: React.FC<Props> = ({ items, favorites, onToggleFavorite }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.66, 300);
  const interval = cardWidth + GAP;
  const sidePad = (width - cardWidth) / 2;
  const scrollX = useRef(new Animated.Value(0)).current;
  const startIndex = Math.floor(items.length / 2);

  return (
    <Animated.FlatList
      data={items}
      keyExtractor={item => item.id}
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
      renderItem={({ item, index }) => {
        const input = [(index - 1) * interval, index * interval, (index + 1) * interval];
        const scale = scrollX.interpolate({ inputRange: input, outputRange: [0.86, 1, 0.86], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange: input, outputRange: [0.55, 1, 0.55], extrapolate: 'clamp' });
        return (
          <Animated.View style={{ width: interval, paddingHorizontal: GAP / 2, opacity, transform: [{ scale }] }}>
            <FeaturedCard
              item={item}
              imageHeight={cardWidth * 0.78}
              favorite={favorites.has(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          </Animated.View>
        );
      }}
    />
  );
};

const FeaturedCard: React.FC<{
  item: FeaturedProperty;
  imageHeight: number;
  favorite: boolean;
  onToggleFavorite: () => void;
}> = ({ item, imageHeight, favorite, onToggleFavorite }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={[styles.image, { height: imageHeight }]} resizeMode="cover" />
    <View style={styles.badge}>
      <StarGlyph size={scaleFont(11)} color={colors.gold} />
      <Text style={styles.badgeText}>Exclusive</Text>
    </View>

    <View style={styles.info}>
      <Text style={styles.type}>{item.type}</Text>
      <View style={styles.priceRow}>
        <Text style={typographyPresets.price}>{item.price}</Text>
        <Text style={styles.period}>{item.period}</Text>
        <View style={styles.flex} />
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon size={ms(20)} color={colors.favorite} filled={favorite} />
        </Pressable>
      </View>
      <View style={styles.addressRow}>
        <MapPinIcon size={ms(11)} color={colors.textPrimary} />
        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
      <View style={styles.stats}>
        <Stat icon={<BedIcon size={ms(14)} color={colors.textPrimary} />} label={`${item.beds} Bed`} />
        <Stat icon={<BathIcon size={ms(14)} color={colors.textPrimary} />} label={`${item.baths} Bath`} />
        <Stat icon={<AreaIcon size={ms(14)} color={colors.textPrimary} />} label={`${item.sqft} Sq Ft`} />
      </View>
    </View>
  </View>
);

const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <View style={styles.stat}>
    {icon}
    <Text style={styles.statText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.md,
  },
  image: {
    width: '100%',
    backgroundColor: colors.surfaceMuted,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(3),
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.goldBadgeBg,
  },
  badgeText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  info: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.md,
  },
  type: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  period: {
    ...typographyPresets.caption,
    marginLeft: spacing.sm,
    color: colors.textSecondary,
  },
  flex: { flex: 1 },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  address: {
    flex: 1,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(9),
    color: colors.textPrimary,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
});

export default FeaturedCarousel;

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
import type { RentalListing } from '../types';
import { HeartIcon, StarGlyph } from './GuestIcons';

interface Props {
  item: RentalListing;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress?: () => void;
}

export const RentalCard: React.FC<Props> = ({ item, favorite, onToggleFavorite, onPress }) => (
  <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
    <View>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.badge}>
        <StarGlyph size={scaleFont(9)} color={colors.gold} />
        <Text style={styles.badgeText}>Premium</Text>
      </View>
    </View>

    <View style={styles.body}>
      <View style={styles.titleRow}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon
            size={ms(17)}
            color={favorite ? colors.favorite : colors.textMuted}
            filled={favorite}
          />
        </Pressable>
      </View>

      <View style={styles.priceRow}>
        {item.pricePrefix ? <Text style={styles.prefix}>{item.pricePrefix} </Text> : null}
        <Text style={typographyPresets.price}>{item.price}</Text>
        <Text style={styles.per}> /mo</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.stat}>{item.beds}</Text>
        <View style={styles.dot} />
        <Text style={styles.stat}>{item.baths}</Text>
        <View style={styles.dot} />
        <Text style={styles.stat}>{item.sqft}</Text>
      </View>

      <View style={styles.addressRow}>
        <MapPinIcon size={ms(12)} color={colors.textMuted} />
        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>
      </View>
    </View>
  </Pressable>
);

const IMAGE_W = ms(112);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.sm + 2,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  image: {
    width: IMAGE_W,
    height: IMAGE_W * 0.9,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.navy,
  },
  badgeText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(9),
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typographyPresets.cardTitle,
    flex: 1,
    marginRight: spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  prefix: {
    ...typographyPresets.cardSubtitle,
  },
  per: {
    ...typographyPresets.cardSubtitle,
    color: colors.textMuted,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  stat: {
    ...typographyPresets.cardSubtitle,
    color: colors.textPrimary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textPrimary,
    marginHorizontal: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  address: {
    ...typographyPresets.cardSubtitle,
    flex: 1,
    color: colors.textMuted,
  },
});

export default RentalCard;

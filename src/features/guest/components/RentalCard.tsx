/**
 * RentalCard: "Rentals Near You" row. Photo on the left fills the card's
 * height (Premium badge on it). Right side, top to bottom: name + heart,
 * address, bed / bath / area with small icons (wrap if long), then the
 * price on its own line at the bottom.
 */

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
import { GUEST_IMAGE_ASPECT } from '../assets/guestAssets';
import { AreaIcon, BathIcon, BedIcon, HeartIcon, StarGlyph } from './GuestIcons';

interface Props {
  item: RentalListing;
  favorite: boolean;
  onToggleFavorite: () => void;
  onPress?: () => void;
}

const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <View style={styles.stat}>
    {icon}
    <Text style={styles.statText} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

export const RentalCard: React.FC<Props> = ({ item, favorite, onToggleFavorite, onPress }) => (
  <Pressable
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={item.name}
  >
    <View style={styles.media}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      {item.badgeInImage ? null : (
        <View style={styles.badge}>
          <StarGlyph size={scaleFont(9)} color={colors.gold} />
          <Text style={styles.badgeText}>Premium</Text>
        </View>
      )}
    </View>

    <View style={styles.body}>
      <View>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={10}
            style={styles.heart}
            accessibilityRole="button"
            accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon
              size={ms(16)}
              color={favorite ? colors.favorite : colors.textMuted}
              filled={favorite}
            />
          </Pressable>
        </View>

        <View style={styles.addressRow}>
          <MapPinIcon size={ms(11)} color={colors.textMuted} />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.stats}>
          <Stat icon={<BedIcon size={ms(13)} color={colors.navy} />} label={item.beds} />
          <Stat icon={<BathIcon size={ms(13)} color={colors.navy} />} label={item.baths} />
          <Stat icon={<AreaIcon size={ms(13)} color={colors.navy} />} label={item.sqft} />
        </View>
      </View>

      <View style={styles.priceRow}>
        {item.pricePrefix ? <Text style={styles.prefix}>{item.pricePrefix} </Text> : null}
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.per}> /mo</Text>
      </View>
    </View>
  </Pressable>
);

const IMAGE_W = ms(108);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.md,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.94,
  },
  media: {
    width: IMAGE_W,
    minHeight: IMAGE_W / GUEST_IMAGE_ASPECT.rental,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  // Explicit size so large photos scale down to the thumbnail on Android
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: IMAGE_W,
    height: '100%',
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
    marginLeft: spacing.lg,
    paddingVertical: spacing.xs,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typographyPresets.cardTitle,
    flex: 1,
    fontSize: scaleFont(15),
    color: colors.navy,
  },
  heart: {
    marginLeft: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  address: {
    flex: 1,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    color: colors.textMuted,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    rowGap: spacing.xs,
    marginTop: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
  },
  statText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11.5),
    color: colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.md,
  },
  prefix: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    color: colors.textSecondary,
  },
  price: {
    ...typographyPresets.price,
    color: colors.navy,
  },
  per: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    color: colors.textMuted,
  },
});

export default RentalCard;

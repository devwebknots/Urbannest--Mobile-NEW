/**
 * SimilarDealCard: small listing card in "Similar Deals" (two fit side by
 * side). Photo on top with the Premium pill, then name + heart, price,
 * address and bed / bath / area.
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
} from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { PropertySummary } from '../../types';
import { AreaIcon, BathIcon, BedIcon, HeartIcon } from '../GuestIcons';
import { PremiumPill } from './PremiumPill';

interface Props {
  item: PropertySummary;
  width: number;
  favorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const STAT_ICON = ms(12);

export const SimilarDealCard: React.FC<Props> = ({
  item,
  width,
  favorite,
  onPress,
  onToggleFavorite,
}) => {
  const imageH = Math.round(width * 0.62);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.name}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <View style={{ height: imageH }}>
        <Image source={item.image} style={{ width, height: imageH }} resizeMode="cover" />
        <View style={styles.badge}>
          <PremiumPill />
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
              size={ms(16)}
              color={favorite ? colors.favorite : colors.navy}
              filled={favorite}
            />
          </Pressable>
        </View>

        <Text style={styles.priceLine} numberOfLines={1}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.per}>/Month</Text>
        </Text>

        <View style={styles.addressRow}>
          <MapPinIcon size={ms(11)} color={colors.navy} />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <BedIcon size={STAT_ICON} color={colors.navy} />
            <Text style={styles.statText}>{item.beds}</Text>
          </View>
          <View style={styles.stat}>
            <BathIcon size={STAT_ICON} color={colors.navy} />
            <Text style={styles.statText}>{item.baths}</Text>
          </View>
          <View style={styles.stat}>
            <AreaIcon size={STAT_ICON} color={colors.navy} />
            <Text style={styles.statText}>{item.sqft}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.94,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  body: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12),
    color: colors.textSecondary,
  },
  priceLine: {
    marginTop: spacing.xxs,
  },
  price: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: scaleFont(14),
    color: colors.navy,
    fontWeight: typography.fontWeight.bold,
  },
  per: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11),
    color: colors.textSecondary,
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
    fontSize: scaleFont(10.5),
    color: colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.sm,
    rowGap: spacing.xxs,
    marginTop: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(3),
  },
  statText: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(10),
    color: colors.textPrimary,
  },
});

export default SimilarDealCard;

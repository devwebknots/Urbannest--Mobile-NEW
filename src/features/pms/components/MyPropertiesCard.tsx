/**
 * MyPropertiesCard: "My Property(s)" card from the design: header with the
 * count badge and chevron, a snapping row of property cards (photo with
 * green FOR RENT pill, name, location, price, units, occupancy pill), page
 * dots and a soft "View all properties" button.
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
  useWindowDimensions,
} from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { ManagedProperty } from '../types';
import { PmsIcon } from './PmsIcon';
import { ChevronButton, PmsCard } from './PmsCard';

/** Property card width as a share of the card's inner width */
const ITEM_SHARE = 0.8;
const PHOTO_H = ms(112);

interface Props {
  properties: readonly ManagedProperty[];
  onOpen: (property: ManagedProperty) => void;
  onViewAll: () => void;
}

export const MyPropertiesCard: React.FC<Props> = ({ properties, onOpen, onViewAll }) => {
  const { width } = useWindowDimensions();
  // Screen padding + card padding on both sides
  const inner = width - spacing.screenHorizontal * 2 - spacing.lg * 2;
  const itemWidth = Math.round(inner * ITEM_SHARE);
  const step = itemWidth + spacing.md;
  const [page, setPage] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / step);
    const clamped = Math.max(0, Math.min(properties.length - 1, next));
    setPage(prev => (prev === clamped ? prev : clamped));
  };

  return (
    <PmsCard
      icon="users"
      tint={colors.pmsPurple}
      title="My Property(s)"
      count={properties.length}
      right={<ChevronButton onPress={onViewAll} label="All properties" />}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scroller}
        contentContainerStyle={styles.row}
      >
        {properties.map(p => (
          <Pressable
            key={p.id}
            onPress={() => onOpen(p)}
            style={({ pressed }) => [styles.item, { width: itemWidth }, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`${p.name}, ${p.location}`}
          >
            <View style={styles.photoWrap}>
              <Image source={p.image} style={styles.photo} resizeMode="cover" />
              <View style={styles.status}>
                <Text style={[typographyPresets.tagSmall, styles.statusText]}>{p.status}</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={typographyPresets.cardTitle} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={typographyPresets.caption} numberOfLines={1}>
                {p.location}
              </Text>
              <View style={styles.meta}>
                <Text style={styles.price} numberOfLines={1}>
                  {p.price}
                  {p.priceSuffix ? <Text style={styles.suffix}>{p.priceSuffix}</Text> : null}
                </Text>
                <Text style={[typographyPresets.tag, styles.units]}>{p.units} Unit</Text>
                <View style={styles.occupancy}>
                  <Text style={[typographyPresets.badge, styles.occupancyText]}>
                    {p.occupancy}%
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dots} accessibilityLabel={`Property ${page + 1} of ${properties.length}`}>
        {properties.map((p, i) => (
          <View key={p.id} style={[styles.dot, i === page && styles.dotOn]} />
        ))}
      </View>

      <Button
        title="View all properties"
        variant="soft"
        size="md"
        onPress={onViewAll}
        leftIcon={<PmsIcon name="building" size={ms(16)} color={colors.navy} />}
      />
    </PmsCard>
  );
};

const styles = StyleSheet.create({
  // Cards run to the card's edges while scrolling
  scroller: {
    marginHorizontal: -spacing.lg,
    marginTop: spacing.lg,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  item: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  photoWrap: {
    height: PHOTO_H,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  status: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successDark,
  },
  statusText: {
    color: colors.white,
  },
  info: {
    padding: spacing.md,
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  price: {
    ...typographyPresets.bodyBold,
    flex: 1,
  },
  suffix: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  units: {
    color: colors.textSecondary,
  },
  occupancy: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.successLight,
  },
  occupancyText: {
    color: colors.successDark,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: ms(6),
    marginVertical: spacing.md,
  },
  dot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: colors.tileBlue,
  },
  dotOn: {
    backgroundColor: colors.primary,
  },
});

export default MyPropertiesCard;

/**
 * NeighborhoodCard: "Around Your Home". Category tabs (Schools / Hospitals
 * / Parks) switch a two-column grid of photo cards: photo with a distance
 * pill, then type, name and a "View details" hint. Card style matches
 * the guest home guide cards (white, hairline border, no heavy shadow).
 * "View on Map" sits below as the guest-style soft pill button.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MapPinIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { NeighborhoodCategory, NeighborhoodPlace } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  categories: readonly NeighborhoodCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
  onPlacePress: (place: NeighborhoodPlace) => void;
  onOpenMap: () => void;
}

/** Short tab labels ("Nearby Schools" -> "Schools") */
const tabLabel = (title: string) => title.replace(/^Nearby /, '').replace(/^Amusement /, '');

export const NeighborhoodCard: React.FC<Props> = ({
  categories,
  selectedId,
  onSelect,
  onPlacePress,
  onOpenMap,
}) => {
  const { width } = useWindowDimensions();
  const current = categories.find(c => c.id === selectedId) ?? categories[0];

  // Bundled images need exact pixel sizes (same as the guest guide cards)
  const cardW = (width - spacing.screenHorizontal * 2 - spacing.lg) / 2;
  const photo = { width: cardW, height: Math.round(cardW * 0.72) };

  return (
    <View style={styles.wrap}>
      <View style={styles.tabs}>
        {categories.map(c => {
          const on = c.id === current.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => onSelect(c.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={c.title}
              style={[styles.tab, on && styles.tabOn]}
            >
              <RenterIcon name={c.icon} size={ms(14)} color={on ? colors.white : colors.navy} />
              <Text style={[styles.tabText, on && styles.tabTextOn]} numberOfLines={1}>
                {tabLabel(c.title)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        {current.places.map(place => (
          <Pressable
            key={place.name}
            onPress={() => onPlacePress(place)}
            accessibilityRole="button"
            accessibilityLabel={`${place.name}, ${place.distance} away`}
            style={({ pressed }) => [styles.card, { width: cardW }, pressed && styles.pressed]}
          >
            <View style={photo}>
              <Image source={place.image} style={[styles.photo, photo]} resizeMode="cover" />
              <View style={styles.distance}>
                <MapPinIcon size={ms(11)} color={colors.navy} />
                <Text style={styles.distanceText}>{place.distance}</Text>
              </View>
            </View>
            <View style={styles.body}>
              <Text style={styles.meta} numberOfLines={1}>
                {place.meta}
              </Text>
              <Text style={styles.name} numberOfLines={2}>
                {place.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={onOpenMap}
        accessibilityRole="button"
        accessibilityLabel="View neighborhood map"
        style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}
      >
        <Text style={styles.mapText}>View on Map</Text>
        <ArrowRightIcon size={ms(14)} color={colors.navy} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    height: ms(34),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabOn: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  tabText: {
    ...typographyPresets.segmentLabel,
    color: colors.navy,
  },
  tabTextOn: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  pressed: {
    opacity: 0.92,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.surfaceMuted,
  },
  distance: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(3),
    paddingHorizontal: spacing.sm,
    paddingVertical: ms(3),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
  },
  distanceText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  body: {
    padding: spacing.md,
  },
  // Same as the guest guide card type line
  meta: {
    ...typographyPresets.eyebrow,
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(10),
    color: colors.primary,
  },
  name: {
    ...typographyPresets.bodyMedium,
    fontSize: typographyPresets.caption.fontSize,
    lineHeight: typographyPresets.caption.lineHeight,
    // Always 2 lines tall so both cards line up
    minHeight: typographyPresets.caption.lineHeight! * 2,
    color: colors.navy,
    marginTop: spacing.xs,
  },
  mapButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    height: ms(42),
    borderRadius: borderRadius.button,
    backgroundColor: colors.chipBlue,
  },
  mapText: {
    ...typographyPresets.button,
    color: colors.navy,
  },
});

export default NeighborhoodCard;

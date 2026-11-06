/**
 * NeighborhoodCard: one white card for all nearby places. A row of
 * category tabs (icon + label; navy when picked, pale otherwise) switches
 * the list below: numbered place rows (name, uppercase meta, distance
 * pill) split by hairlines, and a "View on Map" link at the bottom.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  const current = categories.find(c => c.id === selectedId) ?? categories[0];
  return (
    <View style={styles.card}>
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
              <RenterIcon name={c.icon} size={ms(15)} color={on ? colors.white : colors.navy} />
              <Text style={[styles.tabText, on && styles.tabTextOn]} numberOfLines={1}>
                {tabLabel(c.title)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {current.places.map((place, i) => (
        <Pressable
          key={place.name}
          onPress={() => onPlacePress(place)}
          accessibilityRole="button"
          accessibilityLabel={`${place.name}, ${place.distance}`}
          style={({ pressed }) => [styles.place, i > 0 && styles.placeDivider, pressed && styles.placePressed]}
        >
          <Text style={styles.index}>{String(i + 1).padStart(2, '0')}</Text>
          <View style={styles.placeText}>
            <Text style={styles.placeName} numberOfLines={1}>
              {place.name}
            </Text>
            <Text style={styles.placeMeta} numberOfLines={1}>
              {place.meta}
            </Text>
          </View>
          <View style={styles.distance}>
            <MapPinIcon size={ms(12)} color={colors.navy} />
            <Text style={styles.distanceText}>{place.distance}</Text>
          </View>
        </Pressable>
      ))}

      <Pressable
        onPress={onOpenMap}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="View neighborhood map"
        style={({ pressed }) => [styles.mapLink, pressed && styles.placePressed]}
      >
        <Text style={styles.mapLinkText}>View on Map</Text>
        <ArrowRightIcon size={ms(14)} color={colors.primary} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 0,
    borderRadius: borderRadius.xxl + 2,
    backgroundColor: colors.surface,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    padding: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.pageTint,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
    height: ms(38),
    borderRadius: borderRadius.pill,
  },
  tabOn: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(12.5),
    color: colors.navy,
  },
  tabTextOn: {
    color: colors.white,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  placeDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  placePressed: {
    opacity: 0.7,
  },
  index: {
    fontFamily: typography.fontFamily.heading.bold,
    fontSize: scaleFont(18),
    color: colors.textSubtle,
    width: ms(26),
  },
  placeText: {
    flex: 1,
  },
  placeName: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(14),
    color: colors.navy,
  },
  placeMeta: {
    ...typographyPresets.eyebrow,
    fontSize: scaleFont(10),
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    height: ms(28),
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(5),
    paddingVertical: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  mapLinkText: {
    ...typographyPresets.sectionLink,
    fontFamily: typography.fontFamily.body.semiBold,
  },
  distanceText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11.5),
    color: colors.navy,
  },
});

export default NeighborhoodCard;

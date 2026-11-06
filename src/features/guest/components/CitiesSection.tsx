import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { City } from '../types';

interface Props {
  cities: City[];
  onPress?: (id: string) => void;
}

const TILE_W = ms(100);
const TILE_H = ms(116);

export const CitiesSection: React.FC<Props> = ({ cities, onPress }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.content}
  >
    {cities.map(city => (
      <Pressable
        key={city.id}
        style={styles.tile}
        onPress={() => onPress?.(city.id)}
        accessibilityRole="button"
      >
        <Image source={city.image} style={styles.image} resizeMode="cover" />
        <Scrim edge="bottom" extent={0.6} maxOpacity={0.85} color={colors.black} />
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {city.name}
          </Text>
          <Text style={styles.count}>{city.listings}</Text>
        </View>
      </Pressable>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm + 2,
  },
  tile: {
    width: TILE_W,
    height: TILE_H,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.headerDarkBlue,
    justifyContent: 'flex-end',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: TILE_W,
    height: TILE_H,
  },
  body: {
    padding: spacing.sm + 2,
  },
  name: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(12.5),
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  count: {
    ...typographyPresets.caption,
    color: colors.textInverseMuted,
    marginTop: 1,
  },
});

export default CitiesSection;

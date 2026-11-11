/**
 * RoomStepper: horizontal row of every inspection area as round photo
 * thumbnails with a short name. Current area: navy ring and bold name.
 * Done areas: small secondary-blue tick. To-do areas are slightly faded.
 * Tapping a thumbnail jumps to that area.
 */

import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { InspectionArea } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

export interface RoomStep {
  area: InspectionArea;
  done: boolean;
  current: boolean;
}

interface Props {
  rooms: readonly RoomStep[];
  onSelect: (areaId: string) => void;
}

const THUMB = ms(48);
const RING = 2;

/** "Living Room" -> "Living", "Common Areas" -> "Common" */
const shortName = (label: string) => label.split(' ')[0];

export const RoomStepper: React.FC<Props> = ({ rooms, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.row}
  >
    {rooms.map(({ area, done, current }) => (
      <Pressable
        key={area.id}
        onPress={() => onSelect(area.id)}
        accessibilityRole="button"
        accessibilityState={{ selected: current }}
        accessibilityLabel={`${area.label}${done ? ', done' : ''}${current ? ', current' : ''}`}
        style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      >
        <View style={[styles.ring, current && styles.ringOn, !current && !done && styles.todo]}>
          <Image source={area.image} style={styles.thumb} resizeMode="cover" />
          {done ? (
            <View style={styles.tick}>
              <RenterIcon name="check" size={ms(8)} color={colors.white} />
            </View>
          ) : null}
        </View>
        <Text style={[styles.name, current && styles.nameOn]} numberOfLines={1}>
          {shortName(area.label)}
        </Text>
      </Pressable>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    gap: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
  },
  item: {
    alignItems: 'center',
    width: THUMB + RING * 4,
  },
  ring: {
    padding: RING,
    borderRadius: (THUMB + RING * 4) / 2,
    borderWidth: RING,
    borderColor: 'transparent',
  },
  ringOn: {
    borderColor: colors.navy,
  },
  todo: {
    opacity: 0.55,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
  },
  tick: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerGradientEnd,
    borderWidth: 2,
    borderColor: colors.pageTint,
  },
  name: {
    ...typographyPresets.caption,
    marginTop: spacing.xs,
  },
  nameOn: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default RoomStepper;

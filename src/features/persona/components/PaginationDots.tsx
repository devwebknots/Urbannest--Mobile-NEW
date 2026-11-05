/**
 * PaginationDots: small dots inside a frosted capsule, with a white pill
 * that glides to the current card. Follows the swipe in real time
 * (native driver).
 */

import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { borderRadius, colors } from '@/config/theme';

interface Props {
  count: number;
  scrollX: Animated.Value;
  itemWidth: number;
}

const DOT = 6;
const SLOT = 16;
const PILL = 22;

export const PaginationDots: React.FC<Props> = ({
  count,
  scrollX,
  itemWidth,
}) => {
  const inputRange = Array.from({ length: count }, (_, i) => i * itemWidth);
  const translateX = scrollX.interpolate({
    inputRange: count > 1 ? inputRange : [0, 1],
    outputRange: count > 1 ? inputRange.map((_, i) => i * SLOT) : [0, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.capsule} pointerEvents="none">
      <View style={[styles.track, { width: count * SLOT }]}>
        {Array.from({ length: count }, (_, i) => (
          <View key={i} style={styles.slot}>
            <View style={styles.dot} />
          </View>
        ))}
        <Animated.View style={[styles.pill, { transform: [{ translateX }] }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  capsule: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DOT,
  },
  slot: {
    width: SLOT,
    alignItems: 'center',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: (SLOT - PILL) / 2,
    width: PILL,
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: colors.white,
  },
});

export default PaginationDots;

/**
 * ResidenceFilterBar: segmented control (All Rentals / Active / Past).
 * One glass pill slides (spring) under the selected segment; each label
 * cross-fades navy <-> white as the pill passes, so nothing snaps.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { FILTERS } from '../constants';
import type { ResidenceFilter } from '../types';

interface Props {
  value: ResidenceFilter;
  counts: Record<ResidenceFilter, number>;
  onChange: (value: ResidenceFilter) => void;
}

interface Slot {
  x: number;
  width: number;
}

/** Fixed share of the track per segment (longer label gets more room). */
const WEIGHTS: Record<ResidenceFilter, number> = { all: 1.3, current: 1, past: 1 };

const TRACK_PAD = ms(5);

const SegmentContent: React.FC<{ label: string; count: number; active: boolean }> = ({
  label,
  count,
  active,
}) => (
  <View style={styles.content}>
    <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
      {label}
    </Text>
    <View style={[styles.badge, active && styles.badgeActive]}>
      <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{count}</Text>
    </View>
  </View>
);

export const ResidenceFilterBar: React.FC<Props> = ({ value, counts, onChange }) => {
  const index = FILTERS.findIndex(f => f.key === value);
  const position = useRef(new Animated.Value(index)).current;
  const [slots, setSlots] = useState<(Slot | undefined)[]>([]);

  useEffect(() => {
    Animated.spring(position, {
      toValue: index,
      // left/width are layout props, so this runs on the JS driver
      useNativeDriver: false,
      damping: 18,
      stiffness: 190,
      mass: 0.9,
    }).start();
  }, [index, position]);

  const onSlotLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setSlots(prev => {
      if (prev[i]?.x === x && prev[i]?.width === width) {
        return prev;
      }
      const next = [...prev];
      next[i] = { x, width };
      return next;
    });
  };

  const measured = slots.length === FILTERS.length && slots.every(Boolean);
  const range = FILTERS.map((_, i) => i);
  const pillStyle = measured
    ? {
        left: position.interpolate({
          inputRange: range,
          outputRange: slots.map(s => s!.x),
        }),
        width: position.interpolate({
          inputRange: range,
          outputRange: slots.map(s => s!.width),
        }),
      }
    : null;

  return (
    <View style={styles.track}>
      {pillStyle ? (
        <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]}>
          {/* Glass: smooth white sheen fading down from the top + light rim */}
          <Scrim edge="top" extent={0.75} maxOpacity={0.2} color={colors.white} />
          <View style={styles.pillEdge} />
        </Animated.View>
      ) : null}

      {FILTERS.map((f, i) => {
        const active = f.key === value;
        // 1 when the pill is centred on this segment, 0 one step away
        const on = position.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp',
        });
        const off = on.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
        return (
          <Pressable
            key={f.key}
            onPress={() => onChange(f.key)}
            onLayout={onSlotLayout(i)}
            style={[styles.segment, { flex: WEIGHTS[f.key] }]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${f.label} homes`}
          >
            {/* Before layout is known, show the plain active/inactive state */}
            <Animated.View style={{ opacity: measured ? off : active ? 0 : 1 }}>
              <SegmentContent label={f.label} count={counts[f.key]} active={false} />
            </Animated.View>
            <Animated.View
              style={[styles.activeLayer, { opacity: measured ? on : active ? 1 : 0 }]}
            >
              <SegmentContent label={f.label} count={counts[f.key]} active />
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
};

const PILL_H = ms(44);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenHorizontal,
    padding: TRACK_PAD,
    borderRadius: borderRadius.pill,
    // Frosted track
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  pill: {
    position: 'absolute',
    top: TRACK_PAD,
    height: PILL_H,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    backgroundColor: colors.navy,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  pillEdge: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  segment: {
    height: PILL_H,
    justifyContent: 'center',
  },
  activeLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(7),
  },
  label: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(13.5),
    color: colors.navy,
  },
  labelActive: {
    fontFamily: typography.fontFamily.body.semiBold,
    color: colors.white,
  },
  badge: {
    minWidth: ms(22),
    height: ms(22),
    paddingHorizontal: ms(5),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11),
    color: colors.textSecondary,
  },
  badgeTextActive: {
    color: colors.white,
  },
});

export default ResidenceFilterBar;

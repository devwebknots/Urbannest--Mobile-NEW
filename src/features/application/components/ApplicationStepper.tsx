/**
 * ApplicationStepper: the rental application's progress as numbered
 * circles on one thin track, step name under each:
 *  - current = bigger navy gradient circle with a soft glow and a slow
 *    pulsing halo; it pops in when the step is reached; navy name
 *  - done = smaller soft secondary-blue circle with a tick (app done
 *    colour); grey name
 *  - later = smaller white circle, pale blue rim, muted number / name
 * The track runs from the first to the last circle; its navy → blue fill
 * slides to the current circle when the step changes (scaleX, native
 * driver). Circles are tappable (`onStepPress`).
 * `edgeAligned` (landlord onboarding): first step on the left edge, last on
 * the right edge, so labels line up with the page text; the track and its
 * fill follow the measured circle centres.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { moderateScale as ms } from '@/utils/responsive';
import type { ApplicationStep } from '../types';

declare const process: { env: { NODE_ENV?: string } };
const IS_TEST = process.env.NODE_ENV === 'test';

interface Props {
  steps: readonly ApplicationStep[];
  current: number;
  /** Tap on another step */
  onStepPress?: (index: number) => void;
  /**
   * First step hugs the left edge and the last the right edge (each circle
   * stays centred over its label), so the labels line up with the page
   * text above. Default: every step centred in an equal column.
   */
  edgeAligned?: boolean;
}

interface Slot {
  x: number;
  width: number;
}

const BIG = ms(40);
const SMALL = ms(30);
const TRACK = 3;
// colors.headerGradientEnd (#518EF9) as rgb
const BLUE = '81,142,249';

/** Current step's circle: pops in, halo pulses slowly */
const ActiveCircle: React.FC<{ number: number }> = ({ number }) => {
  const pop = useRef(new Animated.Value(IS_TEST ? 1 : 0.6)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (IS_TEST) {
      return;
    }
    Animated.spring(pop, {
      toValue: 1,
      damping: 12,
      stiffness: 220,
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pop, pulse]);

  return (
    <View style={styles.activeWrap}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
            transform: [
              { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.6] }) },
            ],
          },
        ]}
      />
      <Animated.View style={[styles.active, { transform: [{ scale: pop }] }]}>
        <Text style={styles.activeNumber}>{number}</Text>
      </Animated.View>
    </View>
  );
};

export const ApplicationStepper: React.FC<Props> = ({
  steps,
  current,
  onStepPress,
  edgeAligned = false,
}) => {
  const [width, setWidth] = useState(0);
  // Edge-aligned: where each step's circle + label block sits in its column
  const [slots, setSlots] = useState<(Slot | undefined)[]>([]);
  const last = Math.max(steps.length - 1, 1);
  const colW = width / steps.length;

  // Circle centres across the row
  const centers = steps.map((_, i) => {
    const slot = edgeAligned ? slots[i] : undefined;
    return slot ? colW * i + slot.x + slot.width / 2 : colW * i + colW / 2;
  });
  const trackStart = centers[0] ?? 0;
  const trackLength = Math.max((centers[centers.length - 1] ?? 0) - trackStart, 1);
  const fraction = edgeAligned
    ? ((centers[current] ?? trackStart) - trackStart) / trackLength
    : current / last;

  const progress = useRef(new Animated.Value(current / last)).current;

  useEffect(() => {
    const to = fraction;
    if (IS_TEST) {
      progress.setValue(to);
      return;
    }
    Animated.timing(progress, {
      toValue: to,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fraction, progress]);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const onSlotLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width: w } = e.nativeEvent.layout;
    setSlots(prev => {
      if (prev[i]?.x === x && prev[i]?.width === w) {
        return prev;
      }
      const next = [...prev];
      next[i] = { x, width: w };
      return next;
    });
  };
  const colAlign = (i: number) =>
    !edgeAligned
      ? undefined
      : i === 0
        ? styles.colStart
        : i === steps.length - 1
          ? styles.colEnd
          : undefined;

  return (
    <View
      onLayout={onLayout}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${steps.length}, ${steps[current]?.label}`}
    >
      {/* Track from the first circle's centre to the last one's */}
      {width > 0 ? (
        <View style={[styles.track, { left: trackStart, width: trackLength }]}>
          <Animated.View style={[styles.trackFill, { transform: [{ scaleX: progress }] }]} />
        </View>
      ) : null}

      <View style={styles.row}>
        {steps.map((step, i) => {
          const active = i === current;
          const done = i < current;
          return (
            <Pressable
              key={step.id}
              onPress={onStepPress && !active ? () => onStepPress(i) : undefined}
              disabled={!onStepPress || active}
              hitSlop={6}
              style={[styles.col, colAlign(i)]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Step ${i + 1}, ${step.label}${done ? ', done' : ''}`}
            >
              {({ pressed }) => (
                <View
                  style={styles.slot}
                  onLayout={edgeAligned ? onSlotLayout(i) : undefined}
                >
                  <View style={styles.circleSlot}>
                    {active ? (
                      <ActiveCircle key={`active-${current}`} number={i + 1} />
                    ) : (
                      <View
                        style={[
                          styles.small,
                          done && styles.smallDone,
                          pressed && styles.smallPressed,
                        ]}
                      >
                        {done ? (
                          <RenterIcon name="check" size={ms(12)} color={colors.white} />
                        ) : (
                          <Text style={styles.smallNumber}>{i + 1}</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.label,
                      edgeAligned && styles.labelEdge,
                      active && styles.labelActive,
                      done && styles.labelDone,
                    ]}
                    numberOfLines={2}
                  >
                    {step.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    top: BIG / 2 - TRACK / 2,
    height: TRACK,
    borderRadius: TRACK,
    overflow: 'hidden',
    backgroundColor: `rgba(${BLUE},0.18)`,
  },
  trackFill: {
    ...StyleSheet.absoluteFill,
    transformOrigin: 'left center',
    backgroundImage: `linear-gradient(90deg, ${colors.buttonGradientStart} 0%, ${colors.headerGradientEnd} 100%)`,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  // Edge-aligned: first step hugs the left edge, last the right edge
  colStart: {
    alignItems: 'flex-start',
  },
  colEnd: {
    alignItems: 'flex-end',
  },
  // Circle + label block; the circle stays centred over the label
  slot: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  circleSlot: {
    height: BIG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWrap: {
    width: BIG,
    height: BIG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: BIG,
    height: BIG,
    borderRadius: BIG / 2,
    backgroundColor: colors.headerGradientEnd,
  },
  active: {
    width: BIG,
    height: BIG,
    borderRadius: BIG / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    backgroundImage: `linear-gradient(135deg, ${colors.buttonGradientStart} 0%, ${colors.buttonGradientEnd} 100%)`,
    boxShadow: `0 6px 16px rgba(${BLUE},0.45)`,
  },
  activeNumber: {
    ...typographyPresets.bodyBold,
    color: colors.white,
  },
  small: {
    width: SMALL,
    height: SMALL,
    borderRadius: SMALL / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: `rgba(${BLUE},0.3)`,
    ...shadows.sm,
  },
  // DONE_BLUE is 70% see-through: lay it over solid white so the track
  // behind the circle doesn't show through
  smallDone: {
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,
    backgroundImage: `linear-gradient(${DONE_BLUE}, ${DONE_BLUE})`,
  },
  smallPressed: {
    transform: [{ scale: 0.9 }],
  },
  smallNumber: {
    ...typographyPresets.badge,
    color: colors.textSecondary,
  },
  label: {
    ...typographyPresets.badge,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
    textAlign: 'center',
    color: colors.textMuted,
  },
  // No side padding, so the first / last label meets the page edge exactly
  labelEdge: {
    paddingHorizontal: 0,
  },
  labelActive: {
    color: colors.navy,
  },
  labelDone: {
    color: colors.textSecondary,
  },
});

export default ApplicationStepper;

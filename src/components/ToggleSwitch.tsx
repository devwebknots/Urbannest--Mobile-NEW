/**
 * ToggleSwitch: the app's on / off switch. Off: light track (TILE_BORDER)
 * with a white knob; on: brand-gradient track, knob slides right.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { colors, gradients } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';

const TRACK_W = ms(44);
const TRACK_H = ms(26);
const KNOB = ms(20);
const PAD = (TRACK_H - KNOB) / 2;

export const ToggleSwitch: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel: string;
}> = ({ value, onChange, accessibilityLabel }) => {
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(x, { toValue: value ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [value, x]);

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.track, value && styles.trackOn]}
    >
      <Animated.View
        style={[
          styles.knob,
          {
            transform: [
              {
                translateX: x.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, TRACK_W - KNOB - PAD * 2],
                }),
              },
            ],
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    padding: PAD,
    borderRadius: TRACK_H / 2,
    backgroundColor: TILE_BORDER,
  },
  trackOn: {
    backgroundImage: `linear-gradient(90deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
    boxShadow: '0px 1px 3px rgba(11,29,58,0.25)',
  },
});

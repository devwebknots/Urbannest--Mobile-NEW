/**
 * CircleIconButton: small round icon button (chevron, arrow).
 *  - outline: white fill, soft blue rim (on the page and on white cards)
 *  - solid:   white fill, no rim, soft shadow (on photos)
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { TILE_BORDER } from './checkin/CheckInChecklist';

interface Props {
  icon: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: 'outline' | 'solid';
  /** Diameter, default 36 */
  size?: number;
  disabled?: boolean;
}

export const CircleIconButton: React.FC<Props> = ({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'outline',
  size = ms(36),
  disabled = false,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    hitSlop={6}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ disabled }}
    style={({ pressed }) => [
      styles.base,
      variant === 'outline' ? styles.outline : styles.solid,
      { width: size, height: size, borderRadius: size / 2 },
      disabled && styles.disabled,
      pressed && styles.pressed,
    ]}
  >
    {icon}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  outline: {
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  solid: {
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default CircleIconButton;

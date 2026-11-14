/**
 * ProfileAvatar: the standard round initials button ("AM") at the top
 * right of page headers. White circle, navy initials, soft white rim.
 * Use this everywhere a header shows the signed-in user.
 */

import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, typography, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

/** Standard avatar size in headers */
export const PROFILE_AVATAR_SIZE = ms(36);

interface Props {
  initials: string;
  /** Optional: without it the avatar is just a picture (not a button) */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * light (default): white circle, navy initials.
   * glass: translucent white circle, white initials (landlord hero).
   */
  variant?: 'light' | 'glass';
}

export const ProfileAvatar: React.FC<Props> = ({
  initials,
  onPress,
  style,
  variant = 'light',
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => [
      styles.avatar,
      variant === 'glass' && styles.glass,
      pressed && styles.pressed,
      style,
    ]}
    disabled={!onPress}
    accessibilityRole={onPress ? 'button' : 'image'}
    accessibilityLabel="Profile"
  >
    <Text style={[styles.text, variant === 'glass' && styles.glassText]} numberOfLines={1}>
      {initials}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  avatar: {
    width: PROFILE_AVATAR_SIZE,
    height: PROFILE_AVATAR_SIZE,
    borderRadius: PROFILE_AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  // Button text, one step smaller so two letters fit the smaller circle
  text: {
    ...typographyPresets.button,
    fontSize: typography.fontSize.sm,
    color: colors.navy,
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  glassText: {
    color: colors.white,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default ProfileAvatar;

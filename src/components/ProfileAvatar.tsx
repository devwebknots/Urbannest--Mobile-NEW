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
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ProfileAvatar: React.FC<Props> = ({ initials, onPress, style }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    style={({ pressed }) => [styles.avatar, pressed && styles.pressed, style]}
    accessibilityRole="button"
    accessibilityLabel="Profile"
  >
    <Text style={styles.text} numberOfLines={1}>
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
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default ProfileAvatar;

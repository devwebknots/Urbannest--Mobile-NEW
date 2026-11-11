/**
 * IconTile: the app's square icon tile with a label underneath (first
 * used for the guest home categories: Single, Multi, Apartments...).
 * 54 rounded `tileBlue` square with a soft white rim, navy icon inside,
 * Inter Medium 11 label below. Use it for any short row of choices.
 * `selected` adds the soft secondary-blue tick on the tile's corner
 * (no border or fill change, like the Check-In tiles).
 */

import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { CheckmarkIcon } from './icons';

/** Icon size that fits the tile */
export const ICON_TILE_ICON = ms(22);

/** Secondary blue at 70%, the app's "done / selected" tick colour */
const TICK_BLUE = `${colors.headerGradientEnd}B3`;

interface Props {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** 'radio' for a single choice, 'button' for navigation */
  role?: 'radio' | 'button';
  style?: StyleProp<ViewStyle>;
}

export const IconTile: React.FC<Props> = ({
  icon,
  label,
  selected = false,
  onPress,
  role = 'button',
  style,
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole={role}
    accessibilityState={role === 'radio' ? { selected } : undefined}
    accessibilityLabel={label}
    style={({ pressed }) => [styles.item, pressed && styles.pressed, style]}
  >
    <View style={styles.tile}>
      {icon}
      {selected ? (
        <View style={styles.tick}>
          <CheckmarkIcon size={ms(9)} color={colors.white} />
        </View>
      ) : null}
    </View>
    <Text style={styles.label} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

const TILE = ms(54);
const TICK = ms(18);

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.tileBlue,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    top: -ms(5),
    right: -ms(5),
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TICK_BLUE,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  label: {
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11),
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default IconTile;

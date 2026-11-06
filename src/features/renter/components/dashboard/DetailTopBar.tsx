/**
 * DetailTopBar: floating glass back + avatar buttons over the hero photo.
 * Once the photo scrolls away, a navy bar with the residence name fades in
 * behind them.
 */

import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeftIcon } from '@/components/icons';
import { colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';

interface Props {
  topInset: number;
  title: string;
  initials: string;
  scrollY: Animated.Value;
  /** Scroll offset where the solid bar is fully shown */
  solidAt: number;
  onBack: () => void;
  onProfilePress: () => void;
}

export const DetailTopBar: React.FC<Props> = ({
  topInset,
  title,
  initials,
  scrollY,
  solidAt,
  onBack,
  onProfilePress,
}) => {
  const solid = scrollY.interpolate({
    inputRange: [solidAt - ms(90), solidAt],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  return (
    <View pointerEvents="box-none" style={[styles.root, { paddingTop: topInset + spacing.sm }]}>
      <Animated.View pointerEvents="none" style={[styles.backdrop, { opacity: solid }]} />

      <View pointerEvents="box-none" style={styles.row}>
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.glass, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Back to my residences"
        >
          <ChevronLeftIcon size={ms(18)} color={colors.white} />
        </Pressable>

        <Animated.Text style={[styles.title, { opacity: solid }]} numberOfLines={1}>
          {title}
        </Animated.Text>

        <Pressable
          onPress={onProfilePress}
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const BTN = ms(40);

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.94)',
    borderBottomLeftRadius: ms(22),
    borderBottomRightRadius: ms(22),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  glass: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,29,58,0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
  title: {
    flex: 1,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    fontFamily: typography.fontFamily.heading.bold,
    fontSize: scaleFont(17),
    color: colors.white,
  },
  avatar: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(12.5),
    color: colors.navy,
    letterSpacing: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default DetailTopBar;

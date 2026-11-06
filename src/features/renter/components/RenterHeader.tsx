/**
 * RenterHeader: brand + avatar, "MY RENTALS" eyebrow, "My Residences"
 * title and subtitle. The navy header art (with the faded house photo)
 * is drawn behind it by the screen, so it can also sit under the filter.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { HomeIcon } from '@/components/icons';
import { colors, spacing, typography, typographyPresets } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';

interface Props {
  topInset: number;
  initials: string;
  onProfilePress: () => void;
}

export const RenterHeader: React.FC<Props> = ({ topInset, initials, onProfilePress }) => (
  <View style={[styles.root, { paddingTop: topInset + spacing.md }]}>
    <View style={styles.topRow}>
      <View style={styles.brand}>
        <HomeIcon size={ms(24)} color={colors.white} />
        <Text style={styles.brandText}>URBAN NEST</Text>
      </View>
      <Pressable
        onPress={onProfilePress}
        style={styles.avatar}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </Pressable>
    </View>

    <View style={styles.copy}>
      <Text style={styles.eyebrow}>My Rentals</Text>
      <Text style={styles.title}>My Residences</Text>
      <Text style={styles.subtitle}>
        The properties you're currently renting{'\n'}and previously lived in.
      </Text>
    </View>
  </View>
);

const AVATAR = ms(42);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.screenHorizontal + 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  brandText: {
    fontFamily: typography.fontFamily.body.bold,
    fontSize: scaleFont(17),
    letterSpacing: 1.6,
    color: colors.white,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  avatarText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(13),
    color: colors.navy,
    letterSpacing: 0.5,
  },
  copy: {
    marginTop: spacing.xxxl,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: 'rgba(199,210,254,0.85)',
    letterSpacing: 3,
  },
  title: {
    ...typographyPresets.heroTitle,
    fontSize: scaleFont(34),
    lineHeight: scaleFont(42),
    marginTop: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.base,
    lineHeight: scaleFont(21),
    color: 'rgba(226,232,240,0.85)',
    marginTop: spacing.sm,
  },
});

export default RenterHeader;

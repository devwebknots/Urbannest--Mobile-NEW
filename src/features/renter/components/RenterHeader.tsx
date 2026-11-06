/**
 * RenterHeader: brand + avatar, "MY RENTALS" eyebrow, "My Residences"
 * title and subtitle. The navy header art (with the faded house photo)
 * is drawn behind it by the screen, so it can also sit under the filter.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BrandLockup } from '@/components/BrandLogo';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  topInset: number;
  initials: string;
  onProfilePress: () => void;
}

export const RenterHeader: React.FC<Props> = ({ topInset, initials, onProfilePress }) => (
  <View style={[styles.root, { paddingTop: topInset + spacing.md }]}>
    <View style={styles.topRow}>
      <BrandLockup
        label="URBAN NEST"
        logoSize={ms(20)}
        gap={spacing.sm}
        textStyle={typographyPresets.brandTitle}
        style={styles.brand}
      />
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
      <Text style={[typographyPresets.heroSubtitle, styles.subtitle]}>
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
    ...typographyPresets.button,
    color: colors.navy,
  },
  copy: {
    marginTop: spacing.xxxl,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: 'rgba(199,210,254,0.85)',
  },
  title: {
    ...typographyPresets.heroTitle,
    marginTop: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});

export default RenterHeader;

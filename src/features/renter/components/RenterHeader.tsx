/**
 * RenterHeader: brand + avatar, "MY RENTALS" eyebrow, "My Residences"
 * title and subtitle. The navy header art (with the faded house photo)
 * is drawn behind it by the screen, so it can also sit under the filter.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HeaderBrand } from '@/components/BrandLogo';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { spacing, typographyPresets } from '@/config/theme';

interface Props {
  topInset: number;
  initials: string;
  onProfilePress: () => void;
}

export const RenterHeader: React.FC<Props> = ({ topInset, initials, onProfilePress }) => (
  <View style={[styles.root, { paddingTop: topInset + spacing.md }]}>
    <View style={styles.topRow}>
      <HeaderBrand style={styles.brand} />
      <ProfileAvatar initials={initials} onPress={onProfilePress} />
    </View>

    <View style={styles.copy}>
      {/* <Text style={styles.eyebrow}>My Rentals</Text> */}
      <Text style={styles.title}>My Residences</Text>
      <Text style={[typographyPresets.heroSubtitle, styles.subtitle]}>
        The properties you're currently renting{'\n'}and previously lived in.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    // Same side padding as the guest header
    paddingHorizontal: spacing.screenHorizontal,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flex: 1,
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

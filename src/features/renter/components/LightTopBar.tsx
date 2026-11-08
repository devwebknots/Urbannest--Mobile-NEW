/**
 * LightTopBar: top bar for the light renter pages (no photo hero):
 * round white back button, centered Playfair title, profile avatar.
 * Same look as the inspection room page's bar. Sits inside the scroll view.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeftIcon } from '@/components/icons';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { TILE_BORDER } from './checkin/CheckInChecklist';

interface Props {
  /** Optional: without it the bar keeps just back + avatar */
  title?: string;
  /** Optional: without initials / onProfilePress the avatar is hidden */
  initials?: string;
  onBack: () => void;
  onProfilePress?: () => void;
  backLabel?: string;
}

export const LightTopBar: React.FC<Props> = ({
  title,
  initials,
  onBack,
  onProfilePress,
  backLabel = 'Back',
}) => (
  <View style={styles.bar}>
    <Pressable
      onPress={onBack}
      hitSlop={8}
      style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
      accessibilityRole="button"
      accessibilityLabel={backLabel}
    >
      <ChevronLeftIcon size={ms(18)} color={colors.navy} />
    </Pressable>
    {/* Same flex slot with or without a title, so the avatar stays right */}
    <Text style={styles.title} numberOfLines={1}>
      {title ?? ''}
    </Text>
    {initials && onProfilePress ? (
      <ProfileAvatar initials={initials} onPress={onProfilePress} />
    ) : null}
  </View>
);

const BTN = ms(40);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
  },
  back: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  backPressed: {
    transform: [{ scale: 0.94 }],
  },
  title: {
    ...typographyPresets.sectionTitle,
    flex: 1,
    marginHorizontal: spacing.md,
    textAlign: 'center',
    color: colors.navy,
  },
});

export default LightTopBar;

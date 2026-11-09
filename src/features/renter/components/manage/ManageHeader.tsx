/**
 * ManageHeader: top of the Manage page, on the light page tint (the
 * screen draws a faded building photo behind the right side):
 *  - back button, blue bell with unread badge, lavender avatar
 *  - "MY HOME" eyebrow, "Good afternoon," + first name in brand blue
 *  - short gradient rule under the greeting
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { /* BellIcon, */ ChevronLeftIcon } from '@/components/icons';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  topInset: number;
  greeting: string;
  firstName: string;
  initials: string;
  unreadAlerts: number;
  onBack: () => void;
  onNotifications: () => void;
  onProfilePress: () => void;
}

export const ManageHeader: React.FC<Props> = ({
  topInset,
  greeting,
  firstName,
  initials,
  // unreadAlerts and onNotifications: used by the hidden bell
  onBack,
  onProfilePress,
}) => (
  <View style={[styles.root, { paddingTop: topInset + spacing.sm }]}>
    <View style={styles.topRow}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.glass, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Back to my residences"
      >
        <ChevronLeftIcon size={ms(18)} color={colors.white} />
      </Pressable>
      <View style={styles.flex} />

      {/* Notification bell hidden for now
      <Pressable
        onPress={onNotifications}
        hitSlop={8}
        style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`Notifications, ${unreadAlerts} unread`}
      >
        <BellIcon size={ms(22)} color={colors.primary} />
        {unreadAlerts > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadAlerts > 9 ? '9+' : unreadAlerts}</Text>
          </View>
        ) : null}
      </Pressable> */}
      <ProfileAvatar initials={initials} onPress={onProfilePress} style={styles.avatar} />
    </View>

    <View style={styles.copy}>
      <Text style={styles.eyebrow}>My Home</Text>
      <Text style={styles.title}>
        {greeting},{'\n'}
        <Text style={styles.name}>{firstName}</Text>
      </Text>
      <View style={styles.rule} />
    </View>
  </View>
);

const BTN = ms(40);
const BADGE = ms(17);
const AVATAR = ms(40);

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  // Back button: same navy glass circle as the Check-In page (DetailTopBar)
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
  // Plain bell (no circle), like the design
  bell: {
    width: BTN,
    height: BTN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  badge: {
    position: 'absolute',
    top: ms(3),
    right: ms(3),
    minWidth: BADGE,
    height: BADGE,
    paddingHorizontal: ms(4),
    borderRadius: BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.favorite,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    ...typographyPresets.premiumBadge,
  },
  // Lavender circle, navy initials
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    marginLeft: spacing.md,
    backgroundColor: colors.avatarPurple.bg,
    borderColor: colors.white,
  },
  copy: {
    marginTop: spacing.xxl,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: colors.navy,
  },
  name: {
    color: colors.primary,
  },
  title: {
    ...typographyPresets.heroTitle,
    marginTop: spacing.xs,
    color: colors.navy,
  },
  // Short blue-to-violet accent rule under the greeting
  rule: {
    width: ms(32),
    height: 3,
    marginTop: spacing.md,
    borderRadius: 2,
    backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.avatarPurple.text})`,
  },
});

export default ManageHeader;

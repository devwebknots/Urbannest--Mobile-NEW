/**
 * LandlordSideMenu: the landlord dashboard's burger menu. Reuses the guest
 * GuestSideMenu drawer as is (slide in from the right over a dimmed page,
 * navy header + close, grouped options, closes on backdrop / back / swipe,
 * choice reported after the close animation); only the content differs:
 *  - header: landlord avatar, name and role
 *  - options: Portfolio → Properties (more items later)
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { colors, spacing, typographyPresets } from '@/config/theme';
import {
  GuestSideMenu,
  SIDE_MENU_ICON,
  SideMenuGroup,
} from '@/features/guest/components/GuestSideMenu';
import type { LandlordProfile } from '../types';
import { LandlordIcon } from './LandlordIcon';

export type LandlordMenuKey = 'properties';

const GROUPS: SideMenuGroup<LandlordMenuKey>[] = [
  {
    title: 'Portfolio',
    items: [
      {
        key: 'properties',
        label: 'Properties',
        icon: c => <LandlordIcon name="building" size={SIDE_MENU_ICON} color={c} />,
      },
    ],
  },
];

interface Props {
  visible: boolean;
  profile: LandlordProfile;
  onClose: () => void;
  onSelect: (key: LandlordMenuKey) => void;
}

export const LandlordSideMenu: React.FC<Props> = ({ visible, profile, onClose, onSelect }) => (
  <GuestSideMenu<LandlordMenuKey>
    visible={visible}
    onClose={onClose}
    onSelect={onSelect}
    groups={GROUPS}
    header={
      <View style={styles.profile}>
        <ProfileAvatar initials={profile.initials} variant="glass" />
        <View style={styles.profileText}>
          <Text style={styles.name} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text style={styles.role} numberOfLines={1}>
            {profile.role}
          </Text>
        </View>
      </View>
    }
  />
);

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  profileText: {
    flex: 1,
  },
  name: {
    ...typographyPresets.bodyBold,
    color: colors.white,
  },
  role: {
    ...typographyPresets.cardSubtitle,
    color: 'rgba(255, 255, 255, 0.72)',
  },
});

export default LandlordSideMenu;

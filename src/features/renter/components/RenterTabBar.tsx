/**
 * RenterTabBar: floating bottom bar for the renter area
 * (Residences, Search, Alerts, Profile). Icon above label;
 * the active tab sits on a navy rounded tile.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BellIcon, HomeIcon, SearchIcon, UserIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { RenterTab } from '../types';

interface Props {
  active: RenterTab;
  bottomInset: number;
  hasAlerts: boolean;
  onChange: (tab: RenterTab) => void;
}

const TABS: { key: RenterTab; label: string }[] = [
  { key: 'residences', label: 'Residences' },
  { key: 'search', label: 'Search' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'profile', label: 'Profile' },
];

const TabIcon: React.FC<{ tab: RenterTab; color: string }> = ({ tab, color }) => {
  const size = ms(21);
  if (tab === 'residences') return <HomeIcon size={size} color={color} />;
  if (tab === 'search') return <SearchIcon size={size} color={color} />;
  if (tab === 'alerts') return <BellIcon size={size} color={color} />;
  return <UserIcon size={size} color={color} />;
};

/** Height of the bar itself, without the bottom inset. */
export const RENTER_TAB_BAR_HEIGHT = ms(72);

export const RenterTabBar: React.FC<Props> = ({
  active,
  bottomInset,
  hasAlerts,
  onChange,
}) => (
  <View style={[styles.wrap, { paddingBottom: Math.max(bottomInset, spacing.md) }]}>
    <View style={styles.bar}>
      {TABS.map(tab => {
        const selected = tab.key === active;
        const color = selected ? colors.white : colors.navy;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, selected && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
          >
            <View>
              <TabIcon tab={tab.key} color={color} />
              {tab.key === 'alerts' && hasAlerts ? <View style={styles.alertDot} /> : null}
            </View>
            <Text style={[styles.label, selected && styles.labelActive]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.md,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: RENTER_TAB_BAR_HEIGHT,
    paddingHorizontal: ms(6),
    borderRadius: borderRadius.header,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 12,
  },
  tab: {
    flex: 1,
    height: RENTER_TAB_BAR_HEIGHT - ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(4),
    borderRadius: borderRadius.xxl + 2,
  },
  tabActive: {
    flex: 1.35,
    backgroundColor: colors.navy,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(12),
    color: colors.navy,
  },
  labelActive: {
    fontFamily: typography.fontFamily.body.semiBold,
    color: colors.white,
  },
  alertDot: {
    position: 'absolute',
    top: -1,
    right: -2,
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});

export default RenterTabBar;

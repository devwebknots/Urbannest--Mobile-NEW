/**
 * RenterTabBar: floating frosted bar (Residences, Search, Alerts, Profile).
 * A glass capsule springs under the selected tab; icons and labels
 * cross-fade navy <-> white as it passes. Same language as ResidenceFilterBar.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BellIcon, HomeIcon, SearchIcon, UserIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { RenterTab } from '../types';

interface Props {
  active: RenterTab;
  bottomInset: number;
  hasAlerts: boolean;
  onChange: (tab: RenterTab) => void;
}

interface Slot {
  x: number;
  width: number;
}

const TABS: { key: RenterTab; label: string }[] = [
  { key: 'residences', label: 'Homes' },
  { key: 'search', label: 'Search' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'profile', label: 'Profile' },
];

const TabIcon: React.FC<{ tab: RenterTab; color: string }> = ({ tab, color }) => {
  const size = ms(19);
  if (tab === 'residences') return <HomeIcon size={size} color={color} />;
  if (tab === 'search') return <SearchIcon size={size} color={color} />;
  if (tab === 'alerts') return <BellIcon size={size} color={color} />;
  return <UserIcon size={size} color={color} />;
};

const TabContent: React.FC<{
  tab: RenterTab;
  label: string;
  selected: boolean;
  showDot: boolean;
}> = ({ tab, label, selected, showDot }) => (
  <View style={styles.content}>
    <View>
      <TabIcon tab={tab} color={selected ? colors.white : colors.textSecondary} />
      {showDot ? <View style={[styles.alertDot, selected && styles.alertDotOnPill]} /> : null}
    </View>
    <Text style={[styles.label, selected && styles.labelActive]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

/** Height of the bar itself, without the bottom inset. */
export const RENTER_TAB_BAR_HEIGHT = ms(68);

// Capsule is centred in the bar with even room on every side
const PILL_H = ms(52);
const PILL_TOP = (RENTER_TAB_BAR_HEIGHT - PILL_H) / 2;
const PILL_INSET_X = ms(3);
const BAR_PAD_X = PILL_TOP - PILL_INSET_X;

export const RenterTabBar: React.FC<Props> = ({
  active,
  bottomInset,
  hasAlerts,
  onChange,
}) => {
  const index = Math.max(0, TABS.findIndex(t => t.key === active));
  const position = useRef(new Animated.Value(index)).current;
  const [slots, setSlots] = useState<(Slot | undefined)[]>([]);

  useEffect(() => {
    Animated.spring(position, {
      toValue: index,
      // left/width are layout props, so this runs on the JS driver
      useNativeDriver: false,
      damping: 18,
      stiffness: 190,
      mass: 0.9,
    }).start();
  }, [index, position]);

  const onSlotLayout = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setSlots(prev => {
      if (prev[i]?.x === x && prev[i]?.width === width) {
        return prev;
      }
      const next = [...prev];
      next[i] = { x, width };
      return next;
    });
  };

  const measured = slots.length === TABS.length && slots.every(Boolean);
  const range = TABS.map((_, i) => i);
  const pillStyle = measured
    ? {
        left: position.interpolate({
          inputRange: range,
          outputRange: slots.map(s => s!.x + PILL_INSET_X),
        }),
        width: position.interpolate({
          inputRange: range,
          outputRange: slots.map(s => s!.width - PILL_INSET_X * 2),
        }),
      }
    : null;

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(bottomInset, spacing.md) }]}>
      <View style={styles.bar}>
        {pillStyle ? (
          <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]}>
            <Scrim edge="top" extent={0.75} maxOpacity={0.2} color={colors.white} />
            <View style={styles.pillEdge} />
          </Animated.View>
        ) : null}

        {TABS.map((tab, i) => {
          const selected = tab.key === active;
          const on = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });
          const off = on.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
          const showDot = tab.key === 'alerts' && hasAlerts;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onChange(tab.key)}
              onLayout={onSlotLayout(i)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
            >
              <Animated.View style={{ opacity: measured ? off : selected ? 0 : 1 }}>
                <TabContent tab={tab.key} label={tab.label} selected={false} showDot={showDot} />
              </Animated.View>
              <Animated.View
                style={[styles.activeLayer, { opacity: measured ? on : selected ? 1 : 0 }]}
              >
                <TabContent tab={tab.key} label={tab.label} selected showDot={showDot} />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: RENTER_TAB_BAR_HEIGHT,
    paddingHorizontal: BAR_PAD_X,
    borderRadius: borderRadius.pill,
    // Frosted bar (no border, so the capsule maths stays exact)
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 12,
  },
  pill: {
    position: 'absolute',
    top: PILL_TOP,
    height: PILL_H,
    borderRadius: borderRadius.pill,
    overflow: 'hidden',
    backgroundColor: colors.navy,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  pillEdge: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  tab: {
    flex: 1,
    height: RENTER_TAB_BAR_HEIGHT,
    justifyContent: 'center',
  },
  activeLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: ms(4),
  },
  label: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(11),
    lineHeight: scaleFont(14),
    letterSpacing: 0.2,
    color: colors.textSecondary,
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
  alertDotOnPill: {
    backgroundColor: colors.heroAccent,
    borderColor: colors.navy,
  },
});

export default RenterTabBar;

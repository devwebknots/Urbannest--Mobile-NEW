/**
 * RenterTabBar: floating frosted bar (Residences, Search, Alerts, Calendar).
 * A glass capsule springs under the selected tab; icons and labels
 * cross-fade navy <-> white as it passes. Same language as ResidenceFilterBar.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BellIcon, CalendarIcon, HomeIcon, SearchIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';
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
  { key: 'calendar', label: 'Calendar' },
];

const TabIcon: React.FC<{ tab: RenterTab; color: string }> = ({ tab, color }) => {
  const size = ms(19);
  if (tab === 'residences') return <HomeIcon size={size} color={color} />;
  if (tab === 'search') return <SearchIcon size={size} color={color} />;
  if (tab === 'alerts') return <BellIcon size={size} color={color} />;
  return <CalendarIcon size={size} color={color} />;
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

/** Insets this tall mean Android's 3-button nav bar (gesture handles are ~16-34dp). */
const BUTTON_NAV_MIN_INSET = 40;

/** 20 physical screen pixels, converted to dp for this phone's density. */
const GAP_20PX = 20 / PixelRatio.get();

/**
 * Space under the floating bar: 20 physical pixels from the screen edge,
 * so the bar sits over the gesture-handle strip. With 3-button nav it stays
 * the same 20px above the buttons instead.
 */
export const renterTabBarBottomGap = (bottomInset: number) =>
  bottomInset >= BUTTON_NAV_MIN_INSET ? bottomInset + GAP_20PX : GAP_20PX;

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
    <View style={[styles.wrap, { paddingBottom: renterTabBarBottomGap(bottomInset) }]}>
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
    // Same corner as the guest cards and side menu (not a pill)
    borderRadius: borderRadius.xxl,
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
    // Bar radius minus its 8dp inset, so the corners run parallel
    borderRadius: borderRadius.lg,
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
    borderRadius: borderRadius.lg,
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
    ...typographyPresets.segmentLabel,
    color: colors.textSecondary,
  },
  // Same weight as unselected (like the guest tabs); only the colour changes
  labelActive: {
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

/**
 * LandlordTabBar: floating frosted bar (Dashboard, Properties, +, Leases,
 * More). Same language as RenterTabBar: a navy capsule springs under the
 * selected tab and icons / labels cross-fade navy <-> white as it passes.
 * The round "+" sits in the exact centre of the bar; it is a quick action, not a tab.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import {
  RENTER_TAB_BAR_HEIGHT,
  renterTabBarBottomGap,
} from '@/features/renter/components/RenterTabBar';
import { moderateScale as ms } from '@/utils/responsive';
import type { LandlordIconName, LandlordTab } from '../types';
import { LandlordIcon } from './LandlordIcon';

interface Props {
  active: LandlordTab;
  bottomInset: number;
  onChange: (tab: LandlordTab) => void;
  onAdd: () => void;
}

interface Slot {
  x: number;
  width: number;
}

const TABS: { key: LandlordTab; label: string; icon: LandlordIconName }[] = [
  { key: 'dashboard', label: 'Home', icon: 'house' },
  { key: 'properties', label: 'Properties', icon: 'building' },
  { key: 'leases', label: 'Leases', icon: 'fileText' },
  { key: 'more', label: 'More', icon: 'menu' },
];

/**
 * Bar height: a little taller than the renter bar so the capsule has
 * ~10dp of breathing room above the icon and below the label
 */
export const LANDLORD_TAB_BAR_HEIGHT = RENTER_TAB_BAR_HEIGHT + ms(10);
export const landlordTabBarBottomGap = renterTabBarBottomGap;

const PILL_H = ms(62);
const PILL_TOP = (LANDLORD_TAB_BAR_HEIGHT - PILL_H) / 2;
/** Space from the capsule top edge to the icons */
const ICON_TOP = PILL_TOP + ms(12);
// Capsule sits 2dp inside its tab slot; long labels ("Properties") still
// get almost the whole slot width
const PILL_INSET_X = ms(2);
const BAR_PAD_X = ms(4);
const ADD_SIZE = ms(48);

const TabContent: React.FC<{ icon: LandlordIconName; label: string; selected: boolean }> = ({
  icon,
  label,
  selected,
}) => (
  <View style={styles.content}>
    <LandlordIcon name={icon} size={ms(19)} color={selected ? colors.white : colors.textSecondary} />
    <Text
      style={[styles.label, selected && styles.labelActive]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.7}
      // The bar has a fixed height and 4 slots: ignore the phone's large
      // font setting here so labels stay inside their tab
      maxFontSizeMultiplier={1}
    >
      {label}
    </Text>
  </View>
);

export const LandlordTabBar: React.FC<Props> = ({ active, bottomInset, onChange, onAdd }) => {
  const index = Math.max(0, TABS.findIndex(t => t.key === active));
  const position = useRef(new Animated.Value(index)).current;
  const [slots, setSlots] = useState<(Slot | undefined)[]>([]);

  useEffect(() => {
    Animated.spring(position, {
      toValue: index,
      // left / width are layout props, so this runs on the JS driver
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

  const renderTab = (tab: (typeof TABS)[number], i: number) => {
    const selected = tab.key === active;
    const on = position.interpolate({
      inputRange: [i - 1, i, i + 1],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });
    const off = on.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
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
          <TabContent icon={tab.icon} label={tab.label} selected={false} />
        </Animated.View>
        <Animated.View style={[styles.activeLayer, { opacity: measured ? on : selected ? 1 : 0 }]}>
          <TabContent icon={tab.icon} label={tab.label} selected />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrap, { paddingBottom: landlordTabBarBottomGap(bottomInset) }]}>
      <View style={styles.bar}>
        {pillStyle ? (
          <Animated.View pointerEvents="none" style={[styles.pill, pillStyle]}>
            <Scrim edge="top" extent={0.75} maxOpacity={0.2} color={colors.white} />
            <View style={styles.pillEdge} />
          </Animated.View>
        ) : null}

        {TABS.slice(0, 2).map((tab, i) => renderTab(tab, i))}

        <View style={styles.addSlot}>
          <Pressable
            onPress={onAdd}
            accessibilityRole="button"
            accessibilityLabel="Add"
            style={({ pressed }) => [styles.add, pressed && styles.addPressed]}
          >
            <LandlordIcon name="plus" size={ms(24)} color={colors.white} />
          </Pressable>
        </View>

        {TABS.slice(2).map((tab, i) => renderTab(tab, i + 2))}
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
    paddingHorizontal: spacing.md,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: LANDLORD_TAB_BAR_HEIGHT,
    paddingHorizontal: BAR_PAD_X,
    borderRadius: borderRadius.xxl,
    // Solid: page content must not show through behind the labels
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
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
  // Icon starts 12dp below the capsule's top edge (not just centred), so
  // there is clear space above the icons
  tab: {
    flex: 1,
    height: LANDLORD_TAB_BAR_HEIGHT,
    justifyContent: 'flex-start',
    paddingTop: ICON_TOP,
  },
  activeLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-start',
    paddingTop: ICON_TOP,
  },
  content: {
    alignItems: 'center',
    gap: ms(4),
    paddingHorizontal: ms(5),
  },
  label: {
    ...typographyPresets.segmentLabel,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.white,
  },
  addSlot: {
    width: ADD_SIZE + spacing.xs,
    alignItems: 'center',
  },
  // Round action, centred in the bar (two equal tabs on each side)
  add: {
    width: ADD_SIZE,
    height: ADD_SIZE,
    borderRadius: ADD_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    backgroundImage: `linear-gradient(145deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
    boxShadow: '0px 8px 18px rgba(6,89,178,0.35)',
  },
  addPressed: {
    transform: [{ scale: 0.94 }],
  },
});

export default LandlordTabBar;

/**
 * LandlordTabBar: floating frosted bar (Dashboard, Properties, +, Leases,
 * More). Same language as RenterTabBar: a navy capsule springs under the
 * selected tab and icons / labels cross-fade navy <-> white as it passes.
 * The round "+" sits in the exact centre of the bar; it is a quick action, not a tab.
 *
 * Other personas reuse the bar with their own `tabs` (PMS home: Dashboard,
 * Properties, Financials, Approvals, Profile); without `onAdd` there is no "+".
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import {
  RENTER_TAB_BAR_HEIGHT,
  renterTabBarBottomGap,
} from '@/features/renter/components/RenterTabBar';
import { moderateScale as ms } from '@/utils/responsive';
import { landlordIcons } from '../assets/landlordAssets';
import type { LandlordTab } from '../types';
import { LandlordIcon } from './LandlordIcon';

/** One tab: icon is a white line-icon PNG (tinted here) */
export interface TabBarItem<K extends string> {
  key: K;
  label: string;
  icon: ImageSourcePropType;
}

interface Props<K extends string> {
  active: K;
  bottomInset: number;
  onChange: (tab: K) => void;
  /** Round "+" in the centre of the bar; left out = no "+" */
  onAdd?: () => void;
  /** Default: the landlord tabs */
  tabs?: readonly TabBarItem<K>[];
}

interface Slot {
  x: number;
  width: number;
}

const LANDLORD_TABS: readonly TabBarItem<LandlordTab>[] = [
  { key: 'dashboard', label: 'Home', icon: landlordIcons.house },
  { key: 'properties', label: 'Properties', icon: landlordIcons.building },
  { key: 'leases', label: 'Leases', icon: landlordIcons.fileText },
  { key: 'more', label: 'More', icon: landlordIcons.menu },
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
/**
 * Clear space between a label and the capsule's side edges: the label
 * box is the slot minus the capsule inset minus this, so long labels
 * ("Dashboard", "Properties" with 5 tabs) shrink to fit instead of
 * touching the capsule.
 */
const LABEL_GAP_X = ms(6);
const ADD_SIZE = ms(48);
/** With "+": how many tabs sit to its left */
const ADD_AFTER = 2;

const TabContent: React.FC<{ icon: ImageSourcePropType; label: string; selected: boolean }> = ({
  icon,
  label,
  selected,
}) => (
  <View style={styles.content}>
    <Image
      source={icon}
      style={[styles.icon, { tintColor: selected ? colors.white : colors.textSecondary }]}
      resizeMode="contain"
    />
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

export function LandlordTabBar<K extends string = LandlordTab>({
  active,
  bottomInset,
  onChange,
  onAdd,
  tabs,
}: Props<K>) {
  const TABS = (tabs ?? LANDLORD_TABS) as readonly TabBarItem<K>[];
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

        {onAdd ? (
          <>
            {TABS.slice(0, ADD_AFTER).map((tab, i) => renderTab(tab, i))}

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

            {TABS.slice(ADD_AFTER).map((tab, i) => renderTab(tab, i + ADD_AFTER))}
          </>
        ) : (
          TABS.map((tab, i) => renderTab(tab, i))
        )}
      </View>
    </View>
  );
}

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
    paddingHorizontal: PILL_INSET_X + LABEL_GAP_X,
  },
  icon: {
    width: ms(19),
    height: ms(19),
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

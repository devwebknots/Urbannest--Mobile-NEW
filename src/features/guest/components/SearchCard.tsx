/**
 * SearchCard: "Find your next home" title with two buttons on the right:
 *  - Orbitl AI (glowing orb): opens a bubble explaining voice search,
 *    whose "Tap to talk" starts the full-screen listening view.
 *  - Search: opens a Rent / Buy switch, the filter fields and the search
 *    button; while open the icon switches to the filter (sliders) icon.
 *    Rent / Buy changes the field labels and the button text.
 * Only one panel is open at a time. Overlaps the bottom of the hero.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import {
  ChevronDownIcon,
  HomeIcon,
  MapPinIcon,
  SearchIcon,
  // UsersIcon, // Agents tab hidden for now
} from '@/components/icons';
import {
  borderRadius,
  colors,
  gradients,
  shadows,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { ListingMode } from '../types';
import { BedIcon, BuildingIcon, DollarIcon, SlidersIcon } from './GuestIcons';
import { Collapsible } from './Collapsible';
import { MicIcon, OrbitlOrb, Sparkle, useOrbitlMotion } from './OrbitlOrb';

interface Filters {
  location: string;
  budget: string;
  rentalType: string;
  bedrooms: string;
}

interface Props {
  mode: ListingMode;
  onModeChange: (mode: ListingMode) => void;
  filters: Filters;
  onSearch: () => void;
  /** "Tap to talk" in the Orbitl bubble */
  onTalkToOrbitl: () => void;
}

type Panel = 'none' | 'filters' | 'orbitl';

const TABS: { key: ListingMode; label: string }[] = [
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
  // Agents tab hidden for now
  // { key: 'agents', label: 'Agents' },
];

/** Field labels and button text for each mode */
const MODE_COPY = {
  rent: { budgetLabel: 'Rent / Month', typeLabel: 'Rental Type', searchLabel: 'Search Rentals' },
  buy: { budgetLabel: 'Price', typeLabel: 'Property Type', searchLabel: 'Search Homes for Sale' },
};

const ACTION_SIZE = ms(40);
/** The Orbitl button is bigger so the glowing sphere is easy to spot */
const ORBITL_SIZE = ms(54);
const ACTION_GAP = spacing.sm;
const TAIL = ms(12);

const TabIcon: React.FC<{ tab: ListingMode; color: string }> = ({ tab, color }) => {
  const size = ms(14);
  if (tab === 'rent') return <HomeIcon size={size} color={color} />;
  return <BuildingIcon size={size} color={color} />;
  // Agents tab hidden for now
  // return <UsersIcon size={size} color={color} />;
};

/** Frosted light-blue card colors, built on the secondary blue #518EF9 */
const CARD_BG = {
  base: '#EEF4FF',
  edge: 'rgba(255, 255, 255, 0.95)',
  shadow: colors.headerGradientEnd, // #518EF9
  lavender: colors.chipBlue, // #DCE8FB, light-blue wash on the right
  waveLight: 'rgba(147, 187, 252, 0.30)',
  waveMid: 'rgba(81, 142, 249, 0.16)',
  waveDeep: 'rgba(81, 142, 249, 0.12)',
  waveEdge: 'rgba(255, 255, 255, 0.75)',
};

/**
 * Card background: white glow top-left, light-blue wash on the right and
 * soft blue waves flowing in from the bottom-right corner. Big circles
 * clipped by the card's rounded corners; sits behind the card content.
 */
const CardBackground: React.FC = () => (
  <View pointerEvents="none" style={styles.bgClip}>
    {/* Light wash */}
    <View
      style={[
        styles.bgBlob,
        { width: ms(300), height: ms(300), borderRadius: ms(150), left: -ms(110), top: -ms(170), backgroundColor: '#FFFFFF', opacity: 0.75 },
      ]}
    />
    <View
      style={[
        styles.bgBlob,
        { width: ms(320), height: ms(320), borderRadius: ms(160), right: -ms(170), top: -ms(120), backgroundColor: CARD_BG.lavender, opacity: 0.85 },
      ]}
    />
    {/* Waves: overlapping circles whose tops read as flowing curves */}
    <View
      style={[
        styles.bgBlob,
        { width: ms(520), height: ms(520), borderRadius: ms(260), left: '30%', bottom: -ms(436), backgroundColor: CARD_BG.waveMid },
      ]}
    />
    <View
      style={[
        styles.bgBlob,
        {
          width: ms(460),
          height: ms(460),
          borderRadius: ms(230),
          left: '48%',
          bottom: -ms(392),
          backgroundColor: CARD_BG.waveLight,
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderColor: CARD_BG.waveEdge,
        },
      ]}
    />
    <View
      style={[
        styles.bgBlob,
        { width: ms(400), height: ms(400), borderRadius: ms(200), left: '64%', bottom: -ms(346), backgroundColor: CARD_BG.waveDeep },
      ]}
    />
  </View>
);

const Field: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <Pressable style={styles.field} accessibilityRole="button" accessibilityLabel={`${label}: ${value}`}>
    <View style={styles.fieldIcon}>{icon}</View>
    <View style={styles.fieldText}>
      <Text style={styles.fieldLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.fieldValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
    <ChevronDownIcon size={ms(14)} color={colors.textMuted} />
  </Pressable>
);

/** Search icon that turns into the filter icon with a quick spin-in */
const SearchToggleIcon: React.FC<{ open: boolean }> = ({ open }) => {
  const swap = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    swap.setValue(0);
    Animated.spring(swap, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }).start();
  }, [open, swap]);

  return (
    <Animated.View
      style={{
        opacity: swap.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 1] }),
        transform: [
          { rotate: swap.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
          { scale: swap.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
        ],
      }}
    >
      {open ? (
        <SlidersIcon size={ms(17)} color={colors.navy} />
      ) : (
        <SearchIcon size={ms(19)} color={colors.navy} />
      )}
    </Animated.View>
  );
};

export const SearchCard: React.FC<Props> = ({
  mode,
  onModeChange,
  filters,
  onSearch,
  onTalkToOrbitl,
}) => {
  const [panel, setPanel] = useState<Panel>('none');
  const animate = useOrbitlMotion();
  const iconSize = ms(16);
  const iconColor = colors.textSecondary;

  const toggle = (next: Panel) => {
    setPanel(current => (current === next ? 'none' : next));
  };

  const copy = mode === 'buy' ? MODE_COPY.buy : MODE_COPY.rent;
  const filtersOpen = panel === 'filters';
  const orbitlOpen = panel === 'orbitl';

  return (
    <View style={styles.card}>
      <CardBackground />
      <View style={styles.header}>
        {/* Title explains the card; tapping it opens the search too */}
        <Pressable
          onPress={() => toggle('filters')}
          style={styles.headerText}
          accessibilityRole="button"
          accessibilityLabel="Find your next home"
        >
          <Text style={styles.headerTitle} numberOfLines={1}>
            Find your next home
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Search with filters or ask Orbitl AI
          </Text>
        </Pressable>

        <Pressable
          onPress={() => toggle('orbitl')}
          style={[styles.action, styles.orbitlButton, orbitlOpen && styles.actionActive]}
          accessibilityRole="button"
          accessibilityLabel="Ask Orbitl AI"
          accessibilityState={{ expanded: orbitlOpen }}
        >
          <OrbitlOrb size={ORBITL_SIZE} animate={animate} rippleSpread={1.5} />
        </Pressable>

        <Pressable
          onPress={() => toggle('filters')}
          style={[styles.action, styles.searchButtonSmall, filtersOpen && styles.actionActive]}
          accessibilityRole="button"
          accessibilityLabel={filtersOpen ? 'Hide filters' : 'Search with filters'}
          accessibilityState={{ expanded: filtersOpen }}
        >
          <SearchToggleIcon open={filtersOpen} />
        </Pressable>
      </View>

      <Collapsible open={orbitlOpen}>
        <View style={styles.bubble}>
          {/* Tail pointing up at the Orbitl button */}
          <View style={styles.bubbleTail} />
          <View style={styles.bubbleHeader}>
            <Sparkle size={ms(14)} color={colors.gold} />
            <Text style={styles.bubbleTitle}>Hi, I'm Orbitl, your home assistant</Text>
          </View>
          <Text style={styles.bubbleText}>
            Skip the filters and just talk to me. Say something like{' '}
            <Text style={styles.bubbleQuote}>“3 bed home in California under $3,000”</Text> and
            I'll find homes that match.
          </Text>
          <Pressable onPress={onTalkToOrbitl} accessibilityRole="button" style={styles.talkPress}>
            <LinearGradient
              colors={gradients.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.talkButton}
            >
              <MicIcon size={ms(16)} color={colors.white} />
              <Text style={styles.talkText}>Tap to talk</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Collapsible>

      <Collapsible open={filtersOpen}>
        <View style={styles.filters}>
          {/* Rent / Buy decides which homes are searched and the fields below */}
          <View style={styles.segment} accessibilityRole="tablist">
            {TABS.map(tab => {
              const active = tab.key === mode;
              const color = active ? colors.white : colors.textSecondary;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => onModeChange(tab.key)}
                  style={[styles.segmentItem, active && styles.segmentItemActive]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <TabIcon tab={tab.key} color={color} />
                  <Text style={[styles.segmentText, { color }]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.row}>
            <Field
              label="Location"
              value={filters.location}
              icon={<MapPinIcon size={iconSize} color={iconColor} />}
            />
            <Field
              label={copy.budgetLabel}
              value={filters.budget}
              icon={<DollarIcon size={iconSize} color={iconColor} />}
            />
          </View>
          <View style={styles.row}>
            <Field
              label={copy.typeLabel}
              value={filters.rentalType}
              icon={<HomeIcon size={iconSize} color={iconColor} />}
            />
            <Field
              label="Bedrooms"
              value={filters.bedrooms}
              icon={<BedIcon size={iconSize} color={iconColor} />}
            />
          </View>

          <Pressable onPress={onSearch} accessibilityRole="button" style={styles.searchPress}>
            <LinearGradient
              colors={gradients.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.searchButton}
            >
              <SearchIcon size={ms(16)} color={colors.white} />
              <Text style={styles.searchText}>{copy.searchLabel}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xxl,
    backgroundColor: CARD_BG.base,
    // Glassy white edge
    borderWidth: 1.5,
    borderColor: CARD_BG.edge,
    ...shadows.lg,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
  bgClip: {
    ...StyleSheet.absoluteFill,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  bgBlob: {
    position: 'absolute',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...typographyPresets.listingTitle,
  },
  headerSubtitle: {
    ...typographyPresets.caption,
    marginTop: 2,
    color: colors.textSecondary,
  },
  segment: {
    flexDirection: 'row',
    padding: ms(4),
    marginBottom: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
    height: ms(38),
    borderRadius: borderRadius.pill,
  },
  segmentItemActive: {
    backgroundColor: colors.navy,
  },
  segmentText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  action: {
    width: ACTION_SIZE,
    height: ACTION_SIZE,
    borderRadius: ACTION_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitlButton: {
    width: ORBITL_SIZE,
    height: ORBITL_SIZE,
    borderRadius: ORBITL_SIZE / 2,
    marginRight: ACTION_GAP,
  },
  searchButtonSmall: {
    borderWidth: 1,
    borderColor: colors.border,
    // Stays white on the tinted card, as before
    backgroundColor: colors.surface,
  },
  actionActive: {
    backgroundColor: colors.chipBlue,
    borderColor: colors.chipBlue,
  },
  bubble: {
    marginTop: spacing.md + TAIL / 2,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    backgroundColor: '#F3F7FE',
  },
  bubbleTail: {
    position: 'absolute',
    top: -TAIL / 2 - 1,
    // Centered under the Orbitl button (search button + gap to its right)
    right: ACTION_SIZE + ACTION_GAP + ORBITL_SIZE / 2 - TAIL / 2 - 1,
    width: TAIL,
    height: TAIL,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    backgroundColor: '#F3F7FE',
    transform: [{ rotate: '45deg' }],
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  bubbleTitle: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.base,
    color: colors.navy,
    fontWeight: typography.fontWeight.semibold,
  },
  bubbleText: {
    marginTop: spacing.xs + 2,
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.sm,
    lineHeight: scaleFont(18),
    color: colors.textSecondary,
  },
  bubbleQuote: {
    fontFamily: typography.fontFamily.body.medium,
    color: colors.navy,
  },
  talkPress: {
    marginTop: spacing.md,
  },
  talkButton: {
    height: ms(44),
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  talkText: {
    ...typographyPresets.button,
    color: colors.white,
  },
  filters: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm + 2,
    marginBottom: spacing.sm + 2,
  },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldIcon: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  fieldText: {
    flex: 1,
    marginRight: spacing.xs,
  },
  fieldLabel: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(9),
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  fieldValue: {
    marginTop: 1,
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  searchPress: {
    marginTop: spacing.xs,
  },
  searchButton: {
    height: ms(48),
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  searchText: {
    ...typographyPresets.button,
    color: colors.white,
  },
});

export default SearchCard;

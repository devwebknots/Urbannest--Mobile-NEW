/**
 * SearchCard: Rent / Buy / Agents tabs, four filter fields and the
 * Search Properties button. Overlaps the bottom of the hero.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import {
  ChevronDownIcon,
  HomeIcon,
  MapPinIcon,
  SearchIcon,
  UsersIcon,
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
}

const TABS: { key: ListingMode; label: string }[] = [
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
  { key: 'agents', label: 'Agents' },
];

const TabIcon: React.FC<{ tab: ListingMode; color: string }> = ({ tab, color }) => {
  const size = ms(14);
  if (tab === 'rent') return <HomeIcon size={size} color={color} />;
  if (tab === 'buy') return <BuildingIcon size={size} color={color} />;
  return <UsersIcon size={size} color={color} />;
};

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

export const SearchCard: React.FC<Props> = ({ mode, onModeChange, filters, onSearch }) => {
  const iconSize = ms(16);
  const iconColor = colors.textSecondary;
  return (
    <View style={styles.card}>
      <View style={styles.tabs}>
        {TABS.map(tab => {
          const active = tab.key === mode;
          const color = active ? colors.white : colors.textSecondary;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onModeChange(tab.key)}
              style={[styles.tab, active && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              <TabIcon tab={tab.key} color={color} />
              <Text style={[styles.tabText, { color }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
        <View style={styles.flex} />
        <Pressable style={styles.filterButton} accessibilityLabel="More filters">
          <SlidersIcon size={ms(15)} color={colors.navy} />
        </Pressable>
      </View>

      <View style={styles.row}>
        <Field
          label="Location"
          value={filters.location}
          icon={<MapPinIcon size={iconSize} color={iconColor} />}
        />
        <Field
          label="Rent / Month"
          value={filters.budget}
          icon={<DollarIcon size={iconSize} color={iconColor} />}
        />
      </View>
      <View style={styles.row}>
        <Field
          label="Rental Type"
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
          <Text style={styles.searchText}>Search Properties</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(7),
    marginRight: spacing.xs,
    borderRadius: borderRadius.pill,
  },
  tabActive: {
    backgroundColor: colors.navy,
  },
  tabText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  flex: { flex: 1 },
  filterButton: {
    width: ms(32),
    height: ms(32),
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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

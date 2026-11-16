/**
 * LandlordPropertiesScreen: "Portfolio Overview", the landlord's
 * properties. Opened by the dashboard burger menu, the dashboard tab bar's
 * Properties tab and "View Properties" after onboarding (dashboard
 * underneath, back returns there). Follows the "Portfolio Overview" design (no properties yet)
 * with the app's parts:
 *  - light top bar (back, "Landlord Portal", avatar), building photo top
 *    right over the soft blue glow (same frame as the landlord forms)
 *  - "Portfolio Overview" / tagline / OWNER MODE: ACTIVE pill
 *  - 2 x 2 stats box (properties, units, occupancy, rent)
 *  - Managed Assets: search button + filter chips (StatusFilterChips),
 *    "No properties found" card → Add Property (LandlordAddProperty);
 *    after the demo Add Property flow, the sample property cards
 *    (ManagedAssetCard) + "+ Add New Property"
 *  - Recent Unit Activities ("View all units →" only once there are units),
 *    empty row
 * No bottom tab bar on this page.
 */

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { SearchIcon } from '@/components/icons';
import { colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { HEADER_BUILDING_ASPECT, applicationAssets } from '@/features/application/assets/applicationAssets';
import { FieldInput } from '@/features/application/components/ApplicationFields';
import { StatusFilterChips } from '@/features/application/components/ApplicationStatusParts';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { moderateScale as ms } from '@/utils/responsive';
import { LANDLORD_PROFILE } from '../constants';
import { PlusIcon } from '@/components/icons';
import {
  EmptyActivity,
  EmptyPropertiesCard,
  ManagedAssetCard,
  OwnerModePill,
  PortfolioStats,
} from '../properties/PortfolioParts';
import { PropertyFilterId, usePortfolioOverview } from '../properties/usePortfolioOverview';

interface Props {
  navigation?: { goBack: () => void };
}

export const LandlordPropertiesScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = usePortfolioOverview(navigation);

  const buildingW = Math.round(width * 0.4);
  const buildingH = Math.round(buildingW / HEADER_BUILDING_ASPECT);
  const bottomPad = Math.max(insets.bottom, spacing.md) + spacing.xxl;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: bottomPad,
        }}
      >
        <View pointerEvents="none" style={[styles.glow, { width }]} />
        <Image
          source={applicationAssets.headerBuilding}
          style={[styles.building, { top: insets.top, width: buildingW, height: buildingH }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <LightTopBar
          title="Landlord Portal"
          titleAlign="left"
          onBack={vm.goBack}
          initials={LANDLORD_PROFILE.initials}
        />

        <View style={styles.heading}>
          <Text
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            accessibilityRole="header"
          >
            Portfolio Overview
          </Text>
          <Text style={styles.subtitle}>Excellence in every square foot.</Text>
          <View style={styles.pill}>
            <OwnerModePill />
          </View>
        </View>

        <View style={styles.padded}>
          <PortfolioStats {...vm.summary} />
        </View>

        {/* Managed assets */}
        <View style={[styles.padded, styles.sectionHead]}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Managed Assets
          </Text>
          <Pressable
            onPress={vm.toggleSearch}
            accessibilityRole="button"
            accessibilityLabel={vm.searchOpen ? 'Close search' : 'Search properties'}
            style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
          >
            <SearchIcon size={ms(18)} color={colors.navy} />
          </Pressable>
        </View>
        {vm.searchOpen ? (
          <View style={[styles.padded, styles.search]}>
            <FieldInput
              value={vm.query}
              onChangeText={vm.setQuery}
              placeholder="Search by property name or city"
              autoCorrect={false}
              returnKeyType="search"
              accessibilityLabel="Search properties"
            />
          </View>
        ) : null}
        <View style={styles.chips}>
          <StatusFilterChips<PropertyFilterId>
            filters={vm.filters}
            value={vm.filter}
            onChange={vm.setFilter}
          />
        </View>
        {vm.populated ? (
          <View style={[styles.padded, styles.card, styles.assets]}>
            {vm.assets.length === 0 ? (
              <Text style={styles.noMatch}>No properties match this filter.</Text>
            ) : (
              vm.assets.map(a => (
                <ManagedAssetCard
                  key={a.id}
                  asset={a}
                  onView={() => vm.viewProperty(a)}
                  onUnits={() => vm.viewUnits(a)}
                  onMenu={() => vm.propertyMenu(a)}
                />
              ))
            )}
            <Button
              title="Add New Property"
              variant="brand"
              onPress={vm.addProperty}
              leftIcon={<PlusIcon size={ms(16)} color={colors.white} />}
              style={styles.addNew}
            />
          </View>
        ) : (
          <View style={[styles.padded, styles.card]}>
            <EmptyPropertiesCard onAdd={vm.addProperty} />
          </View>
        )}

        {/* Recent unit activities */}
        <View style={[styles.padded, styles.sectionHead, styles.activityHead]}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Recent Unit Activities
          </Text>
          {/* Only once there are units to list */}
          {vm.summary.totalUnits > 0 ? (
            <Button
              title="View all units"
              variant="link"
              size="md"
              onPress={vm.viewAllUnits}
              rightIcon={<ArrowRightIcon size={ms(14)} color={colors.primary} />}
              textStyle={styles.linkText}
            />
          ) : null}
        </View>
        <View style={styles.padded}>
          <EmptyActivity />
        </View>
      </ScrollView>

      {/* No bottom tab bar on this page (removed on request) */}
      <AppDialog {...vm.dialog.props} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
const SEARCH = ms(44);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ms(460),
    backgroundImage: `radial-gradient(circle at 10% 10%, rgba(${BLUE},0.16) 0%, rgba(${BLUE},0) 60%), linear-gradient(180deg, rgba(${BLUE},0.12) 0%, rgba(${BLUE},0) 100%)`,
  },
  building: {
    position: 'absolute',
    right: 0,
  },
  heading: {
    marginTop: spacing.xxl + spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  pill: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sectionGap,
  },
  activityHead: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
    flexShrink: 1,
  },
  searchButton: {
    width: SEARCH,
    height: SEARCH,
    borderRadius: SEARCH / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.md,
  },
  search: {
    marginTop: spacing.md,
  },
  chips: {
    marginTop: spacing.md,
  },
  card: {
    marginTop: spacing.md,
  },
  assets: {
    gap: spacing.md,
  },
  noMatch: {
    ...typographyPresets.body,
    paddingVertical: spacing.lg,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  addNew: {
    marginTop: spacing.sm,
  },
  linkText: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default LandlordPropertiesScreen;

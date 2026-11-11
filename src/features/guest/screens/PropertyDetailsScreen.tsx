/**
 * PropertyDetailsScreen: a listing's full details for guests, opened by
 * tapping any property on the guest home (Rentals Near You, Featured) or a
 * Similar Deals card. Layout from the "Luxury Home Rental" design:
 *  - photo gallery: back / favourite / share, Premium pill, "1 / 5",
 *    thumbnail strip
 *  - name + rating pill, address, price per month, bed / bath / area strip
 *  - Details card: description + floor plan ("View Floor Plan" opens it)
 *  - Costs & Fees (opens / closes)
 *  - Special features (two columns)
 *  - Similar Deals (side-scrolling cards, "See all")
 *  - fixed bottom bar: Apply Now / Book a Tour (ask guests to sign in)
 */

import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { MapPinIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { ArrowRightIcon, StarGlyph } from '../components/GuestIcons';
import { CostsFeesCard } from '../components/property/CostsFeesCard';
import { FloorPlanViewer } from '../components/property/FloorPlanViewer';
import { PropertyDetailsCard } from '../components/property/PropertyDetailsCard';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyIcon } from '../components/property/PropertyIcon';
import { PropertySectionTitle } from '../components/property/PropertySectionTitle';
import { PropertyStatsBar } from '../components/property/PropertyStatsBar';
import { SimilarDealCard } from '../components/property/SimilarDealCard';
import { SpecialFeatures } from '../components/property/SpecialFeatures';
import {
  PropertyDetailsNavigation,
  usePropertyDetails,
} from '../hooks/usePropertyDetails';

interface Props {
  navigation?: PropertyDetailsNavigation;
  route?: { params?: { propertyId?: string } };
}

const DEAL_GAP = spacing.md;

export const PropertyDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = usePropertyDetails(route?.params?.propertyId, navigation);
  const p = vm.property;

  // Two Similar Deals cards fit side by side
  const dealW = Math.floor((width - spacing.screenHorizontal * 2 - DEAL_GAP) / 2);
  const footerPadBottom = Math.max(insets.bottom, spacing.md);
  const footerH = spacing.md + ms(48) + footerPadBottom;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: footerH + spacing.xxl }}
      >
        <PropertyGallery
          images={p.gallery}
          topInset={insets.top}
          premium={p.premium}
          favorite={vm.favorites.has(p.id)}
          onBack={vm.back}
          onToggleFavorite={() => vm.toggleFavorite(p.id)}
          onShare={vm.share}
        />

        {/* Name, rating, address, price, stats */}
        <View style={styles.head}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{p.name}</Text>
            <View style={styles.rating} accessibilityLabel={`Rated ${p.rating} from ${p.reviews} reviews`}>
              <StarGlyph size={ms(14)} color={colors.gold} />
              <Text style={styles.ratingValue}>{p.rating}</Text>
              <Text style={styles.ratingCount}>({p.reviews})</Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <MapPinIcon size={ms(14)} color={colors.navy} />
            <Text style={styles.address}>{p.address}</Text>
          </View>

          <View style={styles.priceRow}>
            {p.pricePrefix ? <Text style={styles.per}>{p.pricePrefix} </Text> : null}
            <Text style={styles.price}>{p.price}</Text>
            <Text style={styles.per}> / Month</Text>
          </View>

          <View style={styles.stats}>
            <PropertyStatsBar beds={p.beds} baths={p.baths} sqft={p.sqft} />
          </View>
        </View>

        <View style={styles.section}>
          <PropertyDetailsCard
            description={p.description}
            floorPlan={p.floorPlan}
            onViewFloorPlan={vm.openFloorPlan}
          />
        </View>

        <View style={styles.section}>
          <CostsFeesCard groups={p.costs} selected={vm.extras} onToggle={vm.toggleExtra} />
        </View>

        <View style={styles.section}>
          <PropertySectionTitle icon="sparkles" title="Special features" />
          <View style={styles.sectionBody}>
            <SpecialFeatures features={p.features} />
          </View>
        </View>

        {vm.similar.length > 0 ? (
          <View style={[styles.section, styles.dealsSection]}>
            <View style={styles.dealsTitle}>
              <PropertySectionTitle
                icon="building"
                title="Similar Deals"
                right={
                  <Button
                    title="See all"
                    variant="link"
                    onPress={vm.seeAllSimilar}
                    hitSlop={8}
                    textStyle={styles.seeAll}
                    rightIcon={<ArrowRightIcon size={ms(13)} color={colors.primary} />}
                  />
                }
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={dealW + DEAL_GAP}
              decelerationRate="fast"
              contentContainerStyle={styles.deals}
            >
              {vm.similar.map(item => (
                <SimilarDealCard
                  key={item.id}
                  item={item}
                  width={dealW}
                  favorite={vm.favorites.has(item.id)}
                  onPress={() => vm.openProperty(item.id)}
                  onToggleFavorite={() => vm.toggleFavorite(item.id)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      {/* Fixed actions; the page fades out under them */}
      <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
        <Button
          title="Apply Now"
          variant="light"
          onPress={vm.apply}
          style={[styles.footerButton, styles.applyButton]}
          leftIcon={<PropertyIcon name="document" size={ms(18)} color={colors.navy} />}
        />
        <Button
          title="Book a Tour"
          variant="brand"
          onPress={vm.bookTour}
          style={styles.footerButton}
          leftIcon={<PropertyIcon name="calendar" size={ms(18)} color={colors.white} />}
        />
      </View>

      <FloorPlanViewer
        visible={vm.floorPlanOpen}
        title={p.name}
        image={p.floorPlan}
        onClose={vm.closeFloorPlan}
      />
      <AppDialog {...vm.dialog} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  head: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typographyPresets.heroTitleCompact,
    flex: 1,
    marginRight: spacing.md,
    color: colors.navy,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    height: ms(34),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    ...shadows.md,
  },
  ratingValue: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(13),
    color: colors.navy,
    fontWeight: typography.fontWeight.semibold,
  },
  ratingCount: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(12.5),
    color: colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  address: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.md,
  },
  price: {
    ...typographyPresets.priceLarge,
  },
  per: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(13),
    color: colors.textSecondary,
  },
  stats: {
    marginTop: spacing.lg,
  },
  section: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
  },
  sectionBody: {
    marginTop: spacing.lg,
  },
  // Cards scroll edge to edge; only the title keeps the side padding
  dealsSection: {
    paddingHorizontal: 0,
  },
  dealsTitle: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  seeAll: {
    color: colors.primary,
  },
  deals: {
    gap: DEAL_GAP,
    paddingHorizontal: spacing.screenHorizontal,
    // Room for the card shadows
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundImage: `linear-gradient(180deg, rgba(238, 243, 249, 0) 0%, ${colors.pageTint} 35%)`,
  },
  footerButton: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  applyButton: {
    borderWidth: 1,
    borderColor: colors.navy,
  },
});

export default PropertyDetailsScreen;

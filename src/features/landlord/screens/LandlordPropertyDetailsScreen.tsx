/**
 * LandlordPropertyDetailsScreen: "Property Details" for a landlord-added
 * property, opened by "View Property" on a Managed Assets card (Portfolio
 * Overview). Layout from the "Property Details" design with the app's
 * theme, presets, buttons and icons:
 *  - light top bar (back, "Landlord Portal", bell, avatar) over the soft
 *    blue glow (same frame as Portfolio Overview)
 *  - "Property Details", name + type pill + Edit, address
 *  - gallery: large photo (N photos / + Add Photos) + 3 thumbs
 *  - Property Overview, Property Health (stacked for phone width)
 *  - Unit Inventory (Filter / + Add Unit) + unit cards
 *  - Maintenance Queue, Quick Actions, Document Vault (Full archive →)
 *  - Rent Collection chart + totals, Resident Directory, Communications
 * Read-only summary rule: section headings on the page, content in white
 * boxes. Actions open a "coming soon" dialog for now.
 */

import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { BellIcon, PlusIcon } from '@/components/icons';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { LANDLORD_PROFILE } from '../constants';
import {
  ActionRows,
  CommsBody,
  DetailBox,
  DetailSectionHead,
  HealthBody,
  MaintenanceQueueBody,
  OverviewBody,
  PropertyGallery,
  PropertyTitleBlock,
  RentCollectionBody,
  ResidentsEmpty,
  TintIcon,
  UnitInventoryCard,
} from '../properties/PropertyDetailsParts';
import { PropertySummaryPair, SUMMARY_PAIR_MIN_WIDTH } from '../properties/PropertySummaryPair';
import { DETAIL_ICONS, usePropertyDetails } from '../properties/usePropertyDetails';

interface Props {
  navigation?: { goBack: () => void };
  route?: { params?: { propertyId?: string } };
}

export const LandlordPropertyDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = usePropertyDetails(route?.params?.propertyId, navigation);
  const p = vm.property;
  const bottomPad = Math.max(insets.bottom, spacing.md) + spacing.xxl;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: bottomPad }}
      >
        <View pointerEvents="none" style={[styles.glow, { width }]} />

        <LightTopBar
          title="Landlord Portal"
          titleAlign="left"
          onBack={vm.goBack}
          right={
            <>
              <Pressable
                onPress={vm.notifications}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
              >
                <BellIcon size={ms(18)} color={colors.navy} />
                <View style={styles.bellDot} />
              </Pressable>
              <ProfileAvatar initials={LANDLORD_PROFILE.initials} />
            </>
          }
        />

        <View style={[styles.padded, styles.heading]}>
          <Text
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            accessibilityRole="header"
          >
            Property Details
          </Text>
          <View style={styles.titleBlock}>
            <PropertyTitleBlock name={p.name} type={p.type} address={p.address} onEdit={vm.edit} />
          </View>
        </View>

        <View style={[styles.padded, styles.gallery]}>
          <PropertyGallery
            photos={p.photos}
            count={p.photoCount}
            onOpen={vm.openPhotos}
            onAdd={vm.addPhotos}
          />
        </View>

        {width >= SUMMARY_PAIR_MIN_WIDTH ? (
          /* Overview | Health side by side (design), half-width cards */
          <View style={[styles.padded, styles.section]}>
            <PropertySummaryPair
              description={p.description}
              amenities={vm.amenities}
              owner={p.owner}
              coOwners={p.coOwners}
              manager={p.manager}
              score={p.healthScore}
              scoreLabel={p.healthLabel}
              metrics={vm.health}
            />
          </View>
        ) : (
          <>
            {/* Small phones: full-width Overview, then Health */}
            <View style={[styles.padded, styles.section]}>
              <DetailSectionHead icon={DETAIL_ICONS.overview} title="Property Overview" />
              <DetailBox>
                <OverviewBody
                  description={p.description}
                  amenities={vm.amenities}
                  owner={p.owner}
                  coOwners={p.coOwners}
                  manager={p.manager}
                />
              </DetailBox>
            </View>
            <View style={[styles.padded, styles.section]}>
              <DetailSectionHead icon={DETAIL_ICONS.health} title="Property Health" />
              <DetailBox>
                <HealthBody score={p.healthScore} label={p.healthLabel} metrics={vm.health} />
              </DetailBox>
            </View>
          </>
        )}

        {/* Unit inventory */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Unit Inventory"
            right={
              <>
                <Button
                  title="Filter"
                  variant="light"
                  size="sm"
                  onPress={vm.filterUnits}
                  leftIcon={<TintIcon source={DETAIL_ICONS.filter} size={ms(14)} color={colors.navy} />}
                  style={styles.lightButton}
                />
                <Button
                  title="Add Unit"
                  variant="brand"
                  size="sm"
                  onPress={vm.addUnit}
                  leftIcon={<PlusIcon size={ms(14)} color={colors.white} />}
                  style={styles.smallButton}
                />
              </>
            }
          />
          <View style={styles.units}>
            {vm.units.map(u => (
              <UnitInventoryCard
                key={u.id}
                propertyName={p.name}
                unit={u}
                onView={() => vm.viewUnit(u)}
                onMessage={() => vm.messageUnit(u)}
              />
            ))}
          </View>
        </View>

        {/* Maintenance queue */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead icon={DETAIL_ICONS.maintenance} title="Maintenance Queue" />
          <DetailBox>
            <MaintenanceQueueBody openTickets={p.openTickets} vendorScore={p.vendorScore} />
          </DetailBox>
        </View>

        {/* Quick actions */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead icon={DETAIL_ICONS.quickActions} title="Quick Actions" />
          <DetailBox flush>
            <ActionRows items={vm.quickActions} onPress={vm.openAction} />
          </DetailBox>
        </View>

        {/* Document vault */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            icon={DETAIL_ICONS.vault}
            title="Document Vault"
            right={
              <Pressable
                onPress={vm.openArchive}
                hitSlop={8}
                accessibilityRole="button"
                style={({ pressed }) => [styles.link, pressed && styles.pressed]}
              >
                <Text style={styles.linkText}>Full archive</Text>
                <TintIcon source={DETAIL_ICONS.arrow} size={ms(14)} color={colors.primary} />
              </Pressable>
            }
          />
          <DetailBox flush>
            <ActionRows items={vm.vault} onPress={vm.openFolder} />
          </DetailBox>
        </View>

        {/* Rent collection */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            icon={DETAIL_ICONS.rent}
            title="Rent Collection"
            right={<Text style={styles.trend}>+{p.rentTrend}%</Text>}
          />
          <DetailBox>
            <RentCollectionBody
              months={vm.rentMonths}
              funding={p.funding}
              expenses={p.expenses}
              vendorBills={p.vendorBills}
            />
          </DetailBox>
        </View>

        {/* Residents */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead icon={DETAIL_ICONS.residents} title="Resident Directory" />
          <ResidentsEmpty />
        </View>

        {/* Communications */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead icon={DETAIL_ICONS.comms} title="Communications" />
          <DetailBox>
            <CommsBody
              tab={vm.commsTab}
              onTab={vm.setCommsTab}
              messages={vm.messages}
              onOpen={vm.openMessage}
            />
          </DetailBox>
        </View>
      </ScrollView>

      <AppDialog {...vm.dialog.props} />
    </View>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';
const BELL = ms(40);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageTint,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ms(420),
    backgroundImage: `radial-gradient(circle at 10% 10%, rgba(${BLUE},0.16) 0%, rgba(${BLUE},0) 60%), linear-gradient(180deg, rgba(${BLUE},0.12) 0%, rgba(${BLUE},0) 100%)`,
  },
  padded: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  heading: {
    marginTop: spacing.xl,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    color: colors.navy,
  },
  titleBlock: {
    marginTop: spacing.lg,
  },
  gallery: {
    marginTop: spacing.xl,
  },
  section: {
    marginTop: spacing.xxl + spacing.xs,
  },
  bell: {
    width: BELL,
    height: BELL,
    borderRadius: BELL / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  bellDot: {
    position: 'absolute',
    top: ms(9),
    right: ms(10),
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  lightButton: {
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  smallButton: {
    paddingHorizontal: spacing.md,
  },
  units: {
    gap: spacing.md,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    ...typographyPresets.sectionLink,
    color: colors.primary,
  },
  trend: {
    ...typographyPresets.bodyBold,
    color: colors.successDark,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default LandlordPropertyDetailsScreen;

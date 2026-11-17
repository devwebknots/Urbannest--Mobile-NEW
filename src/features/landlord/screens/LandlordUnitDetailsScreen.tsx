/**
 * LandlordUnitDetailsScreen: "Unit Details" for a unit of a landlord's
 * property, opened by "View Unit" (or the unit card) on Property Details.
 * Layout as the "Unit Details" design, with the app's theme, presets and
 * buttons:
 *  - light top bar (back, "Landlord Portal", bell, avatar) over the glow
 *  - breadcrumb, "Unit 101" + Vacant, Edit + ⋯, "LL01 • 1st Floor • Apartment"
 *  - gallery (large photo + 3 thumbs), Rent / Beds / Baths / Lease in one row
 * Below that, the mobile "Unit Details" layout (image 97), section titles
 * on the page (DetailSectionHead, no icon) with content under them:
 *  - Quick Actions (IconTile row), This Month (Financial | Maintenance tiles)
 *  - Unit & Lease Overview (photo + rows), Special Features, Unit Services
 *  - Floor Plan (opens FloorPlanViewer), Document Vault, Tenant, Owner
 * Other actions open a "coming soon" dialog for now.
 */

import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { BellIcon, PlusIcon } from '@/components/icons';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { propertyAssets } from '@/features/guest/assets/guestAssets';
import { FloorPlanViewer } from '@/features/guest/components/property/FloorPlanViewer';
import { CircleIconButton } from '@/features/renter/components/CircleIconButton';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { moderateScale as ms } from '@/utils/responsive';
import { LANDLORD_PROFILE } from '../constants';
import { ActionRows, DetailSectionHead, TintIcon } from '../properties/PropertyDetailsParts';
import {
  UnitBreadcrumb,
  UnitGallery,
  UnitStatsGrid,
  UnitTitleBlock,
} from '../properties/UnitDetailsParts';
import {
  CollectedPill,
  EmptyRow,
  FeatureChips,
  FloorPlanCard,
  KpiTile,
  OverviewCard,
  PeopleList,
  PeopleToggle,
  QuickActionTiles,
  ServiceCards,
  WhiteBox,
} from '../properties/UnitSectionCards';
import { DETAIL_ICONS } from '../properties/usePropertyDetails';
import { UNIT_ICONS, useUnitDetails } from '../properties/useUnitDetails';

interface Props {
  navigation?: { goBack: () => void };
  route?: { params?: { propertyId?: string; unitId?: string } };
}

/** Small round chevron at the end of a section title */
const OpenButton: React.FC<{ onPress: () => void; label: string }> = ({ onPress, label }) => (
  <CircleIconButton
    onPress={onPress}
    accessibilityLabel={label}
    icon={<TintIcon source={DETAIL_ICONS.chevron} size={ms(14)} color={colors.navy} />}
  />
);

export const LandlordUnitDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useUnitDetails(route?.params, navigation);
  const u = vm.unit;
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
          <UnitBreadcrumb
            propertyName={vm.propertyName}
            unitName={u.name}
            onProperties={vm.goProperties}
            onProperty={vm.goBack}
          />
          <View style={styles.titleBlock}>
            <UnitTitleBlock
              name={u.name}
              status={u.status}
              meta={[vm.propertyName, u.floor, u.type]}
              onEdit={vm.edit}
              onMore={vm.more}
            />
          </View>
        </View>

        <View style={[styles.padded, styles.gallery]}>
          <UnitGallery
            photos={u.photos}
            count={u.photoCount}
            onOpen={vm.openPhotos}
            onTour={vm.virtualTour}
          />
        </View>

        <View style={[styles.padded, styles.stats]}>
          <UnitStatsGrid stats={vm.stats} />
        </View>

        {/* Quick actions */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Quick Actions"
          />
          <View>
            <QuickActionTiles actions={vm.quickActions} onPress={vm.openAction} />
          </View>
        </View>

        {/* This month: financial | maintenance */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead title="This Month" />
          <View style={styles.pair}>
            <KpiTile
              icon={UNIT_ICONS.financial}
              title="Financial"
              value={`$${u.monthCollected.toLocaleString('en-US')}`}
              caption="Rent this month"
              onPress={vm.openFinancial}
              footer={<CollectedPill collected={u.collected} />}
            />
            <KpiTile
              icon={UNIT_ICONS.maintenance}
              title="Maintenance"
              value={String(u.openTickets)}
              caption={u.openTickets === 0 ? 'No open tickets' : 'Open tickets'}
              onPress={vm.openMaintenance}
              footer={
                <Pressable
                  onPress={vm.createTicket}
                  hitSlop={8}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.link, pressed && styles.pressed]}
                >
                  <PlusIcon size={ms(13)} color={colors.primary} />
                  <Text style={styles.linkText}>Create Ticket</Text>
                </Pressable>
              }
            />
          </View>
        </View>

        {/* Unit & lease overview */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Unit & Lease Overview"
            right={<OpenButton onPress={vm.openOverview} label="Open unit and lease overview" />}
          />
          <View>
            <OverviewCard facts={vm.facts} />
          </View>
        </View>

        {/* Special features */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Special Features"
            right={<OpenButton onPress={vm.openFeatures} label="Open special features" />}
          />
          <View>
            <FeatureChips features={vm.features} />
          </View>
        </View>

        {/* Unit services */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Unit Services"
            right={
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{vm.services.length} Services</Text>
              </View>
            }
          />
          <View>
            <ServiceCards services={vm.services} onPress={vm.openService} />
          </View>
        </View>

        {/* Floor plan */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead title="Floor Plan" />
          <View>
            <FloorPlanCard onOpen={vm.openFloorPlan} />
          </View>
        </View>

        {/* Document vault */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Document Vault"
            right={
              <Pressable
                onPress={vm.openArchive}
                hitSlop={8}
                accessibilityRole="button"
                style={({ pressed }) => [styles.link, pressed && styles.pressed]}
              >
                <Text style={styles.linkText}>Full Archive</Text>
                <TintIcon source={DETAIL_ICONS.arrow} size={ms(13)} color={colors.primary} />
              </Pressable>
            }
          />
          <View>
            <WhiteBox flush>
              <ActionRows
                items={vm.documents}
                onPress={vm.downloadDocument}
                trailingIcon={UNIT_ICONS.download}
              />
            </WhiteBox>
          </View>
        </View>

        {/* Tenant */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Tenant"
            right={<PeopleToggle value={vm.tenantTab} onChange={vm.setTenantTab} />}
          />
          {vm.tenants.length > 0 ? (
            <PeopleList people={vm.tenants} onPress={vm.openPerson} />
          ) : (
            <EmptyRow
              icon={UNIT_ICONS.tenant}
              text={
                vm.tenantTab === 'current'
                  ? 'No tenant assigned to this unit.'
                  : 'No past tenants for this unit.'
              }
            />
          )}
        </View>

        {/* Owner */}
        <View style={[styles.padded, styles.section]}>
          <DetailSectionHead
            title="Owner"
            right={<PeopleToggle value={vm.ownerTab} onChange={vm.setOwnerTab} />}
          />
          {vm.owners.length > 0 ? (
            <PeopleList people={vm.owners} onPress={vm.openPerson} />
          ) : (
            <EmptyRow
              icon={UNIT_ICONS.owner}
              text={
                vm.ownerTab === 'current'
                  ? 'No owner registered for this unit.'
                  : 'No past owners for this unit.'
              }
            />
          )}
        </View>
      </ScrollView>

      <FloorPlanViewer
        visible={vm.floorPlanOpen}
        title={`${vm.propertyName} — ${u.name}`}
        image={propertyAssets.floorPlan}
        onClose={vm.closeFloorPlan}
      />
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
  titleBlock: {
    marginTop: spacing.md,
  },
  gallery: {
    marginTop: spacing.xl,
  },
  stats: {
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xxl,
  },
  body: {
    marginTop: spacing.md,
  },
  pair: {
    flexDirection: 'row',
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
  countPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xxs + 1,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  countPillText: {
    ...typographyPresets.badge,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default LandlordUnitDetailsScreen;

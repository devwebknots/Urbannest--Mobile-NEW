/**
 * LandlordAddPropertyScreen: "Add New Property" (landlord). Opened by "Add
 * Property" on the Portfolio Overview (LandlordProperties); back returns
 * there.
 * Follows the "Add New Property" design with the app's parts (same page
 * frame as Landlord Onboarding / Rental Application):
 *  - light top bar (back, "Landlord", avatar), building photo top right
 *    over a soft blue glow
 *  - "Add New Property" / "Property Basic Information" / short line
 *  - Property | Unit 🔒 switch (Unit unlocks after saving), then
 *    Basic | Amenities tabs
 *  - Basic: Property Basics (name, type, value, built year, ownership,
 *    description, photos: upload area + thumbnails), Address Details (country,
 *    streets with suggestions, landmark, city, state, ZIP), Upload Property
 *    Video, Location Preview (map follows the address)
 *  - Amenities ("Property Amenities" design): Amenities (search + 4-column
 *    tiles), Amenities Access (selected shared amenities to grant +
 *    Generate Access), info note
 *  - Unit (after saving; "Unit / Home Information" design): Unit/Home Info |
 *    Amenities | Gallery tabs, body in properties/UnitTab (useAddUnit)
 *  - fixed footer: Cancel + Save & Continue → (Save Property → on Amenities;
 *    Next → / Save Unit on the Unit tab)
 * Sections lay on the page (no cards), app form rule.
 */

import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { VideoCameraIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import {
  HEADER_BUILDING_ASPECT,
  applicationAssets,
  applicationIcons,
} from '@/features/application/assets/applicationAssets';
import { AddressSuggestions, CurrentLocationButton } from '@/features/application/components/AddressLookupParts';
import { FieldInput, FieldRow, LabeledField } from '@/features/application/components/ApplicationFields';
import { ApplicationSection } from '@/features/application/components/ApplicationSection';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { useKeyboard } from '@/hooks/useKeyboard';
import { moderateScale as ms } from '@/utils/responsive';
import { LANDLORD_PROFILE } from '../constants';
import { amenityIcons, unitIcons } from '../assets/landlordAssets';
import {
  AmenityAccessList,
  AmenityGrid,
  AmenityIcon,
  AmenitySearch,
  InfoNote,
} from '../properties/AmenityParts';
import {
  DescriptionField,
  LocationPreview,
  PROPERTY_SUB_TABS,
  PropertyImagesField,
  PropertyTabs,
  SubTabItem,
  SubTabs,
  VideoDropZone,
} from '../properties/PropertyParts';
import { UnitTabContent } from '../properties/UnitTab';
import { useAddProperty } from '../properties/useAddProperty';
import { UnitSubTab, useAddUnit } from '../properties/useAddUnit';

const UNIT_SUB_TABS: readonly SubTabItem<UnitSubTab>[] = [
  { id: 'info', label: 'Unit/Home Info' },
  { id: 'amenities', label: 'Amenities', icon: applicationIcons.layers },
  { id: 'gallery', label: 'Gallery', icon: unitIcons.image },
];

/** Heading kicker + line per page state */
const HEADINGS = {
  basic: {
    kicker: 'Property Basic Information',
    line: 'Enter the foundational details, property type, value and address for your new real estate asset.',
  },
  amenities: {
    kicker: 'Property Amenities',
    line: 'Select amenities and manage access for the selected amenities.',
  },
  info: {
    kicker: 'Unit / Home Information',
    line: 'Enter the unit-level details including type, size, rent and configuration.',
  },
  unitAmenities: { kicker: 'Unit Amenities', line: 'Select the amenities this unit has.' },
  gallery: { kicker: 'Unit Gallery', line: 'Add photos of this unit.' },
};

interface Props {
  navigation?: { goBack: () => void };
}

export const LandlordAddPropertyScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useAddProperty(navigation);
  const { form, errors, setField, lookup } = vm;
  const unit = useAddUnit(vm.dialog.show, vm.pickMedia);

  const buildingW = Math.round(width * 0.4);
  const buildingH = Math.round(buildingW / HEADER_BUILDING_ASPECT);
  const footerPadBottom = Math.max(insets.bottom, spacing.md);
  const footerH = spacing.lg + ms(48) + footerPadBottom;
  const { isKeyboardVisible } = useKeyboard();
  const onUnit = vm.tab === 'unit';
  const onAmenities = !onUnit && vm.subTab === 'amenities';
  const heading = onUnit
    ? HEADINGS[unit.subTab === 'amenities' ? 'unitAmenities' : unit.subTab]
    : HEADINGS[vm.subTab];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior="padding"
      enabled={Platform.OS === 'android'}
      keyboardVerticalOffset={spacing.xxxl}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: isKeyboardVisible ? spacing.xl : footerH + spacing.xl,
        }}
      >
        {/* Soft blue glow + building, top right (same page frame as onboarding) */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />
        <Image
          source={applicationAssets.headerBuilding}
          style={[styles.building, { top: insets.top, width: buildingW, height: buildingH }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <LightTopBar
          title="Landlord"
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
            Add New Property
          </Text>
          <Text style={styles.kicker}>{heading.kicker}</Text>
          <Text style={styles.subtitle}>{heading.line}</Text>
        </View>

        <View style={styles.tabs}>
          <PropertyTabs tab={vm.tab} unitUnlocked={vm.unitUnlocked} onChange={vm.selectTab} />
          {onUnit ? (
            <SubTabs tabs={UNIT_SUB_TABS} tab={unit.subTab} onChange={unit.setSubTab} spread />
          ) : (
            <SubTabs tabs={PROPERTY_SUB_TABS} tab={vm.subTab} onChange={vm.setSubTab} />
          )}
        </View>

        {onUnit ? (
          <UnitTabContent
            unit={unit}
            propertyName={form.name.trim()}
            propertyType={vm.typeLabel}
          />
        ) : vm.subTab === 'amenities' ? (
          <View style={styles.sections}>
            <ApplicationSection
              title="Amenities"
              subtitle="Select the amenities available at this property."
              icon="layers"
            >
              <AmenitySearch value={vm.amenityQuery} onChangeText={vm.setAmenityQuery} />
              <AmenityGrid
                amenities={vm.shownAmenities}
                selected={vm.amenities}
                onToggle={vm.toggleAmenity}
              />
            </ApplicationSection>

            <ApplicationSection
              title="Amenities Access"
              subtitle="Grant access for the selected amenities in this property."
              icon={<AmenityIcon name="key" size={ms(22)} color={colors.primary} />}
            >
              <AmenityAccessList
                amenities={vm.accessAmenities}
                granted={vm.access}
                onToggle={vm.toggleAccess}
              />
              <Button
                title="Generate Access"
                variant="soft"
                onPress={vm.generateAccess}
                leftIcon={
                  <Image
                    source={amenityIcons.key}
                    style={styles.keyIcon}
                    resizeMode="contain"
                  />
                }
              />
            </ApplicationSection>

            <InfoNote text="Amenities access can only be configured for the amenities you have selected above." />
          </View>
        ) : (
          <View style={styles.sections}>
            {/* Property basics */}
            <ApplicationSection title="Property Basics" icon="layers">
              <FieldRow>
                <LabeledField label="Property Name" required error={errors.name} style={styles.half}>
                  <FieldInput
                    value={form.name}
                    onChangeText={t => setField('name', t)}
                    invalid={!!errors.name}
                    placeholder="e.g. Skyline Heights Plaza"
                    autoCapitalize="words"
                    maxLength={60}
                    accessibilityLabel="Property name"
                  />
                </LabeledField>
                <LabeledField label="Property Type" required error={errors.typeId} style={styles.half}>
                  <FormSelect
                    value={vm.typeLabel}
                    placeholder="Select Type"
                    onPress={() => vm.openPicker('type')}
                    accessibilityLabel="Property type"
                  />
                </LabeledField>
              </FieldRow>
              <FieldRow>
                <LabeledField label="Property Value (Est.)" style={styles.half}>
                  <FieldInput
                    value={form.value}
                    onChangeText={t => setField('value', t.replace(/[^0-9.]/g, ''))}
                    prefix="$"
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    maxLength={14}
                    accessibilityLabel="Property value estimate"
                  />
                </LabeledField>
                <LabeledField label="Built In Year" style={styles.half}>
                  <FieldInput
                    value={form.builtYear}
                    onChangeText={t => setField('builtYear', t.replace(/\D/g, ''))}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    accessibilityLabel="Built in year"
                  />
                </LabeledField>
              </FieldRow>
              <LabeledField label="Ownership Type" required error={errors.ownershipId}>
                <FormSelect
                  value={vm.ownershipLabel}
                  placeholder="Select Ownership Type"
                  onPress={() => vm.openPicker('ownership')}
                  accessibilityLabel="Ownership type"
                />
              </LabeledField>
              <LabeledField label="Description">
                <DescriptionField
                  value={form.description}
                  onChangeText={t => setField('description', t)}
                />
              </LabeledField>
              <LabeledField label="Upload Property Images">
                <PropertyImagesField
                  images={vm.images}
                  onUpload={vm.uploadImages}
                  onRemove={vm.removeImage}
                />
              </LabeledField>
            </ApplicationSection>

            {/* Address */}
            <ApplicationSection title="Address Details" icon="mapPin">
              <LabeledField label="Country" required error={errors.countryId}>
                <FormSelect
                  value={vm.countryLabel}
                  placeholder="Select Country"
                  onPress={() => vm.openPicker('country')}
                  accessibilityLabel="Country"
                />
              </LabeledField>
              <LabeledField
                label="Street Address 01"
                required
                error={errors.street1}
                action={
                  <CurrentLocationButton
                    onPress={lookup.useCurrentLocation}
                    loading={lookup.locating}
                  />
                }
              >
                <FieldInput
                  value={form.street1}
                  onChangeText={t => {
                    setField('street1', t);
                    lookup.type(t, 'street1');
                  }}
                  onFocus={() => lookup.type(form.street1, 'street1')}
                  onBlur={lookup.close}
                  invalid={!!errors.street1}
                  placeholder="Building No, Street Name"
                  autoComplete="address-line1"
                  autoCorrect={false}
                  maxLength={80}
                  accessibilityLabel="Street address 01"
                />
                {lookup.field === 'street1' ? (
                  <AddressSuggestions suggestions={lookup.suggestions} onSelect={lookup.select} />
                ) : null}
              </LabeledField>
              <LabeledField label="Street Address 02">
                <FieldInput
                  value={form.street2}
                  onChangeText={t => {
                    setField('street2', t);
                    lookup.type(t, 'street2');
                  }}
                  onFocus={() => lookup.type(form.street2, 'street2')}
                  onBlur={lookup.close}
                  placeholder="Suite, Floor (Optional)"
                  autoComplete="address-line2"
                  autoCorrect={false}
                  maxLength={80}
                  accessibilityLabel="Street address 02"
                />
                {lookup.field === 'street2' ? (
                  <AddressSuggestions suggestions={lookup.suggestions} onSelect={lookup.select} />
                ) : null}
              </LabeledField>
              <FieldRow>
                <LabeledField label="Landmark" style={styles.half}>
                  <FieldInput
                    value={form.landmark}
                    onChangeText={t => setField('landmark', t)}
                    placeholder="Near Central Park"
                    maxLength={60}
                    accessibilityLabel="Landmark"
                  />
                </LabeledField>
                <LabeledField label="City" required error={errors.city} style={styles.half}>
                  <FieldInput
                    value={form.city}
                    onChangeText={t => setField('city', t)}
                    invalid={!!errors.city}
                    placeholder="New York"
                    autoCapitalize="words"
                    maxLength={40}
                    accessibilityLabel="City"
                  />
                </LabeledField>
              </FieldRow>
              <FieldRow>
                <LabeledField
                  label="State"
                  required
                  error={vm.hasStateList ? errors.stateId : errors.region}
                  style={styles.half}
                >
                  {vm.hasStateList ? (
                    <FormSelect
                      value={vm.stateLabel}
                      placeholder="Select State"
                      onPress={() => vm.openPicker('state')}
                      accessibilityLabel="State"
                    />
                  ) : (
                    <FieldInput
                      value={form.region}
                      onChangeText={t => setField('region', t)}
                      invalid={!!errors.region}
                      placeholder="State / Region"
                      autoCapitalize="words"
                      maxLength={40}
                      accessibilityLabel="State or region"
                    />
                  )}
                </LabeledField>
                <LabeledField label="Zipcode" required error={errors.zip} style={styles.half}>
                  <FieldInput
                    value={form.zip}
                    onChangeText={t => setField('zip', t)}
                    invalid={!!errors.zip}
                    placeholder="10001"
                    autoCapitalize="characters"
                    autoComplete="postal-code"
                    maxLength={10}
                    accessibilityLabel="Zipcode"
                  />
                </LabeledField>
              </FieldRow>
            </ApplicationSection>

            {/* Video */}
            <ApplicationSection
              title="Upload Property Video"
              icon={<VideoCameraIcon size={ms(22)} color={colors.primary} />}
            >
              <VideoDropZone video={vm.video} onUpload={vm.uploadVideo} onRemove={vm.removeVideo} />
            </ApplicationSection>

            {/* Map */}
            <ApplicationSection title="Location Preview" icon="locate">
              <LocationPreview
                point={vm.map.point}
                zoom={vm.map.zoom}
                located={vm.map.located}
                addressLine={vm.map.addressLine}
                onZoomIn={vm.map.zoomIn}
                onZoomOut={vm.map.zoomOut}
              />
            </ApplicationSection>
          </View>
        )}
      </ScrollView>

      {/* Fixed actions over a fade into the page; hidden while typing */}
      {isKeyboardVisible ? null : (
        <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
          <Button title="Cancel" variant="soft" onPress={vm.cancel} style={styles.cancel} />
          <Button
            title={
              onUnit
                ? unit.isLastStep
                  ? 'Save Unit'
                  : 'Next'
                : onAmenities
                  ? 'Save Property'
                  : 'Save & Continue'
            }
            variant="brand"
            onPress={onUnit ? unit.next : vm.saveAndContinue}
            style={styles.save}
            rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
          />
        </View>
      )}

      <CategorySheet
        visible={vm.picker !== null}
        title={vm.pickerProps.title}
        categories={vm.pickerProps.options}
        selectedId={vm.pickerProps.selectedId}
        onSelect={vm.pick}
        onClose={vm.closePicker}
      />
      <CategorySheet
        visible={unit.picker !== null}
        title={unit.pickerProps.title}
        categories={unit.pickerProps.options}
        selectedId={unit.pickerProps.selectedId}
        onSelect={unit.pick}
        onClose={unit.closePicker}
      />
      <AppDialog {...vm.dialog.props} />
    </KeyboardAvoidingView>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';

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
  // Blue line under the title (same style as onboarding)
  kicker: {
    ...typographyPresets.bodyBold,
    marginTop: spacing.xs,
    color: colors.primary,
  },
  subtitle: {
    ...typographyPresets.body,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  tabs: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm,
  },
  sections: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sectionGap,
  },
  half: {
    flex: 1,
  },
  keyIcon: {
    width: ms(18),
    height: ms(18),
    tintColor: colors.primary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundImage: `linear-gradient(180deg, rgba(238, 243, 249, 0) 0%, ${colors.pageTint} 35%)`,
  },
  cancel: {
    flex: 1,
  },
  save: {
    flex: 2,
  },
});

export default LandlordAddPropertyScreen;

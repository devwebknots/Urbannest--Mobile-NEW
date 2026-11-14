/**
 * LandlordPropertiesScreen: "Add New Property" (landlord). Opened by the
 * dashboard's burger menu and right after landlord onboarding is
 * activated (dashboard underneath, back returns there).
 * Follows the "Add New Property" design with the app's parts (same page
 * frame as Landlord Onboarding / Rental Application):
 *  - light top bar (back, "Landlord", avatar), building photo top right
 *    over a soft blue glow
 *  - "Add New Property" / "Property Basic Information" / short line
 *  - Property | Unit 🔒 switch (Unit unlocks after saving), then
 *    Basic | Amenities tabs
 *  - Basic: Property Basics (name, type, value, built year, ownership,
 *    description, main image + 3 photos), Address Details (country,
 *    streets with suggestions, landmark, city, state, ZIP), Upload Property
 *    Video, Location Preview (map follows the address)
 *  - Amenities: multi-select chips
 *  - fixed footer: Cancel + Save & Continue →
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
import { HEADER_BUILDING_ASPECT, applicationAssets } from '@/features/application/assets/applicationAssets';
import { AddressSuggestions, CurrentLocationButton } from '@/features/application/components/AddressLookupParts';
import { FieldInput, FieldRow, LabeledField } from '@/features/application/components/ApplicationFields';
import { ApplicationSection } from '@/features/application/components/ApplicationSection';
import { ChoiceChips } from '@/features/application/components/ChoiceChips';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { useKeyboard } from '@/hooks/useKeyboard';
import { moderateScale as ms } from '@/utils/responsive';
import { LANDLORD_PROFILE } from '../constants';
import { PROPERTY_AMENITIES } from '../properties/constants';
import {
  DescriptionField,
  ExtraImageSlots,
  LocationPreview,
  MainImageField,
  PropertyTabs,
  SubTabs,
  VideoDropZone,
} from '../properties/PropertyParts';
import { useAddProperty } from '../properties/useAddProperty';

interface Props {
  navigation?: { goBack: () => void };
}

export const LandlordPropertiesScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useAddProperty(navigation);
  const { form, errors, setField, lookup } = vm;

  const buildingW = Math.round(width * 0.4);
  const buildingH = Math.round(buildingW / HEADER_BUILDING_ASPECT);
  const footerPadBottom = Math.max(insets.bottom, spacing.md);
  const footerH = spacing.lg + ms(48) + footerPadBottom;
  const { isKeyboardVisible } = useKeyboard();

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
          <Text style={styles.kicker}>Property Basic Information</Text>
          <Text style={styles.subtitle}>
            Enter the foundational details, property type, value and address for your new real
            estate asset.
          </Text>
        </View>

        <View style={styles.tabs}>
          <PropertyTabs tab={vm.tab} unitUnlocked={vm.unitUnlocked} onChange={vm.selectTab} />
          {vm.tab === 'property' ? <SubTabs tab={vm.subTab} onChange={vm.setSubTab} /> : null}
        </View>

        {vm.tab === 'unit' ? (
          <View style={styles.sections}>
            <ApplicationSection
              title="Units"
              subtitle="Add the units inside this property."
              icon="layers"
            >
              <Text style={styles.subtitle}>Unit setup comes next.</Text>
            </ApplicationSection>
          </View>
        ) : vm.subTab === 'amenities' ? (
          <View style={styles.sections}>
            <ApplicationSection
              title="Amenities"
              subtitle="Pick everything the property offers."
              icon="circleCheck"
            >
              <ChoiceChips
                options={PROPERTY_AMENITIES}
                values={vm.amenities}
                onChange={vm.toggleAmenity}
              />
            </ApplicationSection>
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
              <LabeledField label="Upload Property Image">
                <View style={styles.media}>
                  <MainImageField image={vm.mainImage} onUpload={vm.uploadMainImage} />
                  <ExtraImageSlots
                    images={vm.extraImages}
                    onAdd={vm.uploadExtraImage}
                    onRemove={vm.removeExtraImage}
                  />
                </View>
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
                  onChangeText={t => setField('street2', t)}
                  placeholder="Suite, Floor (Optional)"
                  autoComplete="address-line2"
                  autoCorrect={false}
                  maxLength={80}
                  accessibilityLabel="Street address 02"
                />
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
            title="Save & Continue"
            variant="brand"
            onPress={vm.saveAndContinue}
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
  media: {
    gap: spacing.md,
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

export default LandlordPropertiesScreen;

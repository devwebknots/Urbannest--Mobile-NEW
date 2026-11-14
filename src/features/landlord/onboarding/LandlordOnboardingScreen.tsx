/**
 * LandlordOnboardingScreen: "Independent Landlord" registration, opened
 * from Add Persona (Landlord → Continue). Follows the "Landlord
 * Onboarding" design with the rental application's look and parts:
 *  - light top bar (back + "Landlord Onboarding"), the building photo in
 *    the top-right corner over a soft blue glow
 *  - "Independent Landlord" / "Registration & Profile Setup" / short line
 *  - ApplicationStepper: Personal Details · Residential Address · Identity
 *    Verification
 *  - the step's section laid on the page (icon tile + title + subtitle,
 *    then fields)
 *  - fixed footer: full-width "Continue →" on step 1; on steps 2–3 two
 *    equal-width buttons, soft "← Back" + "Continue →" / "Activate ✓"
 *    (the top-bar arrow and done stepper circles also go back)
 * Activate shows the success dialog, then "View Properties" opens the
 * landlord Properties page (dashboard underneath, so back goes there).
 */

import React, { useEffect, useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewInstance,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { HEADER_BUILDING_ASPECT, applicationAssets } from '@/features/application/assets/applicationAssets';
import { ApplicationIcon } from '@/features/application/components/ApplicationIcon';
import {
  FieldInput,
  FieldRow,
  LabeledField,
  PhoneField,
} from '@/features/application/components/ApplicationFields';
import { ApplicationSection } from '@/features/application/components/ApplicationSection';
import { ApplicationStepper } from '@/features/application/components/ApplicationStepper';
import { StepTransition } from '@/features/application/components/StepTransition';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { useKeyboard } from '@/hooks/useKeyboard';
import { moderateScale as ms } from '@/utils/responsive';
import {
  ActivationNote,
  DocumentDropZone,
  ProfilePhotoField,
} from './OnboardingParts';
import {
  LandlordOnboardingNavigation,
  useLandlordOnboarding,
} from './useLandlordOnboarding';

interface Props {
  navigation?: LandlordOnboardingNavigation;
}

export const LandlordOnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useLandlordOnboarding(navigation);
  const { form, errors, setField } = vm;
  const step = vm.steps[vm.step];

  const buildingW = Math.round(width * 0.4);
  const buildingH = Math.round(buildingW / HEADER_BUILDING_ASPECT);
  const footerPadBottom = Math.max(insets.bottom, spacing.md);
  // One row of buttons (48 high)
  const footerH = spacing.lg + ms(48) + footerPadBottom;

  // A new step starts at the top of the page
  const scrollRef = useRef<ScrollViewInstance>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [vm.step]);

  // While typing, the fixed button steps aside
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
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: isKeyboardVisible ? spacing.xl : footerH + spacing.xl,
        }}
      >
        {/* Soft blue glow + building, top right (same as Rental Application) */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />
        <Image
          source={applicationAssets.headerBuilding}
          style={[styles.building, { top: insets.top, width: buildingW, height: buildingH }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <LightTopBar
          title="Landlord Onboarding"
          titleAlign="left"
          onBack={vm.back}
          backLabel={vm.step > 0 ? 'Previous step' : 'Back'}
        />

        <View style={styles.heading}>
          <Text
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            accessibilityRole="header"
          >
            Independent Landlord
          </Text>
          <Text style={styles.kicker}>Registration & Profile Setup</Text>
          <Text style={styles.subtitle}>
            Set up your landlord profile to manage your properties directly — without a
            property manager.
          </Text>
        </View>

        <View style={styles.stepper}>
          {/* edgeAligned: "Personal Details" starts on the same line as the text above */}
          <ApplicationStepper
            steps={vm.steps}
            current={vm.step}
            onStepPress={vm.goToStep}
            edgeAligned
          />
        </View>

        <StepTransition step={vm.step}>
          <View style={styles.section}>
            <ApplicationSection title={step.title} subtitle={step.subtitle} icon={step.icon}>
              {vm.step === 0 ? (
                <>
                  <FieldRow>
                    <LabeledField label="First Name" required error={errors.firstName} style={styles.half}>
                      <FieldInput
                        value={form.firstName}
                        onChangeText={t => setField('firstName', t)}
                        invalid={!!errors.firstName}
                        autoCapitalize="words"
                        autoComplete="given-name"
                        maxLength={40}
                        accessibilityLabel="First name"
                      />
                    </LabeledField>
                    <LabeledField label="Last Name" required error={errors.lastName} style={styles.half}>
                      <FieldInput
                        value={form.lastName}
                        onChangeText={t => setField('lastName', t)}
                        invalid={!!errors.lastName}
                        autoCapitalize="words"
                        autoComplete="family-name"
                        maxLength={40}
                        accessibilityLabel="Last name"
                      />
                    </LabeledField>
                  </FieldRow>
                  <LabeledField label="Profile Photo">
                    <ProfilePhotoField photo={vm.photo} onUpload={vm.uploadPhoto} />
                  </LabeledField>
                  <LabeledField label="Phone Number" required error={errors.phone}>
                    <PhoneField
                      country={vm.phoneCountry}
                      value={form.phone}
                      onChangeText={t => setField('phone', t)}
                      onPickCountry={() => vm.openPicker('phoneCountry')}
                      invalid={!!errors.phone}
                    />
                  </LabeledField>
                  <LabeledField label="Occupation">
                    <FieldInput
                      value={form.occupation}
                      onChangeText={t => setField('occupation', t)}
                      placeholder="e.g. Software engineer"
                      autoCapitalize="sentences"
                      maxLength={60}
                      accessibilityLabel="Occupation"
                    />
                  </LabeledField>
                </>
              ) : vm.step === 1 ? (
                <>
                  <LabeledField label="Country" required error={errors.countryId}>
                    <FormSelect
                      value={vm.countryLabel}
                      placeholder="Select country..."
                      onPress={() => vm.openPicker('country')}
                      accessibilityLabel="Country"
                    />
                  </LabeledField>
                  <LabeledField
                    label="State / Region"
                    required
                    error={vm.hasStateList ? errors.stateId : errors.region}
                  >
                    {vm.hasStateList ? (
                      <FormSelect
                        value={vm.stateLabel}
                        placeholder="Select state..."
                        onPress={() => vm.openPicker('state')}
                        accessibilityLabel="State or region"
                      />
                    ) : (
                      <FieldInput
                        value={form.region}
                        onChangeText={t => setField('region', t)}
                        invalid={!!errors.region}
                        placeholder="State or region"
                        autoCapitalize="words"
                        maxLength={40}
                        accessibilityLabel="State or region"
                      />
                    )}
                  </LabeledField>
                  <LabeledField label="Street Address" required error={errors.street1}>
                    <FieldInput
                      value={form.street1}
                      onChangeText={t => setField('street1', t)}
                      invalid={!!errors.street1}
                      placeholder="e.g. 123 Main St"
                      autoComplete="address-line1"
                      autoCorrect={false}
                      maxLength={80}
                      accessibilityLabel="Street address"
                    />
                  </LabeledField>
                  <LabeledField label="Street Address 2">
                    <FieldInput
                      value={form.street2}
                      onChangeText={t => setField('street2', t)}
                      placeholder="Apt, suite, unit (optional)"
                      autoComplete="address-line2"
                      autoCorrect={false}
                      maxLength={80}
                      accessibilityLabel="Street address 2"
                    />
                  </LabeledField>
                  <FieldRow>
                    <LabeledField label="City" required error={errors.city} style={styles.city}>
                      <FieldInput
                        value={form.city}
                        onChangeText={t => setField('city', t)}
                        invalid={!!errors.city}
                        placeholder="e.g. Austin"
                        autoCapitalize="words"
                        maxLength={40}
                        accessibilityLabel="City"
                      />
                    </LabeledField>
                    <LabeledField label="ZIP / Postal Code" required error={errors.zip} style={styles.zip}>
                      <FieldInput
                        value={form.zip}
                        onChangeText={t => setField('zip', t)}
                        invalid={!!errors.zip}
                        placeholder="e.g. 78701"
                        autoCapitalize="characters"
                        autoComplete="postal-code"
                        maxLength={10}
                        accessibilityLabel="ZIP or postal code"
                      />
                    </LabeledField>
                  </FieldRow>
                  <LabeledField label="Landmark">
                    <FieldInput
                      value={form.landmark}
                      onChangeText={t => setField('landmark', t)}
                      placeholder="Nearby landmark (optional)"
                      maxLength={80}
                      accessibilityLabel="Landmark"
                    />
                  </LabeledField>
                </>
              ) : (
                <>
                  <LabeledField label="ID Type" required error={errors.idTypeId}>
                    <FormSelect
                      value={vm.idTypeLabel}
                      placeholder="Select..."
                      onPress={() => vm.openPicker('idType')}
                      accessibilityLabel="ID type"
                    />
                  </LabeledField>
                  <LabeledField label="ID Number" required error={errors.idNumber}>
                    <FieldInput
                      value={form.idNumber}
                      onChangeText={t => setField('idNumber', t)}
                      invalid={!!errors.idNumber}
                      placeholder="Enter ID number"
                      autoCapitalize="characters"
                      autoCorrect={false}
                      maxLength={30}
                      accessibilityLabel="ID number"
                    />
                  </LabeledField>
                  <LabeledField label="Upload Document(s)" required error={errors.documents}>
                    <DocumentDropZone
                      documents={vm.documents}
                      onUpload={vm.uploadDocuments}
                      onRemove={vm.removeDocument}
                      invalid={!!errors.documents}
                    />
                  </LabeledField>
                  <ActivationNote />
                </>
              )}
            </ApplicationSection>
          </View>
        </StepTransition>
      </ScrollView>

      {/* Fixed action over a fade into the page; hidden while typing */}
      {isKeyboardVisible ? null : (
        <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
          {/* Steps 2–3: soft "Back" + main action, equal widths */}
          {vm.prevStepLabel ? (
            <Button
              title="Back"
              variant="soft"
              onPress={vm.back}
              accessibilityLabel={`Back to ${vm.prevStepLabel}`}
              style={styles.half}
              leftIcon={
                <View style={styles.flip}>
                  <ArrowRightIcon size={ms(16)} color={colors.navy} />
                </View>
              }
            />
          ) : null}
          <Button
            title={vm.continueLabel}
            variant="brand"
            onPress={vm.continueToNext}
            style={styles.half}
            rightIcon={
              vm.isLast ? (
                <ApplicationIcon name="circleCheck" size={ms(16)} color={colors.white} />
              ) : (
                <ArrowRightIcon size={ms(16)} color={colors.white} />
              )
            }
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
  // Blue line under the title (same style as "Step 1 of 4")
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
  stepper: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  section: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
  },
  half: {
    flex: 1,
  },
  city: {
    flex: 1.2,
  },
  zip: {
    flex: 1,
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
  flip: {
    transform: [{ rotate: '180deg' }],
  },
});

export default LandlordOnboardingScreen;

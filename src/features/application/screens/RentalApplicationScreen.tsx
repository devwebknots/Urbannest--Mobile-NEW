/**
 * RentalApplicationScreen: step 1 of 4 of the rental application
 * ("Applicant & Household"), opened by Apply Now on a property's details.
 * Follows the "Rental Application" design, top to bottom:
 *  - light top bar: back + "Rental Application"; the design's building
 *    photo in the top-right corner, faded into the page
 *  - "Step 1 of 4" / "Applicant & Household" / short line
 *  - stepper: Applicant & Household · History · Documents · Submission
 *  - sections laid on the page (no cards): Primary Applicant Identity, Residential Address, Move-In
 *    Details, Co-Applicants (invite), Dependents (add / edit)
 *  - fixed "Continue to Stage N →" button ("Submit Application" on the
 *    last step) over a fade into the page
 * Steps 2–4 show a "coming soon" placeholder; changing step slides the
 * heading + content in (StepTransition) and scrolls back to the top.
 * No bottom tab bar: a pushed page, the back button is the way out.
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
import { useKeyboard } from '@/hooks/useKeyboard';
import { AppDialog } from '@/components/AppDialog';
import { Button } from '@/components/Button';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { LightTopBar } from '@/features/renter/components/LightTopBar';
import { Reveal } from '@/features/renter/components/Reveal';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { moderateScale as ms } from '@/utils/responsive';
import { HEADER_BUILDING_ASPECT, applicationAssets } from '../assets/applicationAssets';
import { AddressSuggestions, CurrentLocationButton } from '../components/AddressLookupParts';
import { ApplicationIcon } from '../components/ApplicationIcon';
import {
  FieldInput,
  FieldRow,
  LabeledField,
  PhoneField,
} from '../components/ApplicationFields';
import { ApplicationSection } from '../components/ApplicationSection';
import { ApplicationStepper } from '../components/ApplicationStepper';
import { EditButton, InviteSentPill, PersonRow } from '../components/PersonRow';
import { DocumentsStep } from '../components/DocumentsStep';
import { HistoryStep } from '../components/HistoryStep';
import { PersonSheet } from '../components/PersonSheet';
import { ReviewStep } from '../components/ReviewStep';
import { StepTransition } from '../components/StepTransition';
import {
  RentalApplicationNavigation,
  useRentalApplication,
} from '../hooks/useRentalApplication';

interface Props {
  navigation?: RentalApplicationNavigation;
  route?: { params?: { propertyId?: string } };
}

export const RentalApplicationScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const vm = useRentalApplication(route?.params?.propertyId, navigation);
  const { form, errors, setField } = vm;

  const buildingW = Math.round(width * 0.4);
  const buildingH = Math.round(buildingW / HEADER_BUILDING_ASPECT);
  const footerPadBottom = Math.max(insets.bottom, spacing.md);
  const footerH = spacing.lg + ms(48) + footerPadBottom;
  const step = vm.steps[vm.currentStep];

  // A new step starts at the top of the page
  const scrollRef = useRef<ScrollViewInstance>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [vm.currentStep]);

  // While typing, the fixed button steps aside (like most apps) so the
  // keyboard and the field being edited get the space
  const { isKeyboardVisible } = useKeyboard();

  return (
    /*
     * Keyboard: iOS insets the scroll view and keeps the focused field in
     * view (automaticallyAdjustKeyboardInsets). Android draws edge to edge,
     * where the window may not resize, so a padding KeyboardAvoidingView
     * lifts the page; Android's ScrollView then scrolls the focused field
     * into view. (If the window does resize, the avoiding view adds nothing.)
     */
    <KeyboardAvoidingView
      style={styles.root}
      behavior="padding"
      enabled={Platform.OS === 'android'}
      // Extra lift so the focused field sits clearly above the keyboard,
      // not touching its top edge
      keyboardVerticalOffset={KEYBOARD_GAP}
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
        {/* Soft blue glow + the design's building, top right */}
        <View pointerEvents="none" style={[styles.glow, { width }]} />
        <Image
          source={applicationAssets.headerBuilding}
          style={[styles.building, { top: insets.top, width: buildingW, height: buildingH }]}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <LightTopBar
          title="Rental Application"
          titleAlign="left"
          onBack={vm.back}
          backLabel={vm.currentStep > 0 ? 'Previous step' : 'Back to property'}
        />

        <StepTransition step={vm.currentStep}>
          <View style={styles.heading}>
            <Text style={styles.stepOf}>
              Step {vm.currentStep + 1} of {vm.steps.length}
            </Text>
            <Text
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              accessibilityRole="header"
            >
              {step.title}
            </Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>
          </View>
        </StepTransition>

        <View style={styles.stepper}>
          <ApplicationStepper
            steps={vm.steps}
            current={vm.currentStep}
            onStepPress={vm.goToStep}
          />
        </View>

        <StepTransition step={vm.currentStep}>
        {vm.currentStep > 0 ? (
          vm.currentStep === 1 ? (
            <HistoryStep vm={vm.history} />
          ) : (
            vm.currentStep === 2 ? (
              <DocumentsStep vm={vm.documents} />
            ) : (
              <ReviewStep
                vm={vm.review}
                applicant={vm.applicantSummary}
                legalName={{ first: form.firstName, middle: form.middleName, last: form.lastName }}
                onEditApplicant={() => vm.editStep(0)}
                onEditScreening={() => vm.editStep(1)}
              />
            )
          )
        ) : (
        <View style={styles.sections}>
          {/* Primary applicant */}
          <Reveal delay={60}>
            <ApplicationSection
              title="Primary Applicant Identity"
              subtitle="Your personal and contact details."
            >
              <FieldRow>
                <LabeledField label="Legal First Name" required error={errors.firstName} style={styles.half}>
                  <FieldInput
                    value={form.firstName}
                    onChangeText={t => setField('firstName', t)}
                    invalid={!!errors.firstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    maxLength={40}
                    accessibilityLabel="Legal first name"
                  />
                </LabeledField>
                <LabeledField label="Middle Name" style={styles.half}>
                  <FieldInput
                    value={form.middleName}
                    onChangeText={t => setField('middleName', t)}
                    autoCapitalize="words"
                    maxLength={40}
                    accessibilityLabel="Middle name"
                  />
                </LabeledField>
              </FieldRow>
              <FieldRow>
                <LabeledField label="Legal Last Name" required error={errors.lastName} style={styles.half}>
                  <FieldInput
                    value={form.lastName}
                    onChangeText={t => setField('lastName', t)}
                    invalid={!!errors.lastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    maxLength={40}
                    accessibilityLabel="Legal last name"
                  />
                </LabeledField>
                <LabeledField label="Date of Birth" required error={errors.dateOfBirth} style={styles.half}>
                  <FieldInput
                    value={form.dateOfBirth}
                    onChangeText={t => setField('dateOfBirth', t)}
                    invalid={!!errors.dateOfBirth}
                    placeholder="DD/MM/YYYY"
                    rightIcon="calendar"
                    keyboardType="number-pad"
                    maxLength={10}
                    accessibilityLabel="Date of birth"
                  />
                </LabeledField>
              </FieldRow>
              <LabeledField label="Email Address" required error={errors.email}>
                <FieldInput
                  value={form.email}
                  onChangeText={t => setField('email', t)}
                  invalid={!!errors.email}
                  leftIcon="mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  maxLength={80}
                  accessibilityLabel="Email address"
                />
              </LabeledField>
              <LabeledField label="Mobile Phone" required error={errors.phone}>
                <PhoneField
                  country={vm.country}
                  value={form.phone}
                  onChangeText={t => setField('phone', t)}
                  onPickCountry={() => vm.openPicker('country')}
                  invalid={!!errors.phone}
                />
              </LabeledField>
            </ApplicationSection>
          </Reveal>

          {/* Residential address */}
          <Reveal delay={120}>
            <ApplicationSection title="Residential Address">
              <LabeledField
                label="Street Address 1"
                required
                error={errors.street1}
                action={
                  <CurrentLocationButton
                    onPress={vm.homeLookup.useCurrentLocation}
                    loading={vm.homeLookup.locating}
                  />
                }
              >
                <FieldInput
                  value={form.street1}
                  onChangeText={t => {
                    setField('street1', t);
                    vm.homeLookup.type(t, 'street1');
                  }}
                  onFocus={() => vm.homeLookup.type(form.street1, 'street1')}
                  onBlur={vm.homeLookup.close}
                  invalid={!!errors.street1}
                  autoComplete="address-line1"
                  autoCorrect={false}
                  maxLength={80}
                  accessibilityLabel="Street address 1"
                />
                {vm.homeLookup.field === 'street1' ? (
                  <AddressSuggestions
                    suggestions={vm.homeLookup.suggestions}
                    onSelect={vm.homeLookup.select}
                  />
                ) : null}
              </LabeledField>
              <LabeledField label="Street Address 2">
                <FieldInput
                  value={form.street2}
                  onChangeText={t => {
                    setField('street2', t);
                    vm.homeLookup.type(t, 'street2');
                  }}
                  onFocus={() => vm.homeLookup.type(form.street2, 'street2')}
                  onBlur={vm.homeLookup.close}
                  placeholder="Apt, suite, unit (optional)"
                  autoComplete="address-line2"
                  autoCorrect={false}
                  maxLength={80}
                  accessibilityLabel="Street address 2"
                />
                {vm.homeLookup.field === 'street2' ? (
                  <AddressSuggestions
                    suggestions={vm.homeLookup.suggestions}
                    onSelect={vm.homeLookup.select}
                  />
                ) : null}
              </LabeledField>
              <FieldRow>
                <LabeledField label="City" required error={errors.city} style={styles.city}>
                  <FieldInput
                    value={form.city}
                    onChangeText={t => setField('city', t)}
                    invalid={!!errors.city}
                    autoCapitalize="words"
                    maxLength={40}
                    accessibilityLabel="City"
                  />
                </LabeledField>
                <LabeledField label="State" required error={errors.stateId} style={styles.state}>
                  <FormSelect
                    value={vm.stateLabel}
                    placeholder="--"
                    onPress={() => vm.openPicker('state')}
                    accessibilityLabel="State"
                  />
                </LabeledField>
                <LabeledField label="ZIP Code" required error={errors.zip} style={styles.zip}>
                  <FieldInput
                    value={form.zip}
                    onChangeText={t => setField('zip', t)}
                    invalid={!!errors.zip}
                    keyboardType="number-pad"
                    autoComplete="postal-code"
                    maxLength={5}
                    accessibilityLabel="ZIP code"
                  />
                </LabeledField>
              </FieldRow>
            </ApplicationSection>
          </Reveal>

          {/* Move-in */}
          <Reveal delay={180}>
            <ApplicationSection title="Move-In Details">
              <FieldRow>
                <LabeledField label="Desired Move-In Date" required error={errors.moveInDate} style={styles.half}>
                  <FieldInput
                    value={form.moveInDate}
                    onChangeText={t => setField('moveInDate', t)}
                    invalid={!!errors.moveInDate}
                    placeholder="DD/MM/YYYY"
                    rightIcon="calendar"
                    keyboardType="number-pad"
                    maxLength={10}
                    accessibilityLabel="Desired move-in date"
                  />
                </LabeledField>
                <LabeledField label="Number of Occupants" required error={errors.occupants} style={styles.half}>
                  <FormSelect
                    value={form.occupants || undefined}
                    placeholder="Select"
                    onPress={() => vm.openPicker('occupants')}
                    accessibilityLabel="Number of occupants"
                  />
                </LabeledField>
              </FieldRow>
            </ApplicationSection>
          </Reveal>

          {/* Co-applicants */}
          <Reveal delay={240}>
            <ApplicationSection
              title="Co-Applicants"
              subtitle="Invite others to fill in their own part."
            >
              {vm.coApplicants.map(c => (
                <PersonRow key={c.id} name={c.name} detail={c.email} initial right={<InviteSentPill />} />
              ))}
              <Button
                title="Add Co-Applicant"
                variant="soft"
                size="md"
                onPress={vm.addCoApplicant}
                leftIcon={<ApplicationIcon name="plus" size={ms(16)} color={colors.navy} />}
              />
            </ApplicationSection>
          </Reveal>

          {/* Dependents */}
          <Reveal delay={300}>
            <ApplicationSection
              title="Dependents"
              subtitle="Family members who will live with you."
            >
              {vm.dependents.map(d => (
                <PersonRow
                  key={d.id}
                  name={d.name}
                  detail={d.relationship}
                  right={<EditButton label={`Edit ${d.name}`} onPress={() => vm.editDependent(d.id)} />}
                />
              ))}
              <Button
                title="Add a Dependent"
                variant="soft"
                size="md"
                onPress={vm.addDependent}
                leftIcon={<ApplicationIcon name="plus" size={ms(16)} color={colors.navy} />}
              />
            </ApplicationSection>
          </Reveal>
        </View>
        )}
        </StepTransition>
      </ScrollView>

      {/* Fixed action; the page fades out under it. Hidden while typing. */}
      {isKeyboardVisible ? null : (
        <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
          <Button
            title={vm.continueLabel}
            variant="brand"
            onPress={vm.continueToNext}
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
      <PersonSheet
        visible={vm.sheet !== null}
        kind={vm.sheet?.kind ?? 'dependent'}
        initialName={vm.editing?.name}
        initialRelationship={vm.editing?.relationship}
        relationships={vm.relationships}
        onSaveCoApplicant={vm.saveCoApplicant}
        onSaveDependent={vm.saveDependent}
        onRemove={vm.editing ? () => vm.removeDependent(vm.editing!.id) : undefined}
        onClose={vm.closeSheet}
      />
      <AppDialog {...vm.dialog} />
    </KeyboardAvoidingView>
  );
};

// colors.headerGradientEnd (#518EF9) as rgb, for the glow
const BLUE = '81,142,249';

/** Space kept between the focused field and the keyboard (Android) */
const KEYBOARD_GAP = spacing.xxxl;

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
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  // Pushed down so "Step 1 of 4" + the title sit together below the building
  stepOf: {
    ...typographyPresets.bodyBold,
    marginTop: spacing.xxl + spacing.xs,
    color: colors.primary,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    marginTop: spacing.xs,
    color: colors.navy,
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
  // Sections sit on the page (no cards), guest-page rhythm
  sections: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sectionGap,
  },
  half: {
    flex: 1,
  },
  city: {
    flex: 1.15,
  },
  state: {
    flex: 1,
  },
  zip: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
    backgroundImage: `linear-gradient(180deg, rgba(238, 243, 249, 0) 0%, ${colors.pageTint} 35%)`,
  },
});

export default RentalApplicationScreen;

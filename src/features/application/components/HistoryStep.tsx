/**
 * HistoryStep: step 2 of the rental application, "Rental & Financial
 * History" (from the design; sections laid on the page like step 1):
 *  - Rental History: saved residences as rows (house
 *    avatar, address, "Rented · Jan 2020 – Present · $1,850/mo", edit),
 *    then the inline form (hold type, address, landlord, dates, rent,
 *    reason for leaving) with "Add Residence" / "Cancel", or
 *    "+ Add Another Residence" when the form is closed
 *  - Employment & Income: status + annual income; employer, job title and
 *    dates only for employed / self-employed
 * Dropdowns open the shared CategorySheet.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { moderateScale as ms } from '@/utils/responsive';
import { HistoryStepModel, residenceSummary } from '../hooks/useHistoryStep';
import { FieldInput, FieldRow, LabeledField } from './ApplicationFields';
import { ApplicationIcon } from './ApplicationIcon';
import { ApplicationSection } from './ApplicationSection';
import { EditButton, PersonRow } from './PersonRow';

export const HistoryStep: React.FC<{ vm: HistoryStepModel }> = ({ vm }) => {
  const r = vm.residence;
  const re = vm.residenceErrors;
  const e = vm.employment;
  const ee = vm.employmentErrors;

  return (
    <View style={styles.sections}>
      <ApplicationSection
        title="Rental History"
        subtitle="Where you've lived and what you pay now."
      >
        {vm.residences.map(res => {
          const s = residenceSummary(res);
          return (
            <PersonRow
              key={res.id}
              name={s.title}
              detail={`${s.place}\n${s.detail}`}
              detailLines={2}
              right={
                <EditButton label={`Edit ${s.title}`} onPress={() => vm.editResidence(res.id)} />
              }
            />
          );
        })}

        {vm.formOpen ? (
          <>
            <LabeledField label="How did you hold this residence?" required error={re.holdType}>
              <FormSelect
                value={vm.holdTypeLabel}
                placeholder="Select..."
                onPress={() => vm.openPicker('holdType')}
                accessibilityLabel="How did you hold this residence"
              />
            </LabeledField>
            <FieldRow>
              <LabeledField label="Street Address 1" required error={re.street1} style={styles.flex}>
                <FieldInput
                  value={r.street1}
                  onChangeText={t => vm.setResidenceField('street1', t)}
                  invalid={!!re.street1}
                  autoComplete="address-line1"
                  maxLength={80}
                  accessibilityLabel="Residence street address 1"
                />
              </LabeledField>
              <LabeledField label="Street Address 2" style={styles.flex}>
                <FieldInput
                  value={r.street2}
                  onChangeText={t => vm.setResidenceField('street2', t)}
                  placeholder="Apt, suite, unit"
                  autoComplete="address-line2"
                  maxLength={80}
                  accessibilityLabel="Residence street address 2"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="City" required error={re.city} style={styles.city}>
                <FieldInput
                  value={r.city}
                  onChangeText={t => vm.setResidenceField('city', t)}
                  invalid={!!re.city}
                  autoCapitalize="words"
                  maxLength={40}
                  accessibilityLabel="Residence city"
                />
              </LabeledField>
              <LabeledField label="State" required error={re.stateId} style={styles.flex}>
                <FormSelect
                  value={r.stateId || undefined}
                  placeholder="--"
                  onPress={() => vm.openPicker('state')}
                  accessibilityLabel="Residence state"
                />
              </LabeledField>
              <LabeledField label="ZIP Code" required error={re.zip} style={styles.flex}>
                <FieldInput
                  value={r.zip}
                  onChangeText={t => vm.setResidenceField('zip', t)}
                  invalid={!!re.zip}
                  keyboardType="number-pad"
                  maxLength={5}
                  accessibilityLabel="Residence ZIP code"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="Landlord Name" style={styles.flex}>
                <FieldInput
                  value={r.landlordName}
                  onChangeText={t => vm.setResidenceField('landlordName', t)}
                  autoCapitalize="words"
                  maxLength={60}
                  accessibilityLabel="Landlord name"
                />
              </LabeledField>
              <LabeledField label="Landlord Contact" style={styles.flex}>
                <FieldInput
                  value={r.landlordContact}
                  onChangeText={t => vm.setResidenceField('landlordContact', t)}
                  placeholder="Phone or email"
                  autoCapitalize="none"
                  maxLength={80}
                  accessibilityLabel="Landlord contact"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="Start Date" required error={re.startDate} style={styles.flex}>
                <FieldInput
                  value={r.startDate}
                  onChangeText={t => vm.setResidenceField('startDate', t)}
                  invalid={!!re.startDate}
                  placeholder="dd/mm/yyyy"
                  rightIcon="calendar"
                  keyboardType="number-pad"
                  maxLength={10}
                  accessibilityLabel="Residence start date"
                />
              </LabeledField>
              <LabeledField
                label="End Date"
                hint="(blank if current)"
                error={re.endDate}
                style={styles.flex}
              >
                <FieldInput
                  value={r.endDate}
                  onChangeText={t => vm.setResidenceField('endDate', t)}
                  invalid={!!re.endDate}
                  placeholder="dd/mm/yyyy"
                  rightIcon="calendar"
                  keyboardType="number-pad"
                  maxLength={10}
                  accessibilityLabel="Residence end date"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField
                label="Monthly Rent"
                required={vm.rentRequired}
                error={re.rent}
                style={styles.flex}
              >
                <FieldInput
                  value={r.rent}
                  onChangeText={t => vm.setResidenceField('rent', t)}
                  invalid={!!re.rent}
                  prefix="$"
                  keyboardType="number-pad"
                  maxLength={11}
                  accessibilityLabel="Monthly rent"
                />
              </LabeledField>
              <LabeledField label="Reason for Leaving" style={styles.flex}>
                <FieldInput
                  value={r.reason}
                  onChangeText={t => vm.setResidenceField('reason', t)}
                  maxLength={80}
                  accessibilityLabel="Reason for leaving"
                />
              </LabeledField>
            </FieldRow>

            <View style={styles.actions}>
              <View style={styles.actionSlot}>
                <Button
                  title={vm.editing ? 'Save Residence' : 'Add Residence'}
                  variant="soft"
                  size="md"
                  onPress={vm.saveResidence}
                  style={styles.actionButton}
                />
              </View>
              <View style={styles.actionSlot}>
                <Button
                  title="Cancel"
                  variant="light"
                  size="md"
                  onPress={vm.cancelResidence}
                  style={[styles.actionButton, styles.cancelButton]}
                />
              </View>
            </View>
          </>
        ) : (
          <Button
            title="Add Another Residence"
            variant="soft"
            size="md"
            onPress={vm.addAnother}
            leftIcon={<ApplicationIcon name="plus" size={ms(16)} color={colors.navy} />}
          />
        )}
      </ApplicationSection>

      <ApplicationSection
        title="Employment & Income"
        subtitle="Your current job and yearly income."
      >
        <FieldRow>
          <LabeledField label="Employment Status" required error={ee.status} style={styles.flex}>
            <FormSelect
              value={vm.statusLabel}
              placeholder="Select..."
              onPress={() => vm.openPicker('status')}
              accessibilityLabel="Employment status"
            />
          </LabeledField>
          <LabeledField label="Annual Income" hint="(Pre-tax)" required error={ee.income} style={styles.flex}>
            <FieldInput
              value={e.income}
              onChangeText={t => vm.setEmploymentField('income', t)}
              invalid={!!ee.income}
              prefix="$"
              placeholder="Enter amount"
              keyboardType="number-pad"
              maxLength={11}
              accessibilityLabel="Annual income"
            />
          </LabeledField>
        </FieldRow>

        {vm.employed ? (
          <>
            <FieldRow>
              <LabeledField label="Employer Name" required error={ee.employer} style={styles.flex}>
                <FieldInput
                  value={e.employer}
                  onChangeText={t => vm.setEmploymentField('employer', t)}
                  invalid={!!ee.employer}
                  autoCapitalize="words"
                  maxLength={60}
                  accessibilityLabel="Employer name"
                />
              </LabeledField>
              <LabeledField label="Job Title" required error={ee.jobTitle} style={styles.flex}>
                <FieldInput
                  value={e.jobTitle}
                  onChangeText={t => vm.setEmploymentField('jobTitle', t)}
                  invalid={!!ee.jobTitle}
                  autoCapitalize="words"
                  maxLength={60}
                  accessibilityLabel="Job title"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="Start Date" required error={ee.startDate} style={styles.flex}>
                <FieldInput
                  value={e.startDate}
                  onChangeText={t => vm.setEmploymentField('startDate', t)}
                  invalid={!!ee.startDate}
                  placeholder="dd/mm/yyyy"
                  rightIcon="calendar"
                  keyboardType="number-pad"
                  maxLength={10}
                  accessibilityLabel="Employment start date"
                />
              </LabeledField>
              <LabeledField
                label="End Date"
                hint="(if applicable)"
                error={ee.endDate}
                style={styles.flex}
              >
                <FieldInput
                  value={e.endDate}
                  onChangeText={t => vm.setEmploymentField('endDate', t)}
                  invalid={!!ee.endDate}
                  placeholder="dd/mm/yyyy"
                  rightIcon="calendar"
                  keyboardType="number-pad"
                  maxLength={10}
                  accessibilityLabel="Employment end date"
                />
              </LabeledField>
            </FieldRow>
          </>
        ) : null}
      </ApplicationSection>

      <CategorySheet
        visible={vm.picker !== null}
        title={vm.pickerProps.title}
        categories={vm.pickerProps.options}
        selectedId={vm.pickerProps.selectedId}
        onSelect={vm.pick}
        onClose={vm.closePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Same rhythm as step 1: sections on the page, 40 apart
  sections: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sectionGap,
  },
  flex: {
    flex: 1,
  },
  city: {
    flex: 1.15,
  },
  // Secondary actions side by side: soft "Add Residence" + white "Cancel"
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  // Two equal halves; each button fills its half
  actionSlot: {
    flex: 1,
  },
  actionButton: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  // White button on the light page: pale blue rim so its edge shows
  cancelButton: {
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
});

export default HistoryStep;

/**
 * UnitTabContent: Add New Property → Unit body (under the Property | Unit
 * switch and the Unit/Home Info | Amenities | Gallery tabs).
 *  - Unit/Home Info (design): Units Added So Far + Add Unit, Property
 *    Context, Unit Basics, Unit Summary (Draft), Size & Configuration,
 *    Financials, Floor Plan, Unit Types Guide; each heading collapses
 *  - Amenities: search + amenity tiles for this unit (reuses the property
 *    tiles)
 *  - Gallery: unit photos (reuses the property photo field)
 * Sections sit on the page (app form rule).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/config/theme';
import { FieldInput, FieldRow, LabeledField } from '@/features/application/components/ApplicationFields';
import { ApplicationSection } from '@/features/application/components/ApplicationSection';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { moderateScale as ms } from '@/utils/responsive';
import { AmenityGrid, AmenityIcon, AmenitySearch } from './AmenityParts';
import { PROPERTY_AMENITIES } from './constants';
import { DescriptionField, PropertyImagesField } from './PropertyParts';
import { RoomSheet } from './RoomSheet';
import type { AddUnitVM, UnitSection } from './useAddUnit';
import {
  DraftPill,
  FloorPlanField,
  PropertyContextCard,
  SectionChevron,
  StudentHousingPanel,
  UnitIcon,
  UnitSummaryCard,
  UnitTypesGuide,
  UnitsBar,
} from './UnitParts';

/** Rent / deposit currency (same as the property's value field) */
const CURRENCY = '$';

const numeric = (t: string) => t.replace(/[^0-9.]/g, '');

export const UnitTabContent: React.FC<{
  unit: AddUnitVM;
  propertyName?: string;
  propertyType?: string;
}> = ({ unit, propertyName, propertyType }) => {
  const { form, errors, setField } = unit;

  if (unit.subTab === 'amenities') {
    const q = unit.amenityQuery.trim().toLowerCase();
    return (
      <View style={styles.sections}>
        <ApplicationSection
          title="Unit Amenities"
          subtitle="Select the amenities this unit has."
          icon="layers"
        >
          <AmenitySearch value={unit.amenityQuery} onChangeText={unit.setAmenityQuery} />
          <AmenityGrid
            amenities={
              q ? PROPERTY_AMENITIES.filter(a => a.label.toLowerCase().includes(q)) : PROPERTY_AMENITIES
            }
            selected={unit.amenities}
            onToggle={unit.toggleAmenity}
          />
        </ApplicationSection>
      </View>
    );
  }

  if (unit.subTab === 'gallery') {
    return (
      <View style={styles.sections}>
        <ApplicationSection
          title="Unit Gallery"
          subtitle="Add photos of this unit."
          icon={<UnitIcon name="image" size={ms(22)} color={colors.primary} />}
        >
          <PropertyImagesField
            images={unit.photos}
            onUpload={unit.uploadPhotos}
            onRemove={unit.removePhoto}
          />
        </ApplicationSection>
      </View>
    );
  }

  /** Collapsible heading: chevron beside it; body only while open */
  const chevron = (s: UnitSection, label: string) => (
    <SectionChevron open={unit.isOpen(s)} onPress={() => unit.toggleSection(s)} label={label} />
  );

  return (
    <View style={styles.sections}>
      <UnitsBar
        unitLabel={unit.unitLabel}
        onPickUnit={() => unit.openPicker('unit')}
        onAddUnit={unit.addUnit}
      />

      {/* Design card: its own icon + title inside */}
      <PropertyContextCard
        property={propertyName}
        type={propertyType}
        unitsSoFar={unit.savedCount}
      />

      {/* Unit basics */}
      <ApplicationSection
        title="Unit Basics"
        icon={<UnitIcon name="door" size={ms(22)} color={colors.primary} />}
        right={chevron('basics', 'Unit Basics')}
      >
        {unit.isOpen('basics') ? (
          <>
            <FieldRow>
              <LabeledField
                label="Unit Number"
                required
                error={errors.unitNumber}
                style={styles.half}
              >
                <FieldInput
                  value={form.unitNumber}
                  onChangeText={t => setField('unitNumber', t)}
                  invalid={!!errors.unitNumber}
                  placeholder="e.g. 101, A1"
                  autoCapitalize="characters"
                  maxLength={12}
                  accessibilityLabel="Unit number"
                />
              </LabeledField>
              <LabeledField label="Tower" style={styles.half}>
                <FieldInput
                  value={form.tower}
                  onChangeText={t => setField('tower', t)}
                  placeholder="e.g. Tower A"
                  autoCapitalize="words"
                  maxLength={30}
                  accessibilityLabel="Tower"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="Unit Type" required error={errors.typeId} style={styles.half}>
                <FormSelect
                  value={unit.typeLabel}
                  placeholder="Select unit type"
                  onPress={() => unit.openPicker('type')}
                  accessibilityLabel="Unit type"
                />
              </LabeledField>
              <LabeledField label="Floor" style={styles.half}>
                <FieldInput
                  value={form.floor}
                  onChangeText={t => setField('floor', t.replace(/[^0-9-]/g, ''))}
                  placeholder="e.g. 1"
                  keyboardType="number-pad"
                  maxLength={4}
                  accessibilityLabel="Floor"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField
                label="Ownership Type"
                required
                error={errors.ownershipId}
                style={styles.half}
              >
                <FormSelect
                  value={unit.ownershipLabel}
                  placeholder="Select ownership"
                  onPress={() => unit.openPicker('ownership')}
                  accessibilityLabel="Ownership type"
                />
              </LabeledField>
              <LabeledField label="Lease Type" style={styles.half}>
                <FormSelect
                  value={unit.leaseLabel}
                  placeholder="Select lease type"
                  onPress={() => unit.openPicker('lease')}
                  accessibilityLabel="Lease type"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="Management Model" style={styles.half}>
                <FormSelect
                  value={unit.managementLabel}
                  placeholder="Select model"
                  onPress={() => unit.openPicker('management')}
                  accessibilityLabel="Management model"
                />
              </LabeledField>
              <View style={styles.half} />
            </FieldRow>
            <LabeledField label="Unit Description">
              <DescriptionField
                value={form.description}
                onChangeText={t => setField('description', t)}
                placeholder="Describe this unit — layout highlights, unique features, recent upgrades, views, etc."
                accessibilityLabel="Unit description"
              />
            </LabeledField>
          </>
        ) : null}
      </ApplicationSection>

      {/* Unit summary (read-only, follows the form) */}
      <ApplicationSection
        title="Unit Summary"
        icon={<UnitIcon name="list" size={ms(22)} color={colors.primary} />}
        right={
          <View style={styles.headRight}>
            <DraftPill saved={unit.summary.saved} />
            {chevron('summary', 'Unit Summary')}
          </View>
        }
      >
        {unit.isOpen('summary') ? (
          <UnitSummaryCard
            unitNo={unit.summary.unitNo}
            type={unit.summary.type}
            floor={unit.summary.floor}
            area={unit.summary.area}
            rent={unit.summary.rent}
            currency={CURRENCY}
          />
        ) : null}
      </ApplicationSection>

      {/* Size & configuration */}
      <ApplicationSection
        title="Size & Configuration"
        icon={<UnitIcon name="scan" size={ms(22)} color={colors.primary} />}
        right={chevron('size', 'Size & Configuration')}
      >
        {unit.isOpen('size') ? (
          <>
            <FieldRow>
              <LabeledField label="Carpet Area" style={styles.half}>
                <FieldInput
                  value={form.carpetArea}
                  onChangeText={t => setField('carpetArea', numeric(t))}
                  placeholder="0"
                  suffix="sq ft"
                  keyboardType="decimal-pad"
                  maxLength={8}
                  accessibilityLabel="Carpet area in square feet"
                />
              </LabeledField>
              <LabeledField label="Total Area" style={styles.half}>
                <FieldInput
                  value={form.totalArea}
                  onChangeText={t => setField('totalArea', numeric(t))}
                  placeholder="0"
                  suffix="sq ft"
                  keyboardType="decimal-pad"
                  maxLength={8}
                  accessibilityLabel="Total area in square feet"
                />
              </LabeledField>
            </FieldRow>
            <FieldRow>
              <LabeledField label="Total Rooms" style={styles.half}>
                <FieldInput
                  value={form.rooms}
                  onChangeText={t => setField('rooms', t.replace(/\D/g, ''))}
                  placeholder="0"
                  keyboardType="number-pad"
                  maxLength={3}
                  accessibilityLabel="Total rooms"
                />
              </LabeledField>
              <LabeledField label="Total Bathrooms" style={styles.half}>
                <FieldInput
                  value={form.bathrooms}
                  onChangeText={t => setField('bathrooms', t.replace(/\D/g, ''))}
                  placeholder="0"
                  keyboardType="number-pad"
                  maxLength={3}
                  accessibilityLabel="Total bathrooms"
                />
              </LabeledField>
            </FieldRow>
            <StudentHousingPanel
              value={unit.studentHousing}
              onChange={unit.toggleStudentHousing}
              rooms={unit.rooms}
              onAddRoom={unit.openAddRoom}
              onViewRoom={unit.openRoom}
            />
          </>
        ) : null}
      </ApplicationSection>

      {/* Financials */}
      <ApplicationSection
        title="Financials"
        icon={<UnitIcon name="banknote" size={ms(22)} color={colors.primary} />}
        right={chevron('financials', 'Financials')}
      >
        {unit.isOpen('financials') ? (
          <FieldRow>
            <LabeledField label="Rent Amount" required error={errors.rent} style={styles.half}>
              <FieldInput
                value={form.rent}
                onChangeText={t => setField('rent', numeric(t))}
                invalid={!!errors.rent}
                prefix={CURRENCY}
                placeholder="0.00"
                keyboardType="decimal-pad"
                maxLength={12}
                accessibilityLabel="Rent amount"
              />
            </LabeledField>
            <LabeledField label="Security Deposit" style={styles.half}>
              <FieldInput
                value={form.deposit}
                onChangeText={t => setField('deposit', numeric(t))}
                prefix={CURRENCY}
                placeholder="0.00"
                keyboardType="decimal-pad"
                maxLength={12}
                accessibilityLabel="Security deposit"
              />
            </LabeledField>
          </FieldRow>
        ) : null}
      </ApplicationSection>

      {/* Floor plan */}
      <ApplicationSection
        title="Floor Plan"
        icon="fileText"
        right={chevron('floorPlan', 'Floor Plan')}
      >
        {unit.isOpen('floorPlan') ? (
          <FloorPlanField
            drawings={unit.floorPlans}
            onUpload={unit.uploadFloorPlan}
            onRemove={unit.removeFloorPlan}
          />
        ) : null}
      </ApplicationSection>

      {/* Unit types guide (read-only) */}
      <ApplicationSection
        title="Unit Types Guide"
        icon={<AmenityIcon name="info" size={ms(22)} color={colors.primary} />}
        right={chevron('guide', 'Unit Types Guide')}
      >
        {unit.isOpen('guide') ? <UnitTypesGuide /> : null}
      </ApplicationSection>

      <RoomSheet {...unit.roomSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  sections: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sectionGap,
  },
  half: {
    flex: 1,
  },
  headRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

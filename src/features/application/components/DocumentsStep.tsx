/**
 * DocumentsStep: step 3 of the rental application, "Property Requirements
 * & Documents" (from the design; sections laid on the page like steps 1–2):
 *  - Verification & Documents: progress ring + "2 of 4 uploaded"; one row
 *    per document (icon tile, title + red star when required, hint). Done
 *    rows show "✓ Uploaded" (secondary blue, app done colour) + file name
 *    and a ⋮ menu (replace / remove); others an "Upload" button.
 *  - Lifestyle & Logistics: Domestic Animals & Pets (Yes / No toggle, pet
 *    rows with photo + edit, "+ Add Pet"), Resident Vehicle & Parking
 *    (vehicle rows + edit, "+ Add Vehicle"), Storage Allocation (Yes / No
 *    dropdown).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { MoreVerticalIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { moderateScale as ms } from '@/utils/responsive';
import { PET_TYPES } from '../constants';
import { DocumentsStepModel, petSummary } from '../hooks/useDocumentsStep';
import type { ApplicationDocument, ApplicationIconName } from '../types';
import { ApplicationIcon } from './ApplicationIcon';
import { ApplicationSection } from './ApplicationSection';
import { LifestyleSheet } from './LifestyleSheet';
import { EditButton, PersonRow } from './PersonRow';
import { ProgressRing } from './ProgressRing';

const TILE = ms(40);

const IconTile: React.FC<{ icon: ApplicationIconName }> = ({ icon }) => (
  <View style={styles.tile}>
    <ApplicationIcon name={icon} size={ms(20)} color={colors.navy} />
  </View>
);

const DocumentRow: React.FC<{
  doc: ApplicationDocument;
  missing: boolean;
  onUpload: () => void;
  onMenu: () => void;
}> = ({ doc, missing, onUpload, onMenu }) => (
  <View style={[styles.docRow, missing && styles.docRowMissing]}>
    <IconTile icon={doc.icon} />
    <View style={styles.docText}>
      <Text style={styles.docTitle} numberOfLines={2}>
        {doc.title}
        {doc.required ? <Text style={styles.star}> *</Text> : null}
      </Text>
      <Text style={styles.docHint} numberOfLines={2}>
        {doc.fileName ? doc.fileName : doc.hint}
      </Text>
    </View>
    {doc.fileName ? (
      <>
        <View style={styles.uploaded}>
          <ApplicationIcon name="circleCheck" size={ms(14)} color={colors.headerGradientEnd} />
          <Text style={styles.uploadedText}>Uploaded</Text>
        </View>
        <Pressable
          onPress={onMenu}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`${doc.title} options`}
          style={({ pressed }) => [styles.more, pressed && styles.pressed]}
        >
          <MoreVerticalIcon size={ms(16)} color={colors.navy} />
        </Pressable>
      </>
    ) : (
      <Button
        title="Upload"
        variant="soft"
        size="md"
        onPress={onUpload}
        accessibilityLabel={`Upload ${doc.title}`}
        leftIcon={<ApplicationIcon name="upload" size={ms(15)} color={colors.navy} />}
        style={styles.uploadButton}
      />
    )}
  </View>
);

/** Yes / No segmented switch (tab rule: container 12, highlight parallel) */
const YesNo: React.FC<{ value: boolean; onChange: (v: boolean) => void; label: string }> = ({
  value,
  onChange,
  label,
}) => (
  <View style={styles.toggle} accessibilityRole="radiogroup" accessibilityLabel={label}>
    {[true, false].map(v => {
      const on = v === value;
      return (
        <Pressable
          key={String(v)}
          onPress={() => onChange(v)}
          accessibilityRole="radio"
          accessibilityState={{ selected: on }}
          accessibilityLabel={`${label}: ${v ? 'Yes' : 'No'}`}
          style={[styles.toggleOption, on && styles.toggleOn]}
        >
          <Text style={[styles.toggleText, on && styles.toggleTextOn]}>{v ? 'Yes' : 'No'}</Text>
          {on ? <RenterIcon name="check" size={ms(10)} color={colors.white} /> : null}
        </Pressable>
      );
    })}
  </View>
);

/** One lifestyle question: icon tile, title, optional line, right control, content */
const LifestyleItem: React.FC<{
  icon: ApplicationIconName;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ icon, title, subtitle, right, children }) => (
  <View>
    <View style={styles.itemHead}>
      <IconTile icon={icon} />
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
    {children ? <View style={styles.itemBody}>{children}</View> : null}
  </View>
);

export const DocumentsStep: React.FC<{ vm: DocumentsStepModel }> = ({ vm }) => (
  <View style={styles.sections}>
    <ApplicationSection
      title="Verification & Documents"
      subtitle="Verify your identity, income and job."
      right={
        <View style={styles.progress}>
          <ProgressRing progress={vm.uploaded / vm.total} />
          <Text style={styles.progressText}>{`${vm.uploaded} of ${vm.total} uploaded`}</Text>
        </View>
      }
    >
      {vm.documents.map(doc => (
        <DocumentRow
          key={doc.id}
          doc={doc}
          missing={vm.showErrors && doc.required && !doc.fileName}
          onUpload={() => vm.upload(doc.id)}
          onMenu={() => vm.openDocumentMenu(doc.id)}
        />
      ))}
    </ApplicationSection>

    <ApplicationSection
      title="Lifestyle & Logistics"
      subtitle="Help us match you with the right property."
    >
      <LifestyleItem
        icon="paw"
        title="Domestic Animals & Pets"
        right={<YesNo value={vm.hasPets} onChange={vm.setHasPets} label="Pets" />}
      >
        {vm.hasPets ? (
          <>
            {vm.pets.map(p => (
              <PersonRow
                key={p.id}
                icon="paw"
                photo={p.photo}
                name={[p.type, p.breed].filter(Boolean).join(' – ')}
                detail={p.weight ? `${p.weight} kg` : 'Weight not added'}
                right={<EditButton label={`Edit ${petSummary(p)}`} onPress={() => vm.editPet(p.id)} />}
              />
            ))}
            {vm.petsMissing && vm.showErrors ? (
              <Text style={styles.error}>Add your pet, or choose No.</Text>
            ) : null}
            <Button
              title="Add Pet"
              variant="soft"
              size="md"
              onPress={vm.addPet}
              leftIcon={<ApplicationIcon name="plus" size={ms(16)} color={colors.navy} />}
            />
          </>
        ) : null}
      </LifestyleItem>

      <View style={styles.divider} />

      <LifestyleItem
        icon="car"
        title="Resident Vehicle & Parking"
        subtitle="Add your vehicle details (if any)."
      >
        {vm.vehicles.map(v => (
          <PersonRow
            key={v.id}
            icon="car"
            name={v.model}
            detail={v.plate || 'No plate added'}
            right={<EditButton label={`Edit ${v.model}`} onPress={() => vm.editVehicle(v.id)} />}
          />
        ))}
        <Button
          title="Add Vehicle"
          variant="soft"
          size="md"
          onPress={vm.addVehicle}
          leftIcon={<ApplicationIcon name="plus" size={ms(16)} color={colors.navy} />}
        />
      </LifestyleItem>

      <View style={styles.divider} />

      <LifestyleItem icon="package" title="Storage Allocation" subtitle="Do you need storage space?">
        <FormSelect
          value={vm.storageLabel}
          placeholder="Select..."
          onPress={vm.openStorage}
          accessibilityLabel="Storage allocation"
        />
      </LifestyleItem>
    </ApplicationSection>

    <CategorySheet
      visible={vm.storageOpen}
      title="Do you need storage space?"
      categories={vm.storageOptions}
      selectedId={vm.storage}
      onSelect={vm.pickStorage}
      onClose={vm.closeStorage}
    />
    <LifestyleSheet
      kind={vm.sheet?.kind ?? null}
      pet={vm.editingPet}
      vehicle={vm.editingVehicle}
      petTypes={PET_TYPES}
      onSavePet={vm.savePet}
      onSaveVehicle={vm.saveVehicle}
      onRemove={vm.removeFromSheet}
      onClose={vm.closeSheet}
    />
  </View>
);

const TOGGLE_PAD = 3;

const styles = StyleSheet.create({
  // Same rhythm as steps 1–2: sections on the page, 40 apart
  sections: {
    marginTop: spacing.sectionGap,
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sectionGap,
  },
  progress: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressText: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
    borderWidth: 1,
    borderColor: colors.white,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  docRowMissing: {
    borderColor: colors.error,
  },
  docText: {
    flex: 1,
  },
  docTitle: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  star: {
    color: colors.error,
  },
  docHint: {
    ...typographyPresets.caption,
    marginTop: ms(2),
    color: colors.textSecondary,
  },
  uploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  uploadedText: {
    ...typographyPresets.badge,
    color: colors.headerGradientEnd,
  },
  more: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
  },
  uploadButton: {
    paddingHorizontal: spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    padding: TOGGLE_PAD,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minWidth: ms(54),
    height: ms(32),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg - TOGGLE_PAD,
  },
  toggleOn: {
    backgroundImage: `linear-gradient(120deg, ${colors.buttonGradientStart} 0%, ${colors.buttonGradientEnd} 100%)`,
  },
  toggleText: {
    ...typographyPresets.segmentLabel,
    color: colors.textSecondary,
  },
  toggleTextOn: {
    color: colors.white,
  },
  itemHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  itemSubtitle: {
    ...typographyPresets.caption,
    marginTop: ms(2),
    color: colors.textSecondary,
  },
  itemBody: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: TILE_BORDER,
  },
  error: {
    ...typographyPresets.caption,
    color: colors.error,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default DocumentsStep;

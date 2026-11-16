/**
 * RoomSheet: "Add Room" bottom sheet for student housing (Unit tab), from the
 * design, in the app's tokens:
 *  - grab handle, "Add Room" title, round ✕
 *  - Room Details: Room No.*, Room Type*, Bed Count / Bathroom Count
 *    steppers, Bathroom Type, Room Status (Vacant shows a "DEFAULT" tag)
 *  - Bed Details: "x of y beds added"; empty dashed note until a bed count
 *    is set, then one row per bed with its bed type
 *  - footer: Cancel + Add Room (Save Room when viewing an existing room)
 * Keeps its own draft; hands the room back on save.
 */

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { ChevronDownIcon, CloseIcon } from '@/components/icons';
import { NumberStepper } from '@/components/NumberStepper';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { FieldInput, FieldRow, LabeledField } from '@/features/application/components/ApplicationFields';
import { ApplicationIcon } from '@/features/application/components/ApplicationIcon';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { FormSelect } from '@/features/renter/components/form/FormSelect';
import { formStyles } from '@/features/renter/components/form/formStyles';
import { CategorySheet } from '@/features/renter/components/inspection/CategorySheet';
import { moderateScale as ms } from '@/utils/responsive';
import {
  BATHROOM_TYPES,
  BED_TYPES,
  MAX_ROOM_BATHS,
  MAX_ROOM_BEDS,
  ROOM_STATUSES,
  ROOM_TYPES,
} from './constants';

export interface StudentRoom {
  roomNo: string;
  typeId: string;
  beds: number;
  baths: number;
  bathTypeId: string;
  statusId: string;
  /** Bed type id per bed ('' = not chosen yet) */
  bedTypes: string[];
}

export const EMPTY_ROOM: StudentRoom = {
  roomNo: '',
  typeId: '',
  beds: 0,
  baths: 0,
  bathTypeId: '',
  statusId: ROOM_STATUSES[0].id,
  bedTypes: [],
};

export const roomTypeLabel = (id: string) => ROOM_TYPES.find(t => t.id === id)?.label;

const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find(o => o.id === id)?.label;

type Picker = 'type' | 'bath' | 'status' | { bed: number } | null;

export const RoomSheet: React.FC<{
  visible: boolean;
  /** Existing room (view / edit), or null to add a new one */
  room: StudentRoom | null;
  onClose: () => void;
  onSave: (room: StudentRoom) => void;
}> = ({ visible, room, onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<StudentRoom>(EMPTY_ROOM);
  const [picker, setPicker] = useState<Picker>(null);

  // Fresh draft each time the sheet opens
  useEffect(() => {
    if (visible) {
      setDraft(room ?? EMPTY_ROOM);
      setPicker(null);
    }
  }, [visible, room]);

  const set = <K extends keyof StudentRoom>(key: K, value: StudentRoom[K]) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  /** Bed count also sizes the per-bed list (keeps chosen types) */
  const setBeds = (n: number) =>
    setDraft(prev => ({
      ...prev,
      beds: n,
      bedTypes: Array.from({ length: n }, (_, i) => prev.bedTypes[i] ?? ''),
    }));

  const bedsAdded = draft.bedTypes.filter(Boolean).length;
  const isDefaultStatus = draft.statusId === ROOM_STATUSES[0].id;

  const pickerProps =
    picker === 'type'
      ? { title: 'Room Type', options: ROOM_TYPES, selectedId: draft.typeId }
      : picker === 'bath'
        ? { title: 'Bathroom Type', options: BATHROOM_TYPES, selectedId: draft.bathTypeId }
        : picker === 'status'
          ? { title: 'Room Status', options: ROOM_STATUSES, selectedId: draft.statusId }
          : picker
            ? { title: `Bed ${picker.bed + 1} Type`, options: BED_TYPES, selectedId: draft.bedTypes[picker.bed] }
            : { title: '', options: [], selectedId: undefined };

  const pick = (id: string) => {
    if (picker === 'type') {
      set('typeId', id);
    } else if (picker === 'bath') {
      set('bathTypeId', id);
    } else if (picker === 'status') {
      set('statusId', id);
    } else if (picker) {
      const i = picker.bed;
      setDraft(prev => ({ ...prev, bedTypes: prev.bedTypes.map((t, j) => (j === i ? id : t)) }));
    }
    setPicker(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <KeyboardAvoidingView
        style={styles.avoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.head}>
            <Text style={styles.title} accessibilityRole="header">
              {room ? 'Room Details' : 'Add Room'}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <CloseIcon size={ms(11)} color={colors.navy} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Room details */}
            <SheetHeading title="Room Details" />
            <LabeledField label="Room No." required>
              <FieldInput
                value={draft.roomNo}
                onChangeText={t => set('roomNo', t)}
                placeholder="e.g. A, 101"
                autoCapitalize="characters"
                maxLength={10}
                accessibilityLabel="Room number"
              />
            </LabeledField>
            <LabeledField label="Room Type" required>
              <FormSelect
                value={labelOf(ROOM_TYPES, draft.typeId)}
                placeholder="Select room type"
                onPress={() => setPicker('type')}
                accessibilityLabel="Room type"
              />
            </LabeledField>
            <FieldRow>
              <LabeledField label="Bed Count" style={styles.half}>
                <NumberStepper
                  value={draft.beds}
                  onChange={setBeds}
                  max={MAX_ROOM_BEDS}
                  accessibilityLabel="Bed count"
                />
              </LabeledField>
              <LabeledField label="Bathroom Count" style={styles.half}>
                <NumberStepper
                  value={draft.baths}
                  onChange={n => set('baths', n)}
                  max={MAX_ROOM_BATHS}
                  accessibilityLabel="Bathroom count"
                />
              </LabeledField>
            </FieldRow>
            <LabeledField label="Bathroom Type">
              <FormSelect
                value={labelOf(BATHROOM_TYPES, draft.bathTypeId)}
                placeholder="Select bathroom type"
                onPress={() => setPicker('bath')}
                accessibilityLabel="Bathroom type"
              />
            </LabeledField>
            <LabeledField label="Room Status">
              <Pressable
                onPress={() => setPicker('status')}
                accessibilityRole="button"
                accessibilityLabel={`Room status, ${labelOf(ROOM_STATUSES, draft.statusId)}`}
                style={({ pressed }) => [formStyles.field, styles.select, pressed && styles.pressed]}
              >
                <Text style={styles.selectValue}>{labelOf(ROOM_STATUSES, draft.statusId)}</Text>
                {isDefaultStatus ? (
                  <View style={styles.defaultTag}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                ) : null}
                <View style={styles.flex} />
                <ChevronDownIcon size={ms(14)} color={colors.navy} />
              </Pressable>
            </LabeledField>

            <View style={styles.rule} />

            {/* Bed details */}
            <SheetHeading
              title="Bed Details"
              right={`${bedsAdded} of ${draft.beds > 0 ? draft.beds : '—'} beds added`}
            />
            {draft.beds === 0 ? (
              <View style={styles.bedsEmpty}>
                <ApplicationIcon name="bed" size={ms(24)} color={colors.textSecondary} />
                <Text style={styles.bedsEmptyText}>
                  Enter a bed count in Room Details to add beds.
                </Text>
              </View>
            ) : (
              <View style={styles.beds}>
                {draft.bedTypes.map((t, i) => (
                  <View key={`bed-${i}`} style={styles.bedRow}>
                    <View style={styles.bedTile}>
                      <ApplicationIcon name="bed" size={ms(16)} color={colors.navy} />
                    </View>
                    <Text style={styles.bedName}>{`Bed ${i + 1}`}</Text>
                    <View style={styles.bedSelect}>
                      <FormSelect
                        value={labelOf(BED_TYPES, t)}
                        placeholder="Bed type"
                        onPress={() => setPicker({ bed: i })}
                        accessibilityLabel={`Bed ${i + 1} type`}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
            <Button title="Cancel" variant="soft" onPress={onClose} style={styles.flex} />
            <Button
              title={room ? 'Save Room' : 'Add Room'}
              variant="brand"
              onPress={() => onSave(draft)}
              style={styles.flex}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      <CategorySheet
        visible={picker !== null}
        title={pickerProps.title}
        categories={pickerProps.options}
        selectedId={pickerProps.selectedId}
        onSelect={pick}
        onClose={() => setPicker(null)}
      />
    </Modal>
  );
};

/** Section heading inside the sheet: bed tile, title, optional note right */
const SheetHeading: React.FC<{ title: string; right?: string }> = ({ title, right }) => (
  <View style={styles.sheetHeading}>
    <View style={styles.headTile}>
      <ApplicationIcon name="bed" size={ms(18)} color={colors.primary} />
    </View>
    <Text style={styles.sheetHeadingText}>{title}</Text>
    {right ? <Text style={styles.sheetHeadingNote}>{right}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  half: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  avoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.header,
    borderTopRightRadius: borderRadius.header,
  },
  handle: {
    alignSelf: 'center',
    width: ms(40),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: TILE_BORDER,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TILE_BORDER,
  },
  title: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  close: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  sheetHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headTile: {
    width: ms(32),
    height: ms(32),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.headerGradientEnd}1A`,
  },
  sheetHeadingText: {
    ...typographyPresets.formHeading,
    flex: 1,
    color: colors.navy,
  },
  sheetHeadingNote: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  // Room status select (value, DEFAULT tag, chevron)
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectValue: {
    ...typographyPresets.body,
    color: colors.textPrimary,
  },
  defaultTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  defaultText: {
    ...typographyPresets.tag,
    color: colors.navy,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: TILE_BORDER,
  },
  // Bed details
  bedsEmpty: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
    backgroundColor: TILE_BG,
  },
  bedsEmptyText: {
    ...typographyPresets.cardSubtitle,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  beds: {
    gap: spacing.sm,
  },
  bedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bedTile: {
    width: ms(36),
    height: ms(36),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.headerGradientEnd}1A`,
  },
  bedName: {
    ...typographyPresets.bodyBold,
    width: ms(52),
    color: colors.navy,
  },
  bedSelect: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  pressed: {
    opacity: 0.7,
  },
});
